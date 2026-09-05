<?php

namespace App\Services;

use App\Models\Otp;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    protected $waService;

    public function __construct(WhatsAppService $waService)
    {
        $this->waService = $waService;
    }

    /**
     * Buat dan kirim OTP
     */
    public function sendOtp(string $phone): bool
    {
        // 1. Generate 6 digit acak
        $code = rand(100000, 999999);
        
        // 2. Simpan ke database dengan waktu kadaluarsa 5 menit
        Otp::updateOrCreate(
            ['phone_number' => $phone],
            [
                'code' => $code,
                'expires_at' => Carbon::now()->addMinutes(5)
            ]
        );

        // 3. Kirim via WA JS
        $message = "Halo! Ini adalah kode OTP untuk login/register Warung Makan Korea Anda:\n\n*{$code}*\n\nBerlaku selama 5 menit. Jangan berikan kode ini kepada siapapun.";
        return $this->waService->sendMessage($phone, $message);
    }

    public function register(array $data): bool
    {
        $otp = $this->sendOtp($data["phone_number"]);
        if(!$otp){
            return "";
        }
        // Buat user dalam status belum terverifikasi
        $user = User::create([
            'name' => $data['name'],
            'phone_number' => $data['phone_number'],
            'role' => 'member',
            'password' => Hash::make($data['password'])
        ]);

        return $otp;
    }

    /**
     * Verifikasi kredensial login dan kirim OTP
     */
    public function login(array $credentials): bool
    {
        $user = User::where('phone_number', $credentials['phone_number'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return false;
        }

        return $this->sendOtp($credentials['phone_number']);
    }

    /**
     * Verifikasi OTP dan Login/Register
     */
    public function verifyOtp(string $phone, string $code): ?array
    {
        $otp = Otp::where('phone_number', $phone)
                  ->where('code', $code)
                  ->where('expires_at', '>', Carbon::now())
                  ->first();

        if (!$otp) {
            return null; // OTP tidak valid atau kadaluarsa
        }

        // OTP valid, hapus record
        $otp->delete();

        // Cari User
        $user = User::where('phone_number', $phone)->first();

        if (!$user) {
            return null; // User tidak ditemukan
        }

        // Pastikan phone_number_verified_at terisi (kasus jika user sudah ada tapi belum terverifikasi)
        if (empty($user->phone_number_verified_at)) {
            $user->update(['phone_number_verified_at' => Carbon::now()]);
        }

        // Buat token JWT
        $token = auth('api')->login($user);

        return [
            'user' => $user,
            'token' => $token,
            'type' => 'bearer'
        ];
    }
}
