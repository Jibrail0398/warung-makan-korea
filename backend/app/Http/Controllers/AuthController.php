<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\SendOtpRequest;
use App\Http\Requests\Auth\VerifyOtpRequest;
use App\Services\AuthService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    use ApiResponse;

    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register(RegisterRequest $request)
    {
        $success = $this->authService->register($request->validated());

        if ($success) {
            return $this->successResponse(null, 'Registrasi berhasil. Kode OTP telah dikirim ke WhatsApp Anda.', 201);
        }

        return $this->errorResponse('Gagal mengirim kode OTP. Silakan coba lagi nanti.', 500);
    }

    public function login(LoginRequest $request)
    {
        $success = $this->authService->login($request->validated());

        if ($success) {
            return $this->successResponse(null, 'Kredensial valid. Kode OTP telah dikirim ke WhatsApp Anda.');
        }

        return $this->errorResponse('Nomor telepon atau password salah.', 401);
    }

    public function sendOtp(SendOtpRequest $request)
    {
        $success = $this->authService->sendOtp($request->phone_number);

        if ($success) {
            return $this->successResponse(null, 'Kode OTP berhasil dikirim ke WhatsApp Anda.');
        }

        return $this->errorResponse('Gagal mengirim kode OTP. Silakan coba lagi nanti.', 500);
    }

    public function verifyOtp(VerifyOtpRequest $request)
    {
        $result = $this->authService->verifyOtp($request->phone_number, $request->code);

        if (!$result) {
            return $this->errorResponse('Kode OTP tidak valid atau sudah kadaluarsa.', 401);
        }

        return $this->successResponse([
            'user' => $result['user'],
            'access_token' => $result['token'],
            'token_type' => $result['type'],
            'expires_in' => auth('api')->factory()->getTTL() * 60
        ], 'Login berhasil.');
    }

    public function logout(Request $request)
    {
        // Mencabut token JWT saat ini
        auth('api')->logout();
        return $this->successResponse(null, 'Berhasil logout');
    }
}
