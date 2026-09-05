#!/usr/bin/env bash
set -euo pipefail

# Always deploy here so running the script from /root (or anywhere) cannot
# update one tree while PM2 keeps serving another.
DEPLOY_DIR="${DEPLOY_DIR:-/opt/meet-and-talk}"
RELEASE_URL="${RELEASE_URL:-https://github.com/nordwestt/meet-and-talk/releases/latest/download/meet-and-talk.zip}"
ZIP_FILE="${DEPLOY_DIR}/meet-and-talk.zip"
UPLOAD_DIR="${UPLOAD_DIR:-/var/meet-and-talk/uploads}"
CONTENT_DIR="${CONTENT_DIR:-/var/meet-and-talk/content}"
CONTENT_DB="${CONTENT_DIR}/local.db"
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

# Local SQLite lives outside the release zip (same idea as uploads).
echo "Ensuring content database directory exists (${CONTENT_DIR})..."
if [[ ! -d "${CONTENT_DIR}" ]]; then
  mkdir -p "${CONTENT_DIR}" 2>/dev/null || {
    sudo mkdir -p "${CONTENT_DIR}"
    sudo chown "${USER}:${USER}" "${CONTENT_DIR}"
  }
fi
if [[ ! -f "${CONTENT_DB}" ]]; then
  for candidate in \
    "${DEPLOY_DIR}/content/local.db" \
    /root/content/local.db \
    /opt/content/local.db \
    /root/meet-and-talk/content/local.db
  do
    if [[ -f "${candidate}" ]]; then
      echo "Migrating database from ${candidate}"
      cp "${candidate}" "${CONTENT_DB}"
      break
    fi
  done
fi

# Relative file: URLs break when cwd changes; pin local DB to the persistent path.
if [[ -z "${TURSO_DATABASE_URL:-}" ]]; then
  echo "Setting TURSO_DATABASE_URL=file:${CONTENT_DB} in .env"
  printf '\nTURSO_DATABASE_URL=file:%s\n' "${CONTENT_DB}" >> .env
  TURSO_DATABASE_URL="file:${CONTENT_DB}"
elif [[ "${TURSO_DATABASE_URL}" == file:../content/local.db \
   || "${TURSO_DATABASE_URL}" == file:./content/local.db \
   || "${TURSO_DATABASE_URL}" == file:content/local.db ]]; then
  echo "Updating TURSO_DATABASE_URL in .env → file:${CONTENT_DB}"
  tmp_env="$(mktemp)"
  sed "s|^TURSO_DATABASE_URL=.*|TURSO_DATABASE_URL=file:${CONTENT_DB}|" .env > "${tmp_env}"
  mv "${tmp_env}" .env
  TURSO_DATABASE_URL="file:${CONTENT_DB}"
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
