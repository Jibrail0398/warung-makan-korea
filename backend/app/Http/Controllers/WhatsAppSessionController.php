<?php

namespace App\Http\Controllers;

use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Cache;
use Kstmostofa\LaravelWhatsApp\Exceptions\SidecarException;
use Kstmostofa\LaravelWhatsApp\Web\WebClient;
use Throwable;

class WhatsAppSessionController extends Controller
{
    use ApiResponse;

    private const QR_CACHE_TTL = 120;

    public function __construct(private WebClient $client)
    {
    }

    public function show()
    {
        try {
            return $this->successResponse($this->sessionSnapshot());
        } catch (Throwable $exception) {
            return $this->errorResponse(
                'WhatsApp sidecar tidak dapat dihubungi.',
                503,
                $this->debugPayload($exception)
            );
        }
    }

    public function start()
    {
        try {
            $session = $this->session();
            $response = $session->start();
            $this->cacheQr($response['qr'] ?? null);

            return $this->successResponse($this->sessionSnapshot());
        } catch (Throwable $exception) {
            return $this->errorResponse(
                'Gagal mengaktifkan WhatsApp session.',
                $this->statusCode($exception),
                $this->debugPayload($exception)
            );
        }
    }

    private function session()
    {
        return $this->client->session($this->sessionId());
    }

    private function sessionSnapshot(): array
    {
        $state = $this->session()->state();
        $status = $state['status'] ?? 'disconnected';
        $qr = Cache::get($this->qrCacheKey());

        if ($status === 'qr' && ! $qr) {
            try {
                $qrResponse = $this->session()->qr();
                $qr = $qrResponse['qr'] ?? null;
                $this->cacheQr($qr);
            } catch (SidecarException) {
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
        ];
    }

    private function cacheQr(?string $qr): void
    {
        if ($qr) {
            Cache::put($this->qrCacheKey(), $qr, self::QR_CACHE_TTL);
        }
    }

    private function sessionId(): string
    {
        return env('WHATSAPP_WEB_SESSION', 'warung-korea');
    }

    private function qrCacheKey(): string
    {
        return 'whatsapp:session:'.$this->sessionId().':qr';
    }

    private function statusCode(Throwable $exception): int
    {
        return $exception instanceof SidecarException && $exception->getCode() >= 400
            ? $exception->getCode()
            : 503;
    }

    private function debugPayload(Throwable $exception): array
    {
        return config('app.debug') ? ['error' => $exception->getMessage()] : [];
    }
}
