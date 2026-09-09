<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Console\Command;
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

    $sidecarExitCode = $this->call('whatsapp:sidecar:start');

    if ($sidecarExitCode !== Command::SUCCESS) {
        $server->stop(3);

        return $sidecarExitCode;
    }

    $server->wait();
})->purpose('Start the Laravel server and WhatsApp sidecar');
