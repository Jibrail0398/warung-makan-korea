<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $budi = User::where('phone_number', '081211112222')->first();
        $siti = User::where('phone_number', '081233334444')->first();
        $ahmad = User::where('phone_number', '081255556666')->first();

        $sampleOrders = [
            [
                'id' => 'INV-20260901-00001',
                'user_id' => $budi?->id,
                'customer_name' => $budi?->name ?? 'Budi Santoso',
                'customer_phone' => $budi?->phone_number ?? '081211112222',
                'table_number' => 'Meja 04',
                'status' => 'completed',
                'payment_status' => 'paid',
                'payment_receipt' => null,
                'bank_account_id' => 1,
                'items' => [
                    ['product_id' => 1, 'quantity' => 2],  // Bibimbap Spesial
                    ['product_id' => 7, 'quantity' => 1],  // Tteokbokki Spesial
                    ['product_id' => 25, 'quantity' => 2], // Korean Strawberry Milk
                ],
            ],
            [
                'id' => 'INV-20260902-00002',
                'user_id' => $siti?->id,
                'customer_name' => $siti?->name ?? 'Siti Rahmawati',
                'customer_phone' => $siti?->phone_number ?? '081233334444',
                'table_number' => 'Meja 02',
                'status' => 'preparing',
                'payment_status' => 'paid',
                'payment_receipt' => null,
                'bank_account_id' => 2,
                'items' => [
                    ['product_id' => 2, 'quantity' => 1],  // Beef Bulgogi Rice Bowl
                    ['product_id' => 9, 'quantity' => 1],  // Odeng / Eomuk Tang
                    ['product_id' => 27, 'quantity' => 1], // Yuzu Honey Iced Tea
                ],
            ],
            [
                'id' => 'INV-20260903-00003',
                'user_id' => $ahmad?->id,
                'customer_name' => $ahmad?->name ?? 'Ahmad Fauzi',
                'customer_phone' => $ahmad?->phone_number ?? '081255556666',
                'table_number' => null, // Take Away
                'status' => 'ready',
                'payment_status' => 'paid',
                'payment_receipt' => null,
                'bank_account_id' => 1,
                'items' => [
                    ['product_id' => 12, 'quantity' => 2], // Yangnyeom Chicken
                    ['product_id' => 14, 'quantity' => 1], // Gimmari Crispy
                    ['product_id' => 26, 'quantity' => 2], // Banana Uyu
                ],
            ],
            [
                'id' => 'INV-20260904-00004',
                'user_id' => null,
                'customer_name' => 'Dimas Pratama',
                'customer_phone' => '085711223344',
                'table_number' => 'Meja 06',
                'status' => 'pending',
                'payment_status' => 'awaiting_verification',
                'payment_receipt' => 'receipts/sample_transfer_receipt.jpg',
                'bank_account_id' => 3,
                'items' => [
                    ['product_id' => 16, 'quantity' => 1], // Sundubu Jjigae
                    ['product_id' => 24, 'quantity' => 1], // Nasi Putih Hangat
                    ['product_id' => 29, 'quantity' => 1], // Boricha
                ],
            ],
            [
                'id' => 'INV-20260905-00005',
                'user_id' => null,
                'customer_name' => 'Rina Kusuma',
                'customer_phone' => '089612345678',
                'table_number' => 'Meja 01',
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'payment_receipt' => null,
                'bank_account_id' => 1,
                'items' => [
                    ['product_id' => 8, 'quantity' => 1],  // Rose Tteokbokki
                    ['product_id' => 10, 'quantity' => 1], // Corndog Mozarella Full
                    ['product_id' => 28, 'quantity' => 1], // Oksusu-cha
                ],
            ],
            [
                'id' => 'INV-20260906-00006',
                'user_id' => null,
                'customer_name' => 'Hendra Setiawan',
                'customer_phone' => '081399887766',
                'table_number' => 'Meja 03',
                'status' => 'cancelled',
                'payment_status' => 'unpaid',
                'payment_receipt' => null,
                'bank_account_id' => null,
                'items' => [
                    ['product_id' => 4, 'quantity' => 1],  // Jajangmyeon
                    ['product_id' => 31, 'quantity' => 1], // Air Mineral Dingin
                ],
            ],
        ];

        foreach ($sampleOrders as $data) {
            $itemsData = $data['items'];
            unset($data['items']);

            // Calculate total price based on product prices
            $totalPrice = 0;
            $itemsToCreate = [];

            foreach ($itemsData as $item) {
                $product = Product::find($item['product_id']);
                if ($product) {
                    $price = $product->price;
                    $totalPrice += ($price * $item['quantity']);
                    $itemsToCreate[] = [
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'price' => $price,
                    ];
                }
            }

            $data['total_price'] = $totalPrice;

            $order = Order::updateOrCreate(
                ['id' => $data['id']],
                $data
            );

            // Re-sync order items
            $order->items()->delete();
            foreach ($itemsToCreate as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }
        }
    }
}
