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

    public function sendOtp(string $phone): bool
    {
        $code = rand(100000, 999999);
        
        Otp::updateOrCreate(
            ['phone_number' => $phone],
            [
                'code' => $code,
                'expires_at' => Carbon::now()->addMinutes(5)
            ]
        );

        $message = "Halo! Ini adalah kode OTP untuk login/register Warung Makan Korea Anda:\n\n*{$code}*\n\nBerlaku selama 5 menit. Jangan berikan kode ini kepada siapapun.";
        return $this->waService->sendMessage($phone, $message);
    }

    public function register(array $data): bool
    {
        $user = User::create([
            'name' => $data['name'],
            'phone_number' => $data['phone_number'],
            'role' => 'member',
            'password' => Hash::make($data['password'])
        ]);

        // Log: User baru mendaftar
        activity('auth')
            ->performedOn($user)
            ->event('register')
            ->withProperties([
                'phone_number' => $data['phone_number'],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ])
            ->log("Pengguna baru {$user->name} ({$data['phone_number']}) mendaftar.");

        return $this->sendOtp($data['phone_number']);
    }

    public function login(array $credentials): bool
    {
        $user = User::where('phone_number', $credentials['phone_number'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            // Log: Login gagal (kredensial salah)
            activity('auth')
                ->event('login_failed')
                ->withProperties([
                    'phone_number' => $credentials['phone_number'],
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                    'reason' => 'Nomor telepon atau password salah.',
                ])
                ->log("Percobaan login gagal untuk nomor {$credentials['phone_number']}.");

            return false;
        }

        return $this->sendOtp($credentials['phone_number']);
    }

    public function verifyOtp(string $phone, string $code): ?array
    {
        $otp = Otp::where('phone_number', $phone)
                  ->where('code', $code)
                  ->where('expires_at', '>', Carbon::now())
                  ->first();

        if (!$otp) {
            // Log: Verifikasi OTP gagal
            activity('auth')
                ->event('otp_failed')
                ->withProperties([
                    'phone_number' => $phone,
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                    'reason' => 'Kode OTP tidak valid atau sudah kadaluarsa.',
                ])
                ->log("Verifikasi OTP gagal untuk nomor {$phone}.");

            return null;
        }

        $otp->delete();

        $user = User::where('phone_number', $phone)->first();

        if (!$user) {
            return null;
        }

        if (empty($user->phone_number_verified_at)) {
            $user->update(['phone_number_verified_at' => Carbon::now()]);
        }

        $token = auth('api')->login($user);

        // Log: Login berhasil
        activity('auth')
            ->performedOn($user)
            ->causedBy($user)
            ->event('login')
            ->withProperties([
                'phone_number' => $user->phone_number,
                'role' => $user->role,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ])
            ->log("Pengguna {$user->name} ({$user->role}) berhasil login.");

        return [
            'user' => $user,
            'token' => $token,
            'type' => 'bearer'
        ];
    }

    public function logout(User $user): void
    {
        // Log: Logout
        activity('auth')
            ->performedOn($user)
            ->causedBy($user)
            ->event('logout')
            ->withProperties([
                'phone_number' => $user->phone_number,
                'role' => $user->role,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ])
            ->log("Pengguna {$user->name} ({$user->role}) logout.");
    }
}

