#!/bin/bash
set -e

echo "[start] booting container ..."

# ---------------------------------------------------------------------------
# 1. Chromium for the WhatsApp sidecar (Debian apt).
#    railpack.json also installs it via deploy.aptPackages; this is a fallback.
# ---------------------------------------------------------------------------
if ! command -v chromium >/dev/null 2>&1 && ! command -v chromium-browser >/dev/null 2>&1; then
    echo "[start] chromium not found, installing via apt ..."
    apt-get update -qq || true
    DEBIAN_FRONTEND=noninteractive apt-get install -y -qq chromium || true
fi

CHROME_BIN="$(command -v chromium || command -v chromium-browser || true)"
export PUPPETEER_EXECUTABLE_PATH="${PUPPETEER_EXECUTABLE_PATH:-$CHROME_BIN}"
echo "[start] chromium: ${CHROME_BIN:-NOT FOUND}"

# ---------------------------------------------------------------------------
# 2. Laravel boot tasks (mirror Railpack's default start-container.sh).
# ---------------------------------------------------------------------------
if [ "$IS_LARAVEL" = "true" ]; then
    if [ "$RAILPACK_SKIP_MIGRATIONS" != "true" ]; then
        echo "[start] running migrations ..."
        php artisan migrate --force || true
    fi

    php artisan storage:link || true
    php artisan optimize:clear || true
    php artisan optimize || true
fi

# ---------------------------------------------------------------------------
# 3. WhatsApp sidecar (whatsapp-web.js) on loopback.
# ---------------------------------------------------------------------------
SIDECAR_DIR="vendor/kstmostofa/laravel-whatsapp/sidecar"
SESSION_DIR="$(pwd)/storage/app/whatsapp-sidecar/sessions"
SIDECAR_LOG="storage/logs/whatsapp-sidecar.log"

mkdir -p "$SESSION_DIR" storage/logs
touch "$SIDECAR_LOG"

if [ ! -d "$SIDECAR_DIR/node_modules/express" ]; then
    echo "[start] sidecar deps missing, installing ..."
    if [ -f "$SIDECAR_DIR/package-lock.json" ]; then
        PUPPETEER_SKIP_DOWNLOAD=true PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
            npm ci --omit=dev --prefix "$SIDECAR_DIR" || true
    else
        PUPPETEER_SKIP_DOWNLOAD=true PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
            npm install --omit=dev --prefix "$SIDECAR_DIR" || true
    fi
fi

export WHATSAPP_WEB_HOST="${WHATSAPP_WEB_HOST:-127.0.0.1}"
export WHATSAPP_WEB_PORT="${WHATSAPP_WEB_PORT:-3000}"
export WHATSAPP_WEB_TOKEN="${WHATSAPP_WEB_TOKEN:-}"

if [ -d "$SIDECAR_DIR/node_modules/express" ]; then
    echo "[start] starting WhatsApp sidecar on http://${WHATSAPP_WEB_HOST}:${WHATSAPP_WEB_PORT} ..."
    nohup env HOST="$WHATSAPP_WEB_HOST" \
        PORT="$WHATSAPP_WEB_PORT" \
        SIDECAR_TOKEN="$WHATSAPP_WEB_TOKEN" \
        SESSION_DIR="$SESSION_DIR" \
        AUTO_START_SESSIONS=true \
        PUPPETEER_EXECUTABLE_PATH="${PUPPETEER_EXECUTABLE_PATH:-}" \
        node "$SIDECAR_DIR/index.js" >> "$SIDECAR_LOG" 2>&1 &

    # Stream the sidecar log into the Railway deploy logs.
    tail -n +1 -f "$SIDECAR_LOG" &
    sleep 2
else
    echo "[start] WARNING: sidecar dependencies missing, sidecar not started"
fi

# ---------------------------------------------------------------------------
# 4. FrankenPHP server (same as Railpack's default).
# ---------------------------------------------------------------------------
echo "[start] starting Laravel server ..."
exec docker-php-entrypoint --config /Caddyfile --adapter caddyfile 2>&1
