<?php

namespace App\Services;

use App\Events\NewOrderEvent;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class OrderService
{
    public function getAll(bool $paginate = false, int $perPage = 15, array $filters = [])
    {
        $query = Order::with(['items.product', 'bankAccount'])->latest();

        if (!empty($filters['payment_status'])) {
            $query->where('payment_status', $filters['payment_status']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Filter tanggal berbasis zona waktu lokal pengguna (Asia/Seoul).
        // created_at tersimpan UTC, jadi bandingkan window UTC dari hari lokal tersebut.
        $timezone = 'Asia/Seoul';

        if (!empty($filters['start_date']) || !empty($filters['end_date'])) {
            // Rentang tanggal bebas (dipakai untuk rekap bulanan/periode).
            $start = !empty($filters['start_date'])
                ? \Carbon\Carbon::parse($filters['start_date'], $timezone)->startOfDay()->setTimezone('UTC')
                : null;
            $end = !empty($filters['end_date'])
                ? \Carbon\Carbon::parse($filters['end_date'], $timezone)->endOfDay()->setTimezone('UTC')
                : null;

            if ($start && $end) {
                $query->whereBetween('created_at', [$start, $end]);
            } elseif ($start) {
                $query->where('created_at', '>=', $start);
            } elseif ($end) {
                $query->where('created_at', '<=', $end);
            }
        } else {
            // Tanpa parameter date: default hanya pesanan hari ini.
            $targetDate = !empty($filters['date']) ? $filters['date'] : now($timezone)->toDateString();
            $start = \Carbon\Carbon::parse($targetDate, $timezone)->startOfDay()->setTimezone('UTC');
            $end = \Carbon\Carbon::parse($targetDate, $timezone)->endOfDay()->setTimezone('UTC');
            $query->whereBetween('created_at', [$start, $end]);
        }

        return $paginate ? $query->paginate($perPage) : $query->get();
    }

    /**
     * Riwayat pesanan milik satu pengguna (berdasarkan user_id, atau
     * customer_phone sebagai fallback untuk pesanan lama tanpa user_id).
     */
    public function getForUser(string $userId, ?string $phone = null, bool $paginate = false, int $perPage = 15)
    {
        $query = Order::with('items.product')
            ->where(function ($q) use ($userId, $phone) {
                $q->where('user_id', $userId);

                if (!empty($phone)) {
                    $q->orWhere('customer_phone', $phone);
                }
            })
            ->latest();

        return $paginate ? $query->paginate($perPage) : $query->get();
    }

    public function createOrder(array $data): Order
    {
        $order = DB::transaction(function () use ($data) {
            // Handle Payment Receipt Upload
            if (isset($data['payment_receipt']) && $data['payment_receipt'] instanceof \Illuminate\Http\UploadedFile) {
                $data['payment_receipt'] = $data['payment_receipt']->store('receipts', 'public');
                $data['payment_status'] = 'awaiting_verification';
            }

            // Create Order
            $order = Order::create([
                'user_id' => $data['user_id'] ?? null,
                'customer_name' => $data['customer_name'] ?? null,
                'customer_phone' => $data['customer_phone'] ?? null,
                'table_number' => $data['table_number'] ?? null,
                'bank_account_id' => $data['bank_account_id'] ?? null,
                'payment_receipt' => $data['payment_receipt'] ?? null,
                'payment_status' => $data['payment_status'] ?? 'unpaid',
            ]);

            $totalPrice = 0;

            // Create Order Items
            foreach ($data['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price, // snapshot of current price
                ]);

                $totalPrice += ($product->price * $item['quantity']);
            }

            // Update Total Price
            $order->update(['total_price' => $totalPrice]);

            return $order->load('items.product');
        });

        
        
        return $order;
    }

    public function updateStatus(Order $order, array $data): Order
    {
        $newStatus = $data['status'] ?? null;
        $newPaymentStatus = $data['payment_status'] ?? null;

        // Sinkronisasi status pesanan & status pembayaran
        // Titik temu: preparing <=> paid
        if ($newStatus === 'preparing') {
            $data['payment_status'] = 'paid';
        }

        if ($newPaymentStatus === 'paid' && $newStatus === null) {
            if (in_array($order->status, ['pending', null])) {
                $data['status'] = 'preparing';
            }
        }

        // Pesanan dibatalkan/ditolak: status pembayaran kembali menjadi unpaid
        if ($newStatus === 'cancelled') {
            $data['payment_status'] = 'unpaid';
        }

        $order->update($data);
        $order->refresh();

        // Broadcast perubahan ke channel unik per nomor pesanan
        broadcast(new \App\Events\OrderStatusUpdatedEvent($order));

        return $order;
    }

    public function uploadReceipt(Order $order, \Illuminate\Http\UploadedFile $file): Order
    {
        if ($order->payment_receipt) {
            Storage::disk('public')->delete($order->payment_receipt);
        }

        $path = $file->store('receipts', 'public');
        
        $order->update([
            'payment_receipt' => $path,
            'payment_status' => 'awaiting_verification'
        ]);
        $order->refresh();
        // Broadcast ke admin agar bukti bayar tampil realtime di halaman detail
        broadcast(new \App\Events\OrderStatusUpdatedEvent($order));
        // Broadcast event ke channel 'new-order' via Pusher
        try {
            broadcast(new NewOrderEvent($order));
        } catch (\Throwable $e) {
            Log::error('Gagal mengirim broadcast NewOrderEvent: ' . $e->getMessage());
        }

        return $order;
    }
}
