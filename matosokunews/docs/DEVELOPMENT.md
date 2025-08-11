# 開発ガイド

このドキュメントでは、MatoSokuNewsの開発環境のセットアップ方法と開発ワークフローについて説明します。

## 環境要件

- Node.js 18.0 以上
- npm 8.0 以上 または yarn 1.22 以上
- Git 2.25 以上
- PostgreSQL 13 以上
- Docker (オプション、ローカル開発用)

## 初回セットアップ

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd MatoSokuNews/matosokunews
```

### 2. 依存関係のインストール

```bash
npm install
# または
yarn install
```

### 3. 環境変数の設定

`.env`ファイルをプロジェクトルートに作成し、以下の内容を設定します：

```env
# データベース接続
DATABASE_URL="postgresql://user:password@localhost:5432/matosokunews?schema=public"

# アプリケーション設定
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# セッション設定
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# 外部APIキー（必要に応じて）
OPENAI_API_KEY=your-openai-api-key

# 開発用設定
DEBUG=true
```

### 4. データベースのセットアップ

```bash
# データベースマイグレーションの実行
npx prisma migrate dev --name init

# シードデータの投入
npx prisma db seed
```

## 開発サーバーの起動

```bash
# 開発サーバーを起動
npm run dev
# または
yarn dev
```

アプリケーションは [http://localhost:3000](http://localhost:3000) で利用可能になります。

## テストの実行

### ユニットテスト

```bash
npm test
# または
yarn test
```

### E2Eテスト

```bash
npm run test:e2e
# または
yarn test:e2e
```

### テストカバレッジの確認

```bash
npm run test:coverage
# または
yarn test:coverage
```

## コードフォーマットとリンター

```bash
# コードのフォーマット
npm run format
# または
yarn format

# リンターの実行
npm run lint
# または
yarn lint

# 型チェック
npm run type-check
# または
yarn type-check
```

## データベース操作

### マイグレーションの作成

```bash
npx prisma migrate dev --name your_migration_name
```

### Prisma Studioの起動（データベースGUI）

```bash
npx prisma studio
```

## デバッグ

### VS Code でのデバッグ

1. `.vscode/launch.json` に以下の設定を追加：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

## コントリビューションガイドライン

1. 機能追加やバグ修正を行う際は、必ず新しいブランチを作成してください。
   ```bash
   git checkout -b feature/your-feature-name
   # または
   git checkout -b fix/issue-number-description
   ```

2. コミットメッセージは [Conventional Commits](https://www.conventionalcommits.org/) に従ってください。
   - `feat:` 新機能
   - `fix:` バグ修正
   - `docs:` ドキュメントの変更
   - `style:` コードのフォーマット（動作に影響しない変更）
   - `refactor:` リファクタリング
   - `test:` テストの追加・修正
   - `chore:` ビルドプロセスやツールの変更

3. プルリクエストを作成する前に、必ず以下のコマンドを実行してください：
   ```bash
   npm run lint
   npm test
   npm run build
   ```

4. プルリクエストのテンプレートに従って、変更内容を明確に説明してください。

## トラブルシューティング

### 依存関係の問題

```bash
# node_modules を削除して再インストール
rm -rf node_modules
npm install
```

### データベース接続エラー

1. PostgreSQLが起動していることを確認してください。
2. `.env` ファイルの接続文字列が正しいことを確認してください。
3. マイグレーションが適用されているか確認：
   ```bash
   npx prisma migrate status
   ```

## その他のコマンド

### 本番用ビルド

```bash
npm run build
```

### 本番用サーバーの起動

```bash
npm start
```

### 依存関係の更新

```bash
# 依存関係の確認
npm outdated

# 依存関係の更新
npm update