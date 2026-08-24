<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Otp;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_and_receive_otp()
    {
        Http::fake([
            '*' => Http::response(['status' => true], 200)
        ]);
        $response = $this->postJson('/api/auth/register', [
            'name' => 'John Doe',
            'phone_number' => '081234567890',
        ]);

        $response->assertStatus(201)
                 ->assertJson([
                     'status' => 'success',
                     'message' => 'Registrasi berhasil. Kode OTP telah dikirim ke WhatsApp Anda.'
                 ]);

        $this->assertDatabaseHas('users', [
            'phone_number' => '081234567890',
            'name' => 'John Doe',
        ]);

        $this->assertDatabaseHas('otps', [
            'phone_number' => '081234567890',
        ]);
    }

    public function test_user_can_request_otp_for_login()
    {
        Http::fake([
            '*' => Http::response(['status' => true], 200)
        ]);
        
        $user = User::factory()->create([
            'phone_number' => '089876543210'
        ]);

        $response = $this->postJson('/api/auth/otp/send', [
            'phone_number' => '089876543210',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['status', 'message', 'data']);
                 
        $this->assertDatabaseHas('otps', [
            'phone_number' => '089876543210',
        ]);
    }

    public function test_user_can_verify_otp_and_get_jwt_token()
    {
        $user = User::factory()->create([
            'phone_number' => '08111222333'
        ]);

        Otp::create([
            'phone_number' => '08111222333',
            'code' => '123456',
            'expires_at' => Carbon::now()->addMinutes(5)
        ]);

        $response = $this->postJson('/api/auth/otp/verify', [
            'phone_number' => '08111222333',
            'code' => '123456'
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'status', 
                     'message', 
                     'data' => ['user', 'access_token', 'token_type', 'expires_in']
                 ]);
                 
        $this->assertDatabaseMissing('otps', [
            'code' => '123456'
        ]);
    }

    public function test_user_can_logout()
    {
        $user = User::factory()->create();
        $token = auth('api')->login($user);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/auth/logout');

        $response->assertStatus(200);
        
        // Ensure token is invalidated
        $response2 = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/user');

        $response2->assertStatus(401);
    }
}
