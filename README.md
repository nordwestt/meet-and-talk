# Meet & Talk

A grassroots community site for language meetups in bars and cafés across Europe.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Releases

Publishing a GitHub release builds the app in CI and attaches a ready-to-run zip (no build step on the VPS).

1. Create and push a tag, e.g. `v0.1.0`
2. Open **Releases → Draft a new release**, pick the tag, and publish

The workflow uploads `meet-and-talk-<tag>.zip` containing the standalone Next.js server, static assets, `Caddyfile`, and PM2 config.

You can also trigger a test build manually from **Actions → Release → Run workflow**; the zip is saved as a workflow artifact.

## VPS deployment (Caddy + PM2)

These steps assume Ubuntu/Debian on a VPS with DNS for `meetandtalk.eu` pointing at the server IP.

### 1. One-time server setup

```bash
# Node.js 20.9+ is required (Next.js 16). pm2 and caddy too.
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs caddy unzip
node -v   # must be v20.9.0 or newer
npm install -g pm2

sudo mkdir -p /opt/meet-and-talk
sudo chown "$USER":"$USER" /opt/meet-and-talk
```

Download the latest release zip from GitHub and extract it:

```bash
cd /opt/meet-and-talk
curl -LO https://github.com/nordwestt/meet-and-talk/releases/latest/download/meet-and-talk.zip
unzip -o meet-and-talk.zip
mkdir -p logs
./check-deploy.sh
pm2 delete meet-and-talk 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # follow the printed command to enable boot on restart
```

Configure Caddy (once):

```bash
sudo cp /opt/meet-and-talk/Caddyfile /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

Caddy obtains and renews TLS certificates for `meetandtalk.eu` automatically. Ensure ports **80** and **443** are open in your firewall.

### 2. Deploy updates

```bash
cd /opt/meet-and-talk
curl -LO https://github.com/nordwestt/meet-and-talk/releases/latest/download/meet-and-talk.zip
unzip -o meet-and-talk.zip
pm2 restart meet-and-talk
```

### Troubleshooting

If PM2 shows `errored`, run these on the VPS:

```bash
node -v                          # must be >= 20.9.0
pm2 logs meet-and-talk --lines 50
cat /opt/meet-and-talk/logs/error.log

# test outside PM2
cd /opt/meet-and-talk
NODE_ENV=production PORT=3000 HOSTNAME=127.0.0.1 node server.js
```

Common fixes:

- **Old Node.js** — install Node 20 from NodeSource (see setup above), then `pm2 delete meet-and-talk && pm2 start ecosystem.config.cjs`
- **Missing files after unzip** — run `./check-deploy.sh`; if `.next/static` is missing, re-download and unzip again
- **Low memory on 512 MB VPS** — add 1 GB swap: `sudo fallocate -l 1G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile`
