#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BUNDLE_DIR="${1:?usage: package-release.sh <output-dir>}"
if [[ "${BUNDLE_DIR}" != /* ]]; then
  BUNDLE_DIR="${ROOT}/${BUNDLE_DIR}"
fi

rm -rf "${BUNDLE_DIR}"
mkdir -p "${BUNDLE_DIR}"

cp -a "${ROOT}/.next/standalone/." "${BUNDLE_DIR}/"
mkdir -p "${BUNDLE_DIR}/.next"
cp -a "${ROOT}/.next/static" "${BUNDLE_DIR}/.next/static"
cp -a "${ROOT}/public" "${BUNDLE_DIR}/public"

# Standalone tracing omits @swc/helpers/_, which Next requires at runtime.
SWC_HELPERS_SRC="${ROOT}/node_modules/@swc/helpers"
if ! node -e "require.resolve('${SWC_HELPERS_SRC}/_/_interop_require_default')" >/dev/null 2>&1; then
  echo "Could not locate @swc/helpers in node_modules" >&2
  exit 1
fi

mkdir -p "${BUNDLE_DIR}/node_modules/@swc"
rm -rf "${BUNDLE_DIR}/node_modules/@swc/helpers"
cp -a "${SWC_HELPERS_SRC}" "${BUNDLE_DIR}/node_modules/@swc/helpers"

mkdir -p "${BUNDLE_DIR}/node_modules/next/node_modules/@swc"
rm -rf "${BUNDLE_DIR}/node_modules/next/node_modules/@swc/helpers"
cp -a "${SWC_HELPERS_SRC}" "${BUNDLE_DIR}/node_modules/next/node_modules/@swc/helpers"

cp "${ROOT}/Caddyfile" "${ROOT}/ecosystem.config.cjs" "${ROOT}/scripts/check-deploy.sh" "${BUNDLE_DIR}/"
chmod +x "${BUNDLE_DIR}/check-deploy.sh"

node -e "
  const path = require('path');
  const bundleDir = process.argv[1];
  require(path.join(bundleDir, 'node_modules/next/dist/shared/lib/constants.js'));
  require(path.join(bundleDir, 'node_modules/@swc/helpers/_/_interop_require_default'));
  console.log('Release bundle checks passed');
" "${BUNDLE_DIR}"
