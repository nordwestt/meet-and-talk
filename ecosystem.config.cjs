/** @type {import('pm2').StartOptions} */
module.exports = {
  apps: [
    {
      name: 'meet-and-talk',
      script: 'server.js',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '127.0.0.1',
      },
    },
  ],
}
