<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Kstmostofa\LaravelWhatsApp\Facades\WhatsApp;
use RuntimeException;

class WhatsAppService
{
    /**
     * Kirim pesan WhatsApp melalui sidecar whatsapp-web.js
     * dengan fallback ke WA_API_URL eksternal jika sidecar gagal.
     *
     * @throws RuntimeException jika semua channel gagal
     */
    public function sendMessage(string $phone, string $message): bool
    {
        $phone = $this->normalizePhone($phone);
        $errors = [];

        try {
            WhatsApp::web(config('laravel-whatsapp.session_id', env('WHATSAPP_WEB_SESSION', 'main')))
                ->messages()->sendText($phone, $message);

            return true;
        } catch (\Throwable $e) {
            Log::error('WA Sidecar Exception: ' . $e->getMessage());
            $errors[] = 'sidecar(' . class_basename($e) . '): ' . $e->getMessage();
        }

        try {
            $this->sendViaExternalApi($phone, $message);

            return true;
        } catch (\Throwable $e) {
            Log::error('WA JS API Exception: ' . $e->getMessage());
            $errors[] = 'api(' . class_basename($e) . '): ' . $e->getMessage();
        }

        throw new RuntimeException('Semua channel WhatsApp gagal. ' . implode(' | ', $errors));
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

    protected function sendViaExternalApi(string $phone, string $message): void
    {
        // Fallback: URL endpoint server WA JS klien
        $endpoint = env('WA_API_URL', 'http://localhost:3000/send');

        $response = Http::timeout(10)->post($endpoint, [
            'number' => $phone,
            'message' => $message
        ]);

        if (! $response->successful()) {
            throw new \Exception("HTTP {$response->status()} dari {$endpoint}: " . \Illuminate\Support\Str::limit($response->body(), 200));
        }
    }
}
