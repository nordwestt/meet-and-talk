# Meet & Talk

A grassroots community site for language meetups in bars and cafés across Europe.

## Local development

```bash
pnpm install
pnpm dev
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
# Node.js (v20+), pm2, caddy
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs caddy unzip
npm install -g pm2

sudo mkdir -p /opt/meet-and-talk
sudo chown "$USER":"$USER" /opt/meet-and-talk
```

Download the latest release zip from GitHub and extract it:

```bash
cd /opt/meet-and-talk
curl -LO https://github.com/nordwestt/meet-and-talk/releases/latest/download/meet-and-talk.zip
unzip -o meet-and-talk.zip
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
