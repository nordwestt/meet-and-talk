#!/usr/bin/env bash
set -euo pipefail

DEPLOY_DIR="$(cd "$(dirname "$0")" && pwd)"
RELEASE_URL="${RELEASE_URL:-https://github.com/nordwestt/meet-and-talk/releases/latest/download/meet-and-talk.zip}"
ZIP_FILE="${DEPLOY_DIR}/meet-and-talk.zip"

cd "${DEPLOY_DIR}"
mkdir -p logs

echo "Downloading latest release..."
curl -fsSL -o "${ZIP_FILE}" "${RELEASE_URL}"

echo "Extracting..."
unzip -oq "${ZIP_FILE}"

./check-deploy.sh

if pm2 describe meet-and-talk >/dev/null 2>&1; then
  pm2 restart meet-and-talk
else
  pm2 start ecosystem.config.cjs
fi

pm2 save

echo "Deploy complete."
