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
        PORT: 3000,
        HOSTNAME: '127.0.0.1',
      },
    },
  ],
}
