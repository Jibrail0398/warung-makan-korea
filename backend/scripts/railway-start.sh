#!/usr/bin/env sh
set -e

# Pastikan direktori runtime bisa ditulis.
chmod -R ugo+w storage bootstrap/cache 2>/dev/null || true

# Pakai Chromium dari image Nix untuk Puppeteer bila belum di-set.
if [ -z "${PUPPETEER_EXECUTABLE_PATH:-}" ]; then
    CHROME_BIN="$(command -v chromium || command -v chromium-browser || true)"
    if [ -n "$CHROME_BIN" ]; then
        export PUPPETEER_EXECUTABLE_PATH="$CHROME_BIN"
    fi
fi

# Sidecar WhatsApp berjalan di container yang sama, diakses lewat loopback.
export WHATSAPP_WEB_HOST="${WHATSAPP_WEB_HOST:-127.0.0.1}"
export WHATSAPP_WEB_PORT="${WHATSAPP_WEB_PORT:-3000}"
export WHATSAPP_WEB_TOKEN="${WHATSAPP_WEB_TOKEN:-}"

SESSION_DIR="$(pwd)/storage/app/whatsapp-sidecar/sessions"
mkdir -p "$SESSION_DIR" storage/logs

# Migrasi database (jangan gagalkan boot bila DB sempat belum siap).
php artisan migrate --force || true

# Jalankan sidecar whatsapp-web.js secara detached.
nohup env HOST="$WHATSAPP_WEB_HOST" \
    PORT="$WHATSAPP_WEB_PORT" \
    SIDECAR_TOKEN="$WHATSAPP_WEB_TOKEN" \
    SESSION_DIR="$SESSION_DIR" \
    AUTO_START_SESSIONS=true \
    PUPPETEER_EXECUTABLE_PATH="${PUPPETEER_EXECUTABLE_PATH:-}" \
    node vendor/kstmostofa/laravel-whatsapp/sidecar/index.js \
    >> storage/logs/whatsapp-sidecar.log 2>&1 &

sleep 2

# Proses utama: web server yang mendengarkan PORT dari Railway.
php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
