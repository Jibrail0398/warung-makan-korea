<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\BankAccount;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    protected function getSuperAdminToken()
    {
        $admin = User::factory()->create(['role' => 'superadmin']);
        return auth('api')->login($admin);
    }

    public function test_superadmin_can_create_bank_account()
    {
        $token = $this->getSuperAdminToken();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/bank-accounts', [
            'bank_name' => 'BCA',
            'account_number' => '1234567890',
            'account_name' => 'Warung Korea',
            'is_active' => true
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('bank_accounts', ['bank_name' => 'BCA']);
    }

    public function test_superadmin_can_view_users()
    {
        $token = $this->getSuperAdminToken();

        User::factory()->create(['role' => 'member']);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/users');

        $response->assertStatus(200)
                 ->assertJsonStructure(['status', 'message', 'data']);
    }
}
