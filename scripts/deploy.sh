#!/usr/bin/env bash
set -euo pipefail

# Always deploy here so running the script from /root (or anywhere) cannot
# update one tree while PM2 keeps serving another.
DEPLOY_DIR="${DEPLOY_DIR:-/opt/meet-and-talk}"
RELEASE_URL="${RELEASE_URL:-https://github.com/nordwestt/meet-and-talk/releases/latest/download/meet-and-talk.zip}"
ZIP_FILE="${DEPLOY_DIR}/meet-and-talk.zip"
UPLOAD_DIR="${UPLOAD_DIR:-/var/meet-and-talk/uploads}"
CADDYFILE_DEST="${CADDYFILE_DEST:-/etc/caddy/Caddyfile}"

mkdir -p "${DEPLOY_DIR}/logs"
cd "${DEPLOY_DIR}"

echo "Deploying to ${DEPLOY_DIR}"
echo "Downloading latest release..."
curl -fsSL -o "${ZIP_FILE}" "${RELEASE_URL}"

echo "Extracting..."
rm -rf .next
unzip -oq "${ZIP_FILE}"
chmod +x deploy.sh check-deploy.sh meet-and-talk-api

if [[ ! -f .env ]]; then
  echo "ERROR: ${DEPLOY_DIR}/.env is missing." >&2
  echo "Copy .env.example to .env, set ADMIN_API_TOKEN and Turso vars, then re-run." >&2
  exit 1
fi

# shellcheck disable=SC1091
source .env
if [[ -z "${ADMIN_API_TOKEN:-}" ]]; then
  echo "ERROR: ADMIN_API_TOKEN must be set in .env" >&2
  exit 1
fi

echo "Ensuring upload directory exists (${UPLOAD_DIR})..."
if [[ ! -d "${UPLOAD_DIR}" ]]; then
  mkdir -p "${UPLOAD_DIR}" 2>/dev/null || {
    sudo mkdir -p "${UPLOAD_DIR}"
    sudo chown "${USER}:${USER}" "${UPLOAD_DIR}"
  }
fi

./check-deploy.sh

echo "Restarting PM2 apps..."
pm2 delete meet-and-talk meet-and-talk-api >/dev/null 2>&1 || true
pm2 start ecosystem.config.cjs
pm2 save

if command -v caddy >/dev/null 2>&1 && [[ -f Caddyfile ]]; then
  echo "Updating Caddy config..."
  if [[ -w "${CADDYFILE_DEST}" ]]; then
    cp Caddyfile "${CADDYFILE_DEST}"
    systemctl reload caddy 2>/dev/null || systemctl restart caddy
  elif sudo -n true 2>/dev/null; then
    sudo cp Caddyfile "${CADDYFILE_DEST}"
    sudo systemctl reload caddy 2>/dev/null || sudo systemctl restart caddy
  else
    echo "WARNING: Could not update ${CADDYFILE_DEST} (need sudo)." >&2
  fi
fi

echo ""
echo "Deploy complete → ${DEPLOY_DIR}"
echo "  pm2 logs meet-and-talk --lines 30"
echo "  curl -s http://127.0.0.1:3080/v1/health"
