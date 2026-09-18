<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Kstmostofa\LaravelWhatsApp\Exceptions\SidecarException;
use Kstmostofa\LaravelWhatsApp\Facades\WhatsApp;
use Kstmostofa\LaravelWhatsApp\Web\WebSession;
use RuntimeException;

class WhatsAppService
{
    /**
     * Kirim pesan WhatsApp melalui sidecar whatsapp-web.js.
     *
     * Jika sidecar baru saja login (status `authenticated` tapi belum `ready`),
     * method ini akan polling status sampai `ready` maksimal ~16 detik, lalu
     * mengulang pengiriman.
     *
     * Polling menggunakan timeout pendek (Http facade) agar tidak memicu
     * PHP max_execution_time jika sidecar sedang sibuk.
     *
     * @throws RuntimeException jika sidecar gagal mengirim pesan
     */
    public function sendMessage(string $phone, string $message): bool
    {
        $phone = $this->normalizePhone($phone);
        $sessionId = env('WHATSAPP_WEB_SESSION', 'warung-korea');
        $session = WhatsApp::web($sessionId);

        try {
            Log::info('WA sending message', ['phone' => $phone, 'session_id' => $sessionId]);
            $session->messages()->sendText($phone, $message);
            Log::info('WA message sent', ['phone' => $phone, 'session_id' => $sessionId]);

            return true;
        } catch (SidecarException $e) {
            Log::warning('WA Sidecar Exception', [
                'phone' => $phone,
                'session_id' => $sessionId,
                'code' => $e->getCode(),
                'message' => $e->getMessage(),
            ]);

            if ($e->getCode() === 409 && str_contains($e->getMessage(), 'session not ready')) {
                Log::info('WA sidecar status authenticated, polling until ready...', ['session_id' => $sessionId]);

                if ($this->waitUntilReady($session)) {
                    $session->messages()->sendText($phone, $message);
                    Log::info('WA message sent after ready', ['phone' => $phone, 'session_id' => $sessionId]);

                    return true;
                }

                throw new RuntimeException('WhatsApp session tidak siap mengirim pesan. Status masih authenticated. Silakan tunggu beberapa saat lalu coba lagi.');
            }

            throw new RuntimeException('Gagal mengirim pesan WhatsApp: ' . $e->getMessage());
        } catch (\Throwable $e) {
            Log::error('WA Sidecar Exception', [
                'phone' => $phone,
                'session_id' => $sessionId,
                'exception' => class_basename($e),
                'message' => $e->getMessage(),
            ]);
            throw new RuntimeException('Gagal mengirim pesan WhatsApp: ' . $e->getMessage());
        }
    }

    /**
     * Tunggu sidecar sampai status `ready`.
     *
     * Menggunakan Http facade dengan timeout pendek agar request yang tersendat
     * tidak membuat seluruh request Laravel hang sampai max_execution_time.
     */
    protected function waitUntilReady(WebSession $session, ?int $maxAttempts = null, ?int $sleepSeconds = null, ?int $requestTimeout = null): bool
    {
        $maxAttempts = $maxAttempts ?? (int) env('WHATSAPP_WEB_READY_ATTEMPTS', 15);
        $sleepSeconds = $sleepSeconds ?? (int) env('WHATSAPP_WEB_READY_SLEEP', 1);
        $requestTimeout = $requestTimeout ?? (int) env('WHATSAPP_WEB_READY_REQUEST_TIMEOUT', 2);

        $client = $session->client();
        $url = sprintf('http://%s:%d/sessions/%s/status', $client->host(), $client->port(), $session->id());
        $token = $client->token();

        for ($i = 0; $i < $maxAttempts; $i++) {
            sleep($sleepSeconds);

            try {
                $response = Http::timeout($requestTimeout)
                    ->withToken($token)
                    ->get($url);

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
     */
    protected function normalizePhone(string $phone): string
    {
        $digits = preg_replace('/\D+/', '', $phone);

        if (str_starts_with($digits, '0')) {
            return '62' . substr($digits, 1);
        }

        if (! str_starts_with($digits, '62')) {
            return '62' . $digits;
        }

        return $digits;
    }
}
