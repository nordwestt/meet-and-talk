#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [[ -f "${SCRIPT_DIR}/server.js" ]]; then
  cd "${SCRIPT_DIR}"
else
  cd "${SCRIPT_DIR}/.."
fi

echo "Checking deployment in $(pwd)..."

node -e "
const [major, minor] = process.versions.node.split('.').map(Number)
if (major < 20 || (major === 20 && minor < 9)) {
  console.error('Node >= 20.9.0 is required. Found:', process.version)
  process.exit(1)
}
console.log('Node version OK:', process.version)
"

for path in server.js meet-and-talk-api ecosystem.config.cjs .next/static public node_modules/@swc/helpers/_/_interop_require_default/package.json; do
  if [[ ! -e "$path" ]]; then
    echo "Missing required path: $path" >&2
    exit 1
  fi
done

if [[ ! -x meet-and-talk-api ]]; then
  echo "meet-and-talk-api is not executable" >&2
  exit 1
fi

echo "Bundle looks good."
