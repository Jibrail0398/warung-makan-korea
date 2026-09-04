<?php

namespace App\Http\Controllers;

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
        try {
            $this->authService->register($request->validated());
        } catch (\Throwable $e) {
            return $this->errorResponse(
                'Gagal mengirim kode OTP. Silakan coba lagi nanti.',
                500,
                $this->debugPayload($e)
            );
        }

        return $this->successResponse(null, 'Registrasi berhasil. Kode OTP telah dikirim ke WhatsApp Anda.', 201);
    }

    public function sendOtp(SendOtpRequest $request)
    {
        try {
            $this->authService->sendOtp($request->phone_number);
        } catch (\Throwable $e) {
            return $this->errorResponse(
                'Gagal mengirim kode OTP. Silakan coba lagi nanti.',
                500,
                $this->debugPayload($e)
            );
        }

        return $this->successResponse(null, 'Kode OTP berhasil dikirim ke WhatsApp Anda.');
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

    /**
     * Detail error untuk debugging — detail penuh hanya saat APP_DEBUG=true.
     */
    protected function debugPayload(\Throwable $e): array
    {
        $payload = [
            'error' => $e->getMessage(),
        ];

        if (config('app.debug')) {
            $payload['exception'] = class_basename($e);
            $payload['session_whatsapp'] = null;

            try {
                $payload['session_whatsapp'] = app(\Kstmostofa\LaravelWhatsApp\Web\WebClient::class)->sessions();
            } catch (\Throwable $ignored) {
                $payload['session_whatsapp'] = 'gagal mengambil status sidecar: ' . $ignored->getMessage();
            }

            if (env('WA_API_URL')) {
                try {
                    $resp = \Illuminate\Support\Facades\Http::timeout(5)->get(env('WA_API_URL'));
                    $payload['wa_api_url_status'] = $resp->status();
                } catch (\Throwable $ignored) {
                    $payload['wa_api_url_status'] = 'tidak terjangkau: ' . $ignored->getMessage();
                }
            }
        }

        return $payload;
    }
}
