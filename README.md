# Meet & Talk

A grassroots community site for language meetups in bars and cafés across Europe.

## Local development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## VPS deployment (Caddy + PM2)

These steps assume Ubuntu/Debian on a VPS with DNS for `meetandtalk.eu` pointing at the server IP.

### 1. Install dependencies

```bash
# Node.js (v20+), pnpm, pm2, caddy
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs caddy
npm install -g pnpm pm2
```

### 2. Build and run the app

```bash
git clone <your-repo-url> meet-and-talk
cd meet-and-talk
pnpm install
pnpm build
pm2 start pnpm --name meet-and-talk -- start
pm2 save
pm2 startup   # follow the printed command to enable boot on restart
```

The app listens on port `3000` by default.

### 3. Configure Caddy

Copy the included Caddyfile and reload Caddy:

```bash
sudo cp Caddyfile /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

Caddy will obtain and renew TLS certificates for `meetandtalk.eu` automatically. Ensure ports **80** and **443** are open in your firewall.

### 4. Deploy updates

```bash
cd meet-and-talk
git pull
pnpm install
pnpm build
pm2 restart meet-and-talk
```
