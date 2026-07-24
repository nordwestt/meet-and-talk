# Meet & Talk

A grassroots community site for language meetups in bars and cafés across Europe.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Updating cities, events, etc.

Content lives in Turso. Edit via the **Go admin API** (`/admin-api`, see [api/README.md](api/README.md)),
the browser UI at [`/admin-panel`](/admin-panel), or a SQL client. With `TURSO_DATABASE_URL` on the
Next server, edits show up on the next request (cached ~60s) — no rebuild.
Details: [docs/CONTENT.md](docs/CONTENT.md).

```bash
npm run content:seed       # first time: schema + seed
# POST/PATCH https://…/admin-api/v1/cities  (Bearer ADMIN_API_TOKEN)
```

## Releases

Push to the `release` branch to build and publish a GitHub release automatically.

1. Bump `version` in `package.json`
2. Push or merge to `release`

CI reads the version (e.g. `0.3.0`), creates tag `v0.3.0`, and uploads `meet-and-talk-v0.3.0.zip` plus `meet-and-talk.zip` (latest alias).

You can also trigger a release manually from **Actions → Release → Run workflow**.

## VPS deployment (Caddy + PM2)

Assumes Ubuntu/Debian with DNS for `meetandtalk.eu` pointing at the server.

### One-time server setup

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs caddy unzip curl
node -v   # must be v20.9.0 or newer
npm install -g pm2

sudo mkdir -p /opt/meet-and-talk /var/meet-and-talk/uploads
sudo chown "$USER":"$USER" /opt/meet-and-talk /var/meet-and-talk/uploads
cd /opt/meet-and-talk

curl -fsSL -o deploy.sh https://raw.githubusercontent.com/nordwestt/meet-and-talk/release/scripts/deploy.sh
chmod +x deploy.sh
./deploy.sh   # downloads the bundle; stops until .env exists

cp .env.example .env
$EDITOR .env   # ADMIN_API_TOKEN, TURSO_*, CONTENT_REVALIDATE_SECRET
./deploy.sh    # starts Next.js + admin API (PM2) and reloads Caddy

pm2 startup   # follow the printed command to enable boot on restart
```

Ensure ports **80** and **443** are open. Caddy handles TLS automatically.

The deploy script downloads the latest release, validates the bundle, starts **Next.js** and the **Go admin API** via PM2, and reloads Caddy when sudo is available.

### Deploy updates

From `/opt/meet-and-talk`:

```bash
./deploy.sh
```

### Troubleshooting

```bash
node -v
pm2 status
pm2 logs meet-and-talk --lines 50
pm2 logs meet-and-talk-api --lines 50
./check-deploy.sh
curl -s http://127.0.0.1:3080/v1/health
NODE_ENV=production PORT=3000 HOSTNAME=127.0.0.1 node server.js
```

- **Node too old** — install Node 20 from NodeSource, then `./deploy.sh`
- **Low memory (512 MB VPS)** — add swap: `sudo fallocate -l 1G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile`
- **Caddy not reloaded** — `sudo cp Caddyfile /etc/caddy/Caddyfile && sudo systemctl reload caddy`
