<?php

namespace App\Services;

use App\Events\NewOrderEvent;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class OrderService
{
    public function getAll(bool $paginate = false, int $perPage = 50, array $filters = [])
    {
        $query = Order::with(['items.product.category', 'user', 'bankAccount'])->latest();

        // 1. Search Query
        if (!empty($filters['search']) || !empty($filters['q'])) {
            $search = trim($filters['search'] ?? $filters['q']);
            $query->where(function ($q) use ($search) {
                $q->where('id', 'ILIKE', "%{$search}%")
                  ->orWhere('id', 'LIKE', "%{$search}%")
                  ->orWhere('customer_name', 'ILIKE', "%{$search}%")
                  ->orWhere('customer_name', 'LIKE', "%{$search}%")
                  ->orWhere('customer_phone', 'ILIKE', "%{$search}%")
                  ->orWhere('customer_phone', 'LIKE', "%{$search}%")
                  ->orWhere('table_number', 'ILIKE', "%{$search}%")
                  ->orWhere('table_number', 'LIKE', "%{$search}%");
            });
        }

        // 2. Status Filter
        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            $status = $filters['status'];
            if ($status === 'Payment Verification' || $status === 'awaiting_verification') {
                $query->where(function ($q) {
                    $q->where('status', 'pending')
                      ->orWhere('payment_status', 'awaiting_verification');
                });
            } elseif ($status === 'Processing' || $status === 'preparing') {
                $query->where('status', 'preparing');
            } elseif ($status === 'Ready' || $status === 'ready') {
                $query->where('status', 'ready');
            } elseif ($status === 'Completed' || $status === 'completed') {
                $query->where('status', 'completed');
            } elseif ($status === 'Cancelled' || $status === 'cancelled') {
                $query->where('status', 'cancelled');
            } else {
                $query->where('status', $status);
            }
        }

        // 3. Payment Status Filter
        if (!empty($filters['payment_status'])) {
            $pStatus = $filters['payment_status'];
            if ($pStatus === 'Verified') {
                $query->where('payment_status', 'paid');
            } elseif ($pStatus === 'Waiting Verification') {
                $query->where('payment_status', 'awaiting_verification');
            } else {
                $query->where('payment_status', $pStatus);
            }
        }

        // 4. Date filter
        if (!empty($filters['date'])) {
            $query->whereDate('created_at', Carbon::parse($filters['date']));
        } elseif (!empty($filters['month'])) {
            $date = Carbon::parse($filters['month'] . '-01');
            $query->whereYear('created_at', $date->year)
                  ->whereMonth('created_at', $date->month);
        }

        return $paginate ? $query->paginate($perPage) : $query->get();
    }

    public function createOrder(array $data): Order
    {
        $order = DB::transaction(function () use ($data) {
            $paymentReceiptPath = null;

            // Handle Payment Receipt Upload (File or URL string)
            if (isset($data['payment_receipt'])) {
                if ($data['payment_receipt'] instanceof \Illuminate\Http\UploadedFile) {
                    $paymentReceiptPath = $data['payment_receipt']->store('receipts', 'public');
                    $data['payment_status'] = 'awaiting_verification';
                } elseif (is_string($data['payment_receipt']) && !empty($data['payment_receipt'])) {
                    $paymentReceiptPath = $data['payment_receipt'];
                    if (empty($data['payment_status'])) {
                        $data['payment_status'] = 'awaiting_verification';
                    }
                }
            }

            // Customer Name & Phone resolution
            $customerName = $data['customer_name'] ?? ($data['customer']['name'] ?? null);
            $customerPhone = $data['customer_phone'] ?? ($data['customer']['phone'] ?? null);
            $tableNumber = $data['table_number'] ?? ($data['tableNumber'] ?? null);

            // Determine initial status & payment status
            $paymentStatus = $data['payment_status'] ?? 'unpaid';
            $status = $data['status'] ?? 'pending';

            // If cash POS payment or instant paid
            if ($paymentStatus === 'paid' && $status === 'pending') {
                $status = 'completed';
            }

            // Create Order
            $order = Order::create([
                'user_id' => $data['user_id'] ?? null,
                'customer_name' => $customerName,
                'customer_phone' => $customerPhone,
                'table_number' => $tableNumber,
                'status' => $status,
                'payment_status' => $paymentStatus,
                'payment_receipt' => $paymentReceiptPath,
                'bank_account_id' => $data['bank_account_id'] ?? null,
            ]);

            $totalPrice = 0;

            // Create Order Items
            if (!empty($data['items']) && is_array($data['items'])) {
                foreach ($data['items'] as $item) {
                    $productId = $item['product_id'] ?? ($item['productId'] ?? ($item['id'] ?? null));
                    $quantity = (int) ($item['quantity'] ?? 1);

                    $product = Product::find($productId);
                    $price = $product ? $product->price : (float) ($item['price'] ?? 0);

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $productId,
                        'quantity' => $quantity,
                        'price' => $price,
                    ]);

                    $totalPrice += ($price * $quantity);
                }
            }

            // Update Total Price
            $order->update(['total_price' => $totalPrice]);

            return $order->load(['items.product.category', 'bankAccount', 'user']);
        });

        // Broadcast event ke channel 'new-order' via Pusher
        try {
            broadcast(new NewOrderEvent($order));
        } catch (\Throwable $e) {
            Log::error('Gagal mengirim broadcast NewOrderEvent: ' . $e->getMessage());
        }

        return $order;
    }

    public function updateStatus(Order $order, array $data): Order
    {
        $updatePayload = [];

        if (isset($data['status'])) {
            $statusInput = $data['status'];
            $mappedStatus = match ($statusInput) {
                'Payment Verification' => 'pending',
                'Processing', 'Diproses', 'preparing' => 'preparing',
                'Ready', 'Siap', 'ready' => 'ready',
                'Completed', 'Selesai', 'completed' => 'completed',
                'Cancelled', 'Batal', 'cancelled' => 'cancelled',
                default => in_array($statusInput, ['pending', 'preparing', 'ready', 'completed', 'cancelled']) ? $statusInput : $order->status,
            };

            $updatePayload['status'] = $mappedStatus;

            // Automatically mark payment as paid if moved to preparing, ready, or completed
            if (in_array($mappedStatus, ['preparing', 'ready', 'completed']) && $order->payment_status !== 'paid') {
                $updatePayload['payment_status'] = 'paid';
            }
        }

        if (isset($data['payment_status'])) {
            $pInput = $data['payment_status'];
            $mappedPaymentStatus = match ($pInput) {
                'Verified', 'paid' => 'paid',
                'Waiting Verification', 'awaiting_verification' => 'awaiting_verification',
                'Rejected', 'unpaid' => 'unpaid',
                default => in_array($pInput, ['unpaid', 'awaiting_verification', 'paid']) ? $pInput : $order->payment_status,
            };

            $updatePayload['payment_status'] = $mappedPaymentStatus;

            if ($mappedPaymentStatus === 'paid' && $order->status === 'pending') {
                $updatePayload['status'] = 'preparing';
            }
        }

        if (!empty($updatePayload)) {
            $order->update($updatePayload);
        }

        return $order->fresh(['items.product.category', 'user', 'bankAccount']);
    }

    public function uploadReceipt(Order $order, \Illuminate\Http\UploadedFile $file): Order
    {
        if ($order->payment_receipt && !str_starts_with($order->payment_receipt, 'http')) {
            Storage::disk('public')->delete($order->payment_receipt);
        }

        $path = $file->store('receipts', 'public');

        $order->update([
            'payment_receipt' => $path,
            'payment_status' => 'awaiting_verification',
        ]);

        return $order->fresh(['items.product.category', 'user', 'bankAccount']);
    }
}
