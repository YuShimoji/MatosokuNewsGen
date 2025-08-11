# デプロイメントガイド

このドキュメントでは、MatoSokuNewsの本番環境へのデプロイ手順について説明します。

## 前提条件

- Docker 20.10 以上
- Docker Compose 1.29 以上
- ドメイン（推奨）
- SSL証明書（Let's Encrypt推奨）

## 1. サーバー要件

### 推奨スペック

- **CPU**: 2コア以上
- **メモリ**: 4GB以上
- **ストレージ**: 50GB以上（データベース用を含む）
- **OS**: Ubuntu 22.04 LTS または同等のLinuxディストリビューション

## 2. インストール手順

### 2.1 リポジトリのクローン

```bash
# リポジトリをクローン
git clone https://github.com/your-organization/matosokunews.git
cd matosokunews
```

### 2.2 環境変数の設定

`.env.production` ファイルを作成し、必要な環境変数を設定します：

```bash
cp .env.example .env.production
nano .env.production
```

必須の環境変数：

```env
# アプリケーション設定
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
PORT=3000

# データベース設定
POSTGRES_USER=matosokunews
POSTGRES_PASSWORD=your-secure-password
POSTGRES_DB=matosokunews
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}?schema=public

# 認証設定
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.com

# 外部APIキー
OPENAI_API_KEY=your-openai-api-key

# 本番環境設定
DEBUG=false
```

### 2.3 Dockerのセットアップ

`docker-compose.prod.yml` ファイルが正しく設定されていることを確認します：

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.prod
    ports:
      - "3000:3000"
    env_file: .env.production
    depends_on:
      - db
    restart: always
    networks:
      - matosokunews-network
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 5s

  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    env_file: .env.production
    restart: always
    networks:
      - matosokunews-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass your-redis-password
    volumes:
      - redis_data:/data
    restart: always
    networks:
      - matosokunews-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    depends_on:
      - app
    restart: always
    networks:
      - matosokunews-network

  certbot:
    image: certbot/certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"
    networks:
      - matosokunews-network

networks:
  matosokunews-network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
```

### 2.4 Nginx設定

`nginx/nginx.conf` ファイルを作成します：

```nginx
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    keepalive_timeout  65;

    server {
        listen 80;
        server_name your-domain.com www.your-domain.com;
        server_tokens off;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 301 https://$host$request_uri;
        }
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com www.your-domain.com;
        
        ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
        include /etc/letsencrypt/options-ssl-nginx.conf;
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

        # セキュリティヘッダー
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
        
        # キャッシュ設定
        location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
            expires 1y;
            add_header Cache-Control "public, no-transform";
        }

        # アプリケーションへのプロキシ
        location / {
            proxy_pass http://app:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # ヘルスチェック
        location /health {
            access_log off;
            add_header Content-Type text/plain;
            return 200 'healthy\n';
        }
    }
}
```

## 3. SSL証明書の取得

Let's Encryptを使用してSSL証明書を取得します：

```bash
# certbotディレクトリを作成
mkdir -p certbot/conf certbot/www

# テスト用証明書を取得（テスト用）
docker-compose -f docker-compose.prod.yml run --rm certbot certonly --webroot --webroot-path=/var/www/certbot/ -d your-domain.com -d www.your-domain.com --email admin@your-domain.com --agree-tos --no-eff-email --dry-run

# 本番用証明書を取得（テストが成功したら実行）
docker-compose -f docker-compose.prod.yml run --rm certbot certonly --webroot --webroot-path=/var/www/certbot/ -d your-domain.com -d www.your-domain.com --email admin@your-domain.com --agree-tos --no-eff-email
```

## 4. アプリケーションのビルドと起動

```bash
# コンテナをビルド
docker-compose -f docker-compose.prod.yml build

# データベースのマイグレーションを実行
docker-compose -f docker-compose.prod.yml run --rm app npx prisma migrate deploy

