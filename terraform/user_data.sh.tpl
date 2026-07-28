#!/bin/bash
set -eux

# --- スワップ領域の作成 ---
# t3.micro等の無料利用枠インスタンスはメモリが1GBしかなく、
# npm/bundleのビルドがメモリ不足で失敗しないようにスワップを追加する。
if [ ! -f /swapfile ]; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo "/swapfile none swap sw 0 0" >> /etc/fstab
fi

# --- Docker / Git の導入 ---
# Amazon Linux 2023のdnfリポジトリには docker-compose-plugin パッケージが存在しないため、
# Docker Compose(v2)は公式GitHubリリースのバイナリをCLIプラグインとして直接配置する。
dnf install -y docker git
systemctl enable --now docker
usermod -aG docker ec2-user

mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL https://github.com/docker/compose/releases/download/v2.29.7/docker-compose-linux-x86_64 \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# --- アプリの取得 ---
mkdir -p /opt/app
cd /opt/app
if [ ! -d .git ]; then
  git clone --branch "${repo_branch}" "${repo_url}" .
fi

# --- .env の生成(RDSの接続情報。パスワードはリポジトリにコミットしない) ---
cat > /opt/app/.env <<EOF
DB_HOST=${db_endpoint}
DB_USERNAME=kakeibo
DB_PASSWORD=${db_password}
RAILS_MASTER_KEY=${rails_master_key}
EOF
chmod 600 /opt/app/.env

# --- 初回起動 ---
# backendのdocker-entrypointがdb:prepareを自動実行し、初回はDB作成・migrate・seedまで行う。
cd /opt/app
docker compose -f docker-compose.prod.yml --env-file .env up -d --build
