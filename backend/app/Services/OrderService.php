<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class OrderService
{
    public function getAll(bool $paginate = false, int $perPage = 15)
    {
        $query = Order::with('items.product')->latest();
        return $paginate ? $query->paginate($perPage) : $query->get();
    }

    public function createOrder(array $data): Order
    {
        return DB::transaction(function () use ($data) {
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
    }

    public function updateStatus(Order $order, array $data): Order
    {
        $order->update($data);
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

        return $order;
    }
}
