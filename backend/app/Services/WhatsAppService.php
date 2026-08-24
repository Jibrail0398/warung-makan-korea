<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    /**
     * Kirim pesan WhatsApp melalui API whatsapp-web.js (WA JS).
     *
     * @param string $phone
     * @param string $message
     * @return bool
     */
    public function sendMessage(string $phone, string $message): bool
    {
        // Ganti URL ini dengan URL endpoint server WA JS klien
        $endpoint = env('WA_API_URL', 'http://localhost:3000/send');
        
        try {
            $response = Http::post($endpoint, [
                'number' => $phone,
                'message' => $message
            ]);

            if ($response->successful()) {
                return true;
            }

            Log::error('WA JS API Error: ' . $response->body());
            return false;

        } catch (\Exception $e) {
            Log::error('WA JS API Exception: ' . $e->getMessage());
            return false;
        }
    }
}
