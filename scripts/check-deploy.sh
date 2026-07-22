#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "Checking deployment in $(pwd)..."

node -e "
const [major, minor] = process.versions.node.split('.').map(Number)
if (major < 20 || (major === 20 && minor < 9)) {
  console.error('Node >= 20.9.0 is required. Found:', process.version)
  process.exit(1)
}
console.log('Node version OK:', process.version)
"

for path in server.js ecosystem.config.cjs .next/static public node_modules/@swc/helpers/_/_interop_require_default/package.json; do
  if [[ ! -e "$path" ]]; then
    echo "Missing required path: $path" >&2
    exit 1
  fi
done

echo "Bundle looks good. Try starting manually with:"
echo "  NODE_ENV=production PORT=3000 HOSTNAME=127.0.0.1 node server.js"
