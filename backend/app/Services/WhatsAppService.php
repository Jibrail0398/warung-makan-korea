<?php

namespace App\Services;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RuntimeException;

class WhatsAppService
{
    /**
     * Kirim pesan WhatsApp (teks) melalui sidecar Baileys.
     *
     * Autentikasi: Laravel menerbitkan JWT sendiri dengan klaim
     * `role: superadmin` — sidecar memverifikasi tanda tangan + klaim
     * tersebut menggunakan JWT_SECRET yang sama.
     *
     * Jika sidecar baru saja login (status masih `initializing`/`qr`),
     * method ini akan polling status sampai `ready` maksimal beberapa
     * detik, lalu mengulang pengiriman sekali.
     *
     * @throws RuntimeException jika sidecar gagal mengirim pesan
     */
    public function sendMessage(string $phone, string $message): bool
    {
        $phone = $this->normalizePhone($phone);
        $sessionId = $this->sessionId();

        Log::info('WA sending message', ['phone' => $phone, 'session_id' => $sessionId]);

        try {
            $response = $this->request('post', "/sessions/{$sessionId}/messages", [
                'json' => ['to' => $phone, 'body' => $message],
            ]);
        } catch (RuntimeException $e) {
            if ($e->getCode() === 409) {
                Log::info('WA sidecar belum ready, polling sampai ready...', ['session_id' => $sessionId]);

                if ($this->waitUntilReady()) {
                    $response = $this->request('post', "/sessions/{$sessionId}/messages", [
                        'json' => ['to' => $phone, 'body' => $message],
                    ]);
                    Log::info('WA message sent after ready', ['phone' => $phone, 'session_id' => $sessionId]);

                    return true;
                }

                throw new RuntimeException(
                    'WhatsApp session tidak siap mengirim pesan. Silakan tunggu beberapa saat lalu coba lagi.'
                );
            }

            throw $e;
        }

        Log::info('WA message sent', [
            'phone' => $phone,
            'session_id' => $sessionId,
            'wa_message_id' => $response['id'] ?? null,
        ]);

        return true;
    }

    /**
     * Daftar session di sidecar: [{id, status}, ...].
     * Dipakai untuk payload debug saat APP_DEBUG aktif.
     */
    public function sessions(): array
    {
        return $this->request('get', '/sessions');
    }

    /* ------------------------------------------------------------------ */
    /* HTTP client                                                         */
    /* ------------------------------------------------------------------ */

    protected function request(string $method, string $path, array $options = []): array
    {
        try {
            $response = Http::withToken($this->serviceToken())
                ->acceptJson()
                ->timeout((int) env('WHATSAPP_SIDECAR_TIMEOUT', 30))
                ->send($method, $this->baseUrl().$path, $options);
        } catch (\Throwable $e) {
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

    protected function baseUrl(): string
    {
        $url = rtrim((string) env('WHATSAPP_SIDECAR_URL', ''), '/');

        if ($url === '') {
            throw new RuntimeException('WHATSAPP_SIDECAR_URL belum diatur.');
        }

        return $url;
    }

    protected function sessionId(): string
    {
        return (string) env('WHATSAPP_WEB_SESSION', 'warung-korea');
    }

    /* ------------------------------------------------------------------ */
    /* Service token: JWT superadmin yang diterbitkan Laravel sendiri       */
    /* ------------------------------------------------------------------ */

    /**
     * Terbitkan access_token JWT fresh (HS256) dengan klaim role
     * superadmin. Token ini yang dipakai Laravel memanggil sidecar (mis.
     * kirim OTP dari endpoint publik register), sehingga sidecar tetap
     * hanya melayani superadmin.
     *
     * Dibuat stateless tanpa bergantung pada DB, hanya butuh JWT_SECRET
     * yang sama dengan yang dikonfigurasikan di sidecar.
     */
    protected function serviceToken(): string
    {
        $secret = (string) config('jwt.secret');

        if ($secret === '') {
            throw new RuntimeException('JWT_SECRET belum diatur — token service untuk sidecar tidak dapat dibuat.');
        }

        $now = Carbon::now()->timestamp;
        $ttlMinutes = (int) (config('jwt.ttl') ?: 60);
        $payload = [
            'iss' => url('/'),
            'sub' => 'whatsapp-sidecar-service',
            'role' => 'superadmin',
            'iat' => $now,
            'exp' => $now + $ttlMinutes * 60,
            'nbf' => $now,
            'jti' => (string) Str::uuid(),
        ];

        $encode = fn (array $part): string => rtrim(strtr(base64_encode(json_encode($part)), '+/', '-_'), '=');

        $jwt = $encode(['alg' => 'HS256', 'typ' => 'JWT']).'.'.$encode($payload);
        $signature = rtrim(strtr(base64_encode(hash_hmac('sha256', $jwt, $secret, true)), '+/', '-_'), '=');

        return $jwt.'.'.$signature;
    }

    /* ------------------------------------------------------------------ */
    /* Polling sampai sidecar ready                                        */
    /* ------------------------------------------------------------------ */

    /**
     * Tunggu sidecar sampai status `ready` (setelah scan QR / reconnect).
     * Menggunakan timeout pendek agar request Laravel tidak hang.
     */
    protected function waitUntilReady(): bool
    {
        $maxAttempts = (int) env('WHATSAPP_WEB_READY_ATTEMPTS', 15);
        $sleepSeconds = (int) env('WHATSAPP_WEB_READY_SLEEP', 1);
        $requestTimeout = (int) env('WHATSAPP_WEB_READY_REQUEST_TIMEOUT', 2);
        $sessionId = $this->sessionId();

        for ($i = 0; $i < $maxAttempts; $i++) {
            sleep($sleepSeconds);

            try {
                $response = Http::withToken($this->serviceToken())
                    ->acceptJson()
                    ->timeout($requestTimeout)
                    ->get($this->baseUrl()."/sessions/{$sessionId}/status");

                if ($response->successful() && $response->json('status') === 'ready') {
                    return true;
                }
            } catch (\Throwable $e) {
                // Abaikan error sementara dan lanjut polling.
            }
        }

        return false;
    }

    /**
     * Konversi format lokal ke internasional: 0812… → 62812…
     * (Sidecar juga melakukan normalisasi yang sama — lapis ini murni
     * untuk konsistensi log/database.)
     */
    protected function normalizePhone(string $phone): string
    {
        $digits = preg_replace('/\D+/', '', $phone);

        if (str_starts_with($digits, '0')) {
            return '62'.substr($digits, 1);
        }

        if (! str_starts_with($digits, '62')) {
            return '62'.$digits;
        }

        return $digits;
    }
}
