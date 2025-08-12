# テスト手順

このドキュメントでは、MatoSokuNewsプロジェクトのテスト手順について説明します。

## 目次

1. [ユニットテスト](#ユニットテスト)
2. [統合テスト](#統合テスト)
3. [E2Eテスト](#e2eテスト)
4. [APIテスト](#apiテスト)
5. [パフォーマンステスト](#パフォーマンステスト)
6. [セキュリティテスト](#セキュリティテスト)

## ユニットテスト

### テストの実行

```bash
npm test
```

### カバレッジレポートの生成

```bash
npm run test:coverage
```

## 統合テスト

### データベース統合テスト

```bash
npm run test:integration:db
```

### API統合テスト

```bash
npm run test:integration:api
```

## E2Eテスト

### ローカル環境での実行

1. 開発サーバーを起動
   ```bash
   npm run dev
   ```

2. 別のターミナルでE2Eテストを実行
   ```bash
   npm run test:e2e
   ```

### ヘッドレスモードでの実行

```bash
npm run test:e2e:headless
```

## APIテスト

### 記事収集APIのテスト

```bash
# テストスクリプトを実行
node scripts/test-fetch-articles.js

# または、cURLで直接テスト
curl -X GET "http://localhost:3001/api/cron/fetch-articles" \
  -H "Authorization: Bearer your-cron-secret"
```

### 認証APIのテスト

```bash
# ログインテスト
curl -X POST "http://localhost:3001/api/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# セッション確認
curl "http://localhost:3001/api/auth/session" \
  -H "Cookie: next-auth.session-token=your-session-token"
```

## パフォーマンステスト

### 負荷テスト

```bash
# インストール
npm install -g artillery

# テストの実行
artillery run tests/load-test.yml
```

### メモリリーク検出

```bash
node --inspect-brk node_modules/.bin/jest --runInBand --logHeapUsage
```

## セキュリティテスト

### 依存関係の脆弱性チェック

```bash
npm audit
```

### OWASP ZAP を使用したスキャン

1. OWASP ZAP を起動
2. ターゲットURLを設定: `http://localhost:3001`
3. クイックスキャンを実行

## テストデータの管理

### フィクスチャの生成

```bash
npm run test:generate-fixtures
```

### テストデータベースのリセット

```bash
npm run test:reset-db
```

## デバッグ

### テストのデバッグ

```bash
# Chromeデベロッパーツールでデバッグ
node --inspect-brk node_modules/.bin/jest --runInBand
```

### メモリ使用量のプロファイリング

```bash
node --inspect-brk --expose-gc node_modules/.bin/jest --runInBand --logHeapUsage
```

## CI/CDパイプライン

### テストの自動実行

プルリクエストが作成または更新されるたびに、以下のテストが自動的に実行されます：

1. コードのリンティング
2. 型チェック
3. ユニットテスト
4. 統合テスト
5. E2Eテスト（メインブランチのみ）

### カバレッジレポート

テストカバレッジレポートは、各プルリクエストのコメントとして自動的に投稿されます。

## トラブルシューティング

### テストがタイムアウトする場合

1. `jest.setTimeout` の値を増やします。
2. テスト環境のリソースを確認します。

### テスト間の干渉

各テストは独立して実行されるべきです。テスト間で状態が共有されないように、`beforeEach` や `afterEach` を適切に使用してください。

### 非同期テストのデバッグ

非同期テストのデバッグには、`async/await` と `try/catch` を組み合わせて使用します。
