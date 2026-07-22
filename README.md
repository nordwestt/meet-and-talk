# Meet & Talk

A grassroots community site for language meetups in bars and cafés across Europe.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Releases

Publishing a GitHub release builds the app in CI and attaches a ready-to-run zip.

1. Create and push a tag, e.g. `v0.3.0`
2. Open **Releases → Draft a new release**, pick the tag, and publish

CI uploads `meet-and-talk-<tag>.zip` and `meet-and-talk.zip` (latest alias).

## VPS deployment (Caddy + PM2)

Assumes Ubuntu/Debian with DNS for `meetandtalk.eu` pointing at the server.

### One-time server setup

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs caddy unzip curl
node -v   # must be v20.9.0 or newer
npm install -g pm2

sudo mkdir -p /opt/meet-and-talk
sudo chown "$USER":"$USER" /opt/meet-and-talk
cd /opt/meet-and-talk

curl -fsSL -o deploy.sh https://raw.githubusercontent.com/nordwestt/meet-and-talk/master/scripts/deploy.sh
chmod +x deploy.sh
./deploy.sh
pm2 startup   # follow the printed command to enable boot on restart

sudo cp Caddyfile /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

Ensure ports **80** and **443** are open. Caddy handles TLS automatically.

### Deploy updates

From `/opt/meet-and-talk`:

```bash
./deploy.sh
```

The script downloads the latest release zip, extracts it, validates the bundle, and restarts PM2.

### Troubleshooting

```bash
node -v
pm2 logs meet-and-talk --lines 50
./check-deploy.sh
NODE_ENV=production PORT=3000 HOSTNAME=127.0.0.1 node server.js
```

- **Node too old** — install Node 20 from NodeSource, then `./deploy.sh`
- **Low memory (512 MB VPS)** — add swap: `sudo fallocate -l 1G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile`
