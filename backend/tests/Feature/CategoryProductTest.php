<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Category;
use App\Models\Product;

class CategoryProductTest extends TestCase
{
    use RefreshDatabase;

    protected function getAdminToken()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        return auth('api')->login($admin);
    }

    protected function getMemberToken()
    {
        $member = User::factory()->create(['role' => 'member']);
        return auth('api')->login($member);
    }

    public function test_public_can_view_categories()
    {
        Category::create(['name' => 'Food', 'slug' => 'food']);
        
        $response = $this->getJson('/api/categories');
        $response->assertStatus(200)
                 ->assertJsonFragment(['name' => 'Food']);
    }

    public function test_admin_can_create_category()
    {
        $token = $this->getAdminToken();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/categories', [
            'name' => 'Beverages'
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('categories', ['name' => 'Beverages']);
    }

    public function test_member_cannot_create_category()
    {
        $token = $this->getMemberToken();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/categories', [
            'name' => 'Snacks'
        ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_create_product()
    {
        $token = $this->getAdminToken();
        $category = Category::create(['name' => 'Food', 'slug' => 'food']);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/products', [
            'category_id' => $category->id,
            'name' => 'Tteokbokki',
            'price' => 25000,
            'weight_or_unit' => '1 Porsi'
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('products', ['name' => 'Tteokbokki']);
    }
}
