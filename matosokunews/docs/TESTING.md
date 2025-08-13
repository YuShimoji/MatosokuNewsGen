# テスト手順

このドキュメントでは、MatoSokuNewsプロジェクトのテスト手順について説明します。

## 目次

1. [クイックスタート](#クイックスタート)
2. [ユニットテスト](#ユニットテスト)
3. [統合テスト](#統合テスト)
4. [E2Eテスト](#e2eテスト)
5. [APIテスト](#apiテスト)
6. [パフォーマンステスト](#パフォーマンステスト)
7. [セキュリティテスト](#セキュリティテスト)
8. [ウェブブラウザでの表示確認](#ウェブブラウザでの表示確認)

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

## ウェブブラウザでの表示確認

### 1. 開発サーバーの起動

```bash
# 開発サーバーを起動
npm run dev
```

### 2. ブラウザでの確認

1. ブラウザで以下のURLにアクセスします：
   - メインアプリケーション: [http://localhost:3001](http://localhost:3001)
   - 管理画面: [http://localhost:3001/admin](http://localhost:3001/admin)
   - APIドキュメント: [http://localhost:3001/api-docs](http://localhost:3001/api-docs)

2. 期待される表示:
   - ホームページが正しく表示される
   - ナビゲーションメニューが表示される
   - レスポンシブデザインが適切に機能しているか確認
   - ダークモード/ライトモードの切り替えが機能するか確認

### 3. 認証フローの確認

1. ログインページにアクセス: [http://localhost:3001/login](http://localhost:3001/login)
2. テストユーザーでログイン
   - メール: test@example.com
   - パスワード: password
3. ログイン後、ダッシュボードにリダイレクトされることを確認

### 4. 記事一覧・詳細ページの確認

1. 記事一覧ページにアクセス: [http://localhost:3001/articles](http://localhost:3001/articles)
2. 記事カードが表示されていることを確認
3. 記事をクリックして詳細ページに遷移することを確認
4. 記事の本文、公開日、著者情報などが正しく表示されているか確認

### 5. 管理画面の確認

1. 管理画面にアクセス: [http://localhost:3001/admin](http://localhost:3001/admin)
2. 以下の機能が正しく動作するか確認:
   - 記事の追加・編集・削除
   - カテゴリの管理
   - ユーザー管理（管理者権限がある場合）

## トラブルシューティング

### ページが表示されない場合

1. 開発サーバーが正しく起動しているか確認
2. コンソールにエラーメッセージが表示されていないか確認
3. ポート番号が正しいか確認（デフォルト: 3001）

### スタイルが正しく適用されていない場合

1. キャッシュをクリアして再読み込み
2. Tailwind CSSのビルドが完了しているか確認
   ```bash
   npx tailwindcss -i ./src/styles/globals.css -o ./public/styles/globals.css --watch
   ```

### テストがタイムアウトする場合

1. `jest.setTimeout` の値を増やします。
2. テスト環境のリソースを確認します。

### テスト間の干渉

各テストは独立して実行されるべきです。テスト間で状態が共有されないように、`beforeEach` や `afterEach` を適切に使用してください。

### 非同期テストのデバッグ

非同期テストのデバッグには、`async/await` と `try/catch` を組み合わせて使用します。
