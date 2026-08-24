<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Category;
use App\Models\Product;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_checkout_order()
    {
        $category = Category::create(['name' => 'Food', 'slug' => 'food']);
        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Kimchi',
            'price' => 10000,
            'weight_or_unit' => '1 Porsi'
        ]);

        $response = $this->postJson('/api/orders', [
            'customer_name' => 'Guest User',
            'customer_phone' => '08123123123',
            'order_type' => 'dine_in',
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 2
                ]
            ]
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure(['status', 'message', 'data' => ['id', 'total_price']]);

        $this->assertDatabaseHas('orders', [
            'customer_name' => 'Guest User',
            'total_price' => 20000,
        ]);

        $this->assertDatabaseHas('order_items', [
            'product_id' => $product->id,
            'quantity' => 2,
            'price' => 10000
        ]);
    }
}