# コンテナを起動
docker-compose -f docker-compose.prod.yml up -d

# ログを確認
docker-compose -f docker-compose.prod.yml logs -f
```

## 5. 初期設定

### 管理者ユーザーの作成

```bash
docker-compose -f docker-compose.prod.yml exec app node scripts/create-admin.js
```

### シードデータの投入（オプション）

```bash
docker-compose -f docker-compose.prod.yml exec app npx prisma db seed
```

## 6. バックアップ

### データベースのバックアップ

```bash
# バックアップスクリプトを作成
mkdir -p /backups/matosokunews
cat > /usr/local/bin/backup-matosokunews.sh << 'EOL'
#!/bin/bash
DATE=$(date +%Y%m%d%H%M%S)
BACKUP_DIR="/backups/matosokunews"
FILENAME="matosokunews-db-$DATE.sql"

docker-compose -f /path/to/matosokunews/docker-compose.prod.yml exec -T db pg_dump -U matosokunews matosokunews > $BACKUP_DIR/$FILENAME
gzip $BACKUP_DIR/$FILENAME

# 古いバックアップを削除（30日以上前）
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
EOL

# スクリプトに実行権限を付与
chmod +x /usr/local/bin/backup-matosokunews.sh

# 毎日午前3時にバックアップを実行するcronジョブを設定
(crontab -l 2>/dev/null; echo "0 3 * * * /usr/local/bin/backup-matosokunews.sh") | crontab -
```

## 7. モニタリング

### ログの確認

```bash
# アプリケーションログ
docker-compose -f docker-compose.prod.yml logs -f app

# データベースログ
docker-compose -f docker-compose.prod.yml logs -f db

# Nginxログ
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### リソース使用状況の確認

```bash
# コンテナのリソース使用状況を表示
docker stats

# ディスク使用量を確認
df -h

# メモリ使用量を確認
free -h
```

## 8. メンテナンス

### アプリケーションの更新

```bash
# 最新のコードを取得
git pull

# コンテナを再ビルド
docker-compose -f docker-compose.prod.yml build

# データベースのマイグレーションを実行
docker-compose -f docker-compose.prod.yml run --rm app npx prisma migrate deploy

# コンテナを再起動
docker-compose -f docker-compose.prod.yml up -d --force-recreate
```

### SSL証明書の更新

Let's Encryptの証明書は自動的に更新されますが、手動で更新する場合は：

```bash
docker-compose -f docker-compose.prod.yml run --rm certbot renew --force-renewal
```

## 9. トラブルシューティング

### アプリケーションが起動しない場合

```bash
# コンテナの状態を確認
docker-compose -f docker-compose.prod.yml ps

# ログを確認
docker-compose -f docker-compose.prod.yml logs app

# コンテナ内でシェルを実行
docker-compose -f docker-compose.prod.yml exec app sh
```

### データベース接続エラー

```bash
# データベースの状態を確認
docker-compose -f docker-compose.prod.yml exec db pg_isready -U matosokunews

# データベースに接続
PGPASSWORD=your-password psql -h localhost -U matosokunews -d matosokunews
```

## 10. スケーリング

### 水平スケーリング

```bash
# アプリケーションコンテナをスケールアウト
docker-compose -f docker-compose.prod.yml up -d --scale app=3

# ロードバランシング用のNginx設定を更新
# nginx/nginx.conf の upstream セクションを更新
```

## 11. バックアップからの復元

```bash
# バックアップファイルを解凍
gunzip matosokunews-db-20230101000000.sql.gz

# データベースを復元
cat matosokunews-db-20230101000000.sql | docker-compose -f docker-compose.prod.yml exec -T db psql -U matosokunews matosokunews
```

## サポート

デプロイに関するお問い合わせは、以下の方法でサポートを受けることができます：

- メール: devops@matosokunews.com
- ドキュメント: https://docs.matosokunews.com
- GitHub Issues: https://github.com/your-organization/matosokunews/issues
