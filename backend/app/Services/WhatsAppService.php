<?php

namespace App\Services;

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
     * method ini akan polling status sampai `ready` maksimal ~20 detik, lalu
     * mengulang pengiriman.
     *
     * @throws RuntimeException jika sidecar gagal mengirim pesan
     */
    public function sendMessage(string $phone, string $message): bool
    {
        $phone = $this->normalizePhone($phone);
        $session = WhatsApp::web(config('laravel-whatsapp.session_id', env('WHATSAPP_WEB_SESSION', 'main')));

        try {
            $session->messages()->sendText($phone, $message);

            return true;
        } catch (SidecarException $e) {
            if ($e->getCode() === 409 && str_contains($e->getMessage(), 'session not ready')) {
                Log::info('WA sidecar status authenticated, polling until ready...');

                if ($this->waitUntilReady($session)) {
                    $session->messages()->sendText($phone, $message);

                    return true;
                }

                throw new RuntimeException('WhatsApp session tidak siap mengirim pesan. Status masih authenticated. Silakan tunggu beberapa saat lalu coba lagi.');
            }

            Log::error('WA Sidecar Exception: ' . $e->getMessage());
            throw new RuntimeException('Gagal mengirim pesan WhatsApp: ' . $e->getMessage());
        } catch (\Throwable $e) {
            Log::error('WA Sidecar Exception: ' . $e->getMessage());
            throw new RuntimeException('Gagal mengirim pesan WhatsApp: ' . $e->getMessage());
        }
    }

    /**
     * Tunggu sidecar sampai status `ready`.
     */
    protected function waitUntilReady(WebSession $session, int $maxAttempts = 20, int $sleepSeconds = 1): bool
    {
        for ($i = 0; $i < $maxAttempts; $i++) {
            sleep($sleepSeconds);

            try {
                $state = $session->state();

                if (($state['status'] ?? '') === 'ready') {
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
