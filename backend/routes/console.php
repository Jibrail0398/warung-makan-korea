<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Symfony\Component\Process\Process;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('dev', function () {
    $server = new Process(['./vendor/bin/sail', 'artisan', 'serve'], base_path());
    $server->setTimeout(null);
    $server->start(function (string $type, string $buffer): void {
        echo $buffer;
    });

    // Sidecar WhatsApp (Baileys) — service Node ringan di whatsapp-sidecar/.
    $sidecar = new Process(['npm', 'start'], base_path('whatsapp-sidecar'));
    $sidecar->setTimeout(null);
    $sidecar->start(function (string $type, string $buffer): void {
        echo $buffer;
    });

    $server->wait();
})->purpose('Start the Laravel server and WhatsApp sidecar');
