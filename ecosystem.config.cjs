const fs = require('fs')
const path = require('path')

function loadEnvFile(filePath) {
  const env = {}
  if (!fs.existsSync(filePath)) return env
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    env[key] = value
  }
  return env
}

const sharedEnv = loadEnvFile(path.join(__dirname, '.env'))

module.exports = {
  apps: [
    {
      name: 'meet-and-talk',
      script: 'server.js',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      node_args: '--max-old-space-size=384',
      max_memory_restart: '450M',
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      merge_logs: true,
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
        HOSTNAME: '127.0.0.1',
        ...sharedEnv,
      },
    },
    {
      name: 'meet-and-talk-api',
      script: './meet-and-talk-api',
      cwd: __dirname,
      interpreter: 'none',
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '128M',
      error_file: './logs/api-error.log',
      out_file: './logs/api-out.log',
      merge_logs: true,
      env: {
        HTTP_ADDR: ':3080',
        UPLOAD_DIR: '/var/meet-and-talk/uploads',
        UPLOAD_URL_PREFIX: '/uploads',
        CONTENT_REVALIDATE_URL: 'http://127.0.0.1:3000/api/revalidate-content',
        ...sharedEnv,
      },
    },
  ],
}
