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

    public function test_superadmin_can_create_admin_with_password()
    {
        $token = $this->getSuperAdminToken();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/users', [
            'name' => 'Admin Baru',
            'phone_number' => '081299887766',
            'role' => 'admin',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('users', [
            'name' => 'Admin Baru',
            'phone_number' => '081299887766',
            'role' => 'admin',
        ]);
    }

    public function test_create_admin_fails_if_password_confirmation_does_not_match()
    {
        $token = $this->getSuperAdminToken();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/users', [
            'name' => 'Admin Salah',
            'phone_number' => '081299887755',
            'role' => 'admin',
            'password' => 'secret123',
            'password_confirmation' => 'mismatch123',
        ]);

        $response->assertStatus(422);
    }

    public function test_can_change_admin_password()
    {
        $token = $this->getSuperAdminToken();
        $targetAdmin = User::factory()->create([
            'name' => 'Staf Kasir',
            'phone_number' => '081211223344',
            'role' => 'admin',
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->putJson("/api/users/{$targetAdmin->id}/password", [
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(200);
    }

    public function test_change_admin_password_fails_if_confirmation_mismatch()
    {
        $token = $this->getSuperAdminToken();
        $targetAdmin = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->putJson("/api/users/{$targetAdmin->id}/password", [
            'password' => 'newpassword123',
            'password_confirmation' => 'different123',
        ]);

        $response->assertStatus(422);
    }
}
