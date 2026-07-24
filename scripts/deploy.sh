#!/usr/bin/env bash
set -euo pipefail

DEPLOY_DIR="$(cd "$(dirname "$0")" && pwd)"
RELEASE_URL="${RELEASE_URL:-https://github.com/nordwestt/meet-and-talk/releases/latest/download/meet-and-talk.zip}"
ZIP_FILE="${DEPLOY_DIR}/meet-and-talk.zip"
UPLOAD_DIR="${UPLOAD_DIR:-/var/meet-and-talk/uploads}"
CADDYFILE_SRC="${DEPLOY_DIR}/Caddyfile"
CADDYFILE_DEST="${CADDYFILE_DEST:-/etc/caddy/Caddyfile}"

cd "${DEPLOY_DIR}"
mkdir -p logs

echo "Downloading latest release..."
curl -fsSL -o "${ZIP_FILE}" "${RELEASE_URL}"

echo "Extracting..."
unzip -oq "${ZIP_FILE}"

if [[ ! -f .env ]]; then
  echo "ERROR: ${DEPLOY_DIR}/.env is missing." >&2
  if [[ -f .env.example ]]; then
    echo "Copy .env.example to .env, set ADMIN_API_TOKEN and Turso vars, then re-run:" >&2
    echo "  cp .env.example .env && \$EDITOR .env && ./deploy.sh" >&2
  fi
  exit 1
fi

# shellcheck disable=SC1091
source .env
if [[ -z "${ADMIN_API_TOKEN:-}" ]]; then
  echo "ERROR: ADMIN_API_TOKEN must be set in .env" >&2
  exit 1
fi

echo "Ensuring upload directory exists (${UPLOAD_DIR})..."
if [[ -d "${UPLOAD_DIR}" ]]; then
  :
elif mkdir -p "${UPLOAD_DIR}" 2>/dev/null; then
  :
else
  sudo mkdir -p "${UPLOAD_DIR}"
  sudo chown "${USER}:${USER}" "${UPLOAD_DIR}"
fi

./check-deploy.sh

echo "Starting / restarting PM2 apps..."
if pm2 describe meet-and-talk >/dev/null 2>&1; then
  pm2 reload ecosystem.config.cjs --update-env
else
  pm2 start ecosystem.config.cjs
fi
pm2 save

if command -v caddy >/dev/null 2>&1 && [[ -f "${CADDYFILE_SRC}" ]]; then
  echo "Updating Caddy config..."
  if [[ -w "${CADDYFILE_DEST}" ]] 2>/dev/null; then
    cp "${CADDYFILE_SRC}" "${CADDYFILE_DEST}"
    systemctl reload caddy 2>/dev/null || systemctl restart caddy
  elif sudo -n true 2>/dev/null; then
    sudo cp "${CADDYFILE_SRC}" "${CADDYFILE_DEST}"
    sudo systemctl enable caddy 2>/dev/null || true
    sudo systemctl reload caddy 2>/dev/null || sudo systemctl restart caddy
  else
    echo "WARNING: Could not update ${CADDYFILE_DEST} (need sudo). Run manually:" >&2
    echo "  sudo cp Caddyfile ${CADDYFILE_DEST} && sudo systemctl reload caddy" >&2
  fi
else
  echo "NOTE: Caddy not installed or Caddyfile missing — skipping reverse-proxy reload."
fi

echo ""
echo "Deploy complete."
echo "  Next.js   → pm2 logs meet-and-talk --lines 30"
echo "  Admin API → pm2 logs meet-and-talk-api --lines 30"
echo "  Health    → curl -s http://127.0.0.1:3080/v1/health"
