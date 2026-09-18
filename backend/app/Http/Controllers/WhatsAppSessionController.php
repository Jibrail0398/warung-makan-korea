<?php

namespace App\Http\Controllers;

use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Throwable;

class WhatsAppSessionController extends Controller
{
    use ApiResponse;

    private const QR_CACHE_TTL = 120;

    public function show(Request $request)
    {
        try {
            return $this->successResponse($this->sessionSnapshot($request));
        } catch (Throwable $exception) {
            return $this->errorResponse(
                'WhatsApp sidecar tidak dapat dihubungi.',
                503,
                $this->debugPayload($exception)
            );
        }
    }

    public function start(Request $request)
    {
        try {
            $response = $this->sidecarRequest('post', '/start', $request);

            if ($response['qr'] ?? null) {
                $this->cacheQr($response['qr']);
            }

            return $this->successResponse($this->sessionSnapshot($request));
        } catch (Throwable $exception) {
            return $this->errorResponse(
                'Gagal mengaktifkan WhatsApp session.',
                $this->statusCode($exception),
                $this->debugPayload($exception)
            );
        }
    }

    public function destroy(Request $request)
    {
        try {
            $this->sidecarRequest('delete', '', $request);
            Cache::forget($this->qrCacheKey());

            return $this->successResponse(
                ['id' => $this->sessionId(), 'status' => 'disconnected', 'qr' => null, 'error' => null],
                'WhatsApp session berhasil dihapus.'
            );
        } catch (Throwable $exception) {
            return $this->errorResponse(
                'Gagal menghapus WhatsApp session.',
                $this->statusCode($exception),
                $this->debugPayload($exception)
            );
        }
    }

    /* ------------------------------------------------------------------ */
    /* Snapshot — bentuk respons dikunci oleh frontend (tidak boleh berubah) */
    /* ------------------------------------------------------------------ */

    private function sessionSnapshot(?Request $request = null): array
    {
        try {
            $state = $this->sidecarRequest('get', '/status', $request);
        } catch (Throwable $e) {
            if ($e->getCode() === 404) {
                Cache::forget($this->qrCacheKey());

                return ['id' => $this->sessionId(), 'status' => 'disconnected', 'qr' => null, 'error' => null];
            }

            throw $e;
        }

        $status = $state['status'] ?? 'disconnected';
        $qr = Cache::get($this->qrCacheKey());

        if ($status === 'qr' && ! $qr) {
            try {
                $qrResponse = $this->sidecarRequest('get', '/qr', $request);
                $qr = $qrResponse['qr'] ?? null;
                $this->cacheQr($qr);
            } catch (Throwable) {
                // The next poll can retrieve the QR once the sidecar has generated it.
            }
        }

        if (in_array($status, ['authenticated', 'ready'], true)) {
            Cache::forget($this->qrCacheKey());
            $qr = null;
        }

        return [
            'id' => $this->sessionId(),
            'status' => $status,
            'qr' => $qr,
            'error' => $state['error'] ?? null,
        ];
    }

    /* ------------------------------------------------------------------ */
    /* Sidecar proxy — access_token superadmin asli diteruskan ke sidecar    */
    /* ------------------------------------------------------------------ */

    private function sidecarRequest(string $method, string $suffix = '', ?Request $request = null): array
    {
        $base = rtrim((string) env('WHATSAPP_SIDECAR_URL', ''), '/');

        if ($base === '') {
            throw new RuntimeException('WHATSAPP_SIDECAR_URL belum diatur.');
        }

        $token = $request?->bearerToken();

        if (! $token) {
            throw new RuntimeException('Access_token superadmin diperlukan untuk mengakses WhatsApp sidecar.', 401);
        }

        try {
            $response = Http::withToken($token)
                ->acceptJson()
                ->timeout((int) env('WHATSAPP_SIDECAR_TIMEOUT', 30))
                ->send($method, $base.'/sessions/'.$this->sessionId().$suffix);
        } catch (Throwable $e) {
            throw new RuntimeException(
                'WhatsApp sidecar tidak dapat dihubungi: '.$e->getMessage(),
                503,
            );
        }

        if ($response->successful()) {
            return $response->json() ?? [];
        }

        $error = $response->json('error') ?? $response->body();

        throw new RuntimeException(
            "WhatsApp sidecar error (HTTP {$response->status()}): {$error}",
            $response->status(),
        );
    }

    private function cacheQr(?string $qr): void
    {
        if ($qr) {
            Cache::put($this->qrCacheKey(), $qr, self::QR_CACHE_TTL);
        }
    }

    private function sessionId(): string
    {
        return (string) env('WHATSAPP_WEB_SESSION', 'warung-korea');
    }

    private function qrCacheKey(): string
    {
        return 'whatsapp:session:'.$this->sessionId().':qr';
    }

    private function statusCode(Throwable $exception): int
    {
        $code = $exception->getCode();

        return $code >= 400 && $code < 600 ? $code : 503;
    }

    private function debugPayload(Throwable $exception): array
    {
        return config('app.debug') ? ['error' => $exception->getMessage()] : [];
    }
}
