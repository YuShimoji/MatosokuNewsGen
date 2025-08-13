# MatoSokuNews プロジェクト概要

MatoSokuNewsは、最新のニュースを自動的に集約し、AIを用いて独自の視点で再構成・配信する次世代のニュースプラットフォームです。

## 主要機能

- **ユーザー認証**: メールアドレス/パスワードおよびGoogle OAuthによる安全なログイン機能を提供します。
- **AIによる記事自動収集**: RSSフィードから記事を自動収集し、データベースに保存します。
- **AIによる記事生成**: 収集した記事を基に、AIが要約・タイトル生成・カテゴリ分類などを行います。
- **記事表示**: AIによって生成された、付加価値の高いニュースコンテンツをユーザーに提供します。

## 実装状況 (2025-08-13 現在)

### ✅ 完了
- プロジェクトのセットアップ (Next.js, TypeScript, Prisma)
- 認証システム (NextAuth.js)
- データベース設計 (Prisma Schema)
- 記事収集システム (RSSフィード取得、コンテンツ抽出)
- APIエンドポイント (記事収集用)

### ⏳ 進行中
- AIによる記事生成機能
- フロントエンドUI
- 管理ダッシュボード

### 📅 未着手
- 定期実行の設定 (Vercel Cron Jobs)
- パフォーマンス最適化
- 本番環境デプロイ

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript 5.x
- **データベース**: 
  - 本番環境: PostgreSQL
  - 開発環境: SQLite
- **ORM**: Prisma
- **認証**: NextAuth.js
- **AI連携**: OpenAI / Anthropic / Google AI (予定)
- **コンテンツ取得**: rss-parser, axios, cheerio
- **スタイリング**: Tailwind CSS

## プロジェクトの目的

MatoSokuNewsは、AIを活用して複数のニュースソースから情報を収集・分析し、独自の視点を加えたニュース記事を自動生成・配信するプラットフォームです。

## 開発環境のセットアップ

1. リポジトリをクローン
   ```bash
   git clone https://github.com/your-username/matosokunews.git
   cd matosokunews
   ```

2. 依存関係をインストール
   ```bash
   npm install
   ```

3. 環境変数を設定 (`.env` ファイルを作成)
   ```env
   # データベース
   DATABASE_URL="postgresql://user:password@localhost:5432/matosokunews?schema=public"
   
   # 認証
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3001"
   
   # APIキー (後で設定)
   CRON_SECRET="your-cron-secret"
   ```

4. データベースマイグレーションを実行
   ```bash
   npx prisma migrate dev
   ```

5. 開発サーバーを起動
   ```bash
   npm run dev
   ```

6. ブラウザで確認
   - アプリケーション: http://localhost:3001
   - Prisma Studio: http://localhost:5555

   詳細な確認手順は[テストドキュメント](./TESTING.md#ウェブブラウザでの表示確認)を参照してください。

## テスト手順

### 記事収集APIのテスト

1. テストスクリプトを実行
   ```bash
   node scripts/test-fetch-articles.js
   ```

2. または、cURLを使用して直接APIを呼び出す
   ```bash
   curl -X GET "http://localhost:3001/api/cron/fetch-articles" \
     -H "Authorization: Bearer your-cron-secret"
   ```

### データベースの確認

1. Prisma Studioを起動
   ```bash
   npx prisma studio
   ```

2. ブラウザで http://localhost:5555 にアクセスし、`Article` テーブルを確認

## デプロイ手順

### Vercel へのデプロイ

1. Vercel にプロジェクトをインポート
2. 環境変数を設定
3. デプロイを実行

### 定期実行の設定 (Vercel Cron Jobs)

1. Vercel のプロジェクト設定でCronジョブを追加
2. 以下の設定でスケジュールを設定
   - Path: `/api/cron/fetch-articles`
   - Schedule: `0 */6 * * *` (6時間ごと)
   - Headers: 
     - `Authorization: Bearer your-cron-secret`

## トラブルシューティング

### 記事が取得できない場合
- RSSフィードのURLが正しいか確認
- ネットワーク接続を確認
- 開発サーバーのログを確認

### 認証エラーが発生する場合
- `.env` ファイルの `CRON_SECRET` が正しく設定されているか確認
- ヘッダーに正しい認証トークンが含まれているか確認

## コントリビューション

1. 機能ブランチを作成 (`git checkout -b feature/your-feature`)
2. 変更をコミット (`git commit -am 'Add some feature'`)
3. リモートブランチにプッシュ (`git push origin feature/your-feature`)
4. プルリクエストを作成

## 主な機能要件

### 1. コンテンツ収集・処理
- 複数のRSSフィードからの自動記事収集
- ウェブスクレイピングによる情報収集（必要に応じて）
- 外部APIとの連携

### 2. AIを活用したコンテンツ生成
- 記事の要約・分析
- 関連記事の自動グループ化
- 複数ソースを統合した新規コンテンツの生成
- 感情分析とトレンド検出

### 3. マルチサイト対応
- 複数サイトの一括管理
- テーマ・デザインのカスタマイズ
- サイトの複製機能

### 4. コンテンツ公開
- スケジュール投稿
- ソーシャルメディア連携
- パフォーマンス分析

## 技術スタック

### フロントエンド
- Next.js 13+ (App Router)
- TypeScript
- Tailwind CSS
- React Query / SWR

### バックエンド
- Next.js API Routes
- Prisma (ORM)
- PostgreSQL
- Redis (キャッシュ/キュー)

### インフラ
- Docker & Docker Compose
- クラウドプロバイダー (AWS/GCP/Azure)
- CI/CD (GitHub Actions)

### AI/ML
- OpenAI API (GPT-4, Embeddings)
- カスタムモデル (将来的な拡張)
- ベクトルデータベース (pgvector)

## 開発原則

1. **モジュール化**: コンポーネントと機能の再利用性を重視
2. **テストカバレッジ**: 主要機能は必ずテストを実装
3. **ドキュメンテーション**: コードと並行してドキュメントを更新
4. **スケーラビリティ**: 将来的な拡張を見据えた設計
5. **セキュリティ**: セキュアコーディングの徹底

## 初期開発フェーズ

### フェーズ1: コア機能の実装
1. ユーザー認証・認可システム
2. RSSフィード収集パイプライン
3. 基本的な記事管理ダッシュボード
4. シンプルなAI要約機能

### フェーズ2: 高度な機能の追加
1. マルチサイト管理
2. 高度なAIコンテンツ生成
3. パフォーマンス分析ダッシュボード
4. 外部API連携の拡張

### フェーズ3: スケーリングと最適化
1. パフォーマンス最適化
2. キャッシュ戦略の強化
3. マイクロサービスアーキテクチャへの移行
4. マルチリージョン展開

## 現在の進捗状況

- [x] プロジェクトの初期設定
- [x] 基本的なドキュメントの整備
- [ ] コア機能の実装（進行中）
  - [ ] ユーザー認証システム
  - [ ] RSSフィード収集パイプライン
  - [ ] 記事管理ダッシュボード
  - [ ] AI要約機能

## 今後の開発計画

### 短期目標（2週間）
1. ユーザー認証システムの実装
2. 基本的なRSSフィード収集機能の実装
3. 記事一覧・詳細表示の実装

### 中期目標（1-2ヶ月）
1. AIを活用した記事要約機能の実装
2. 管理ダッシュボードの充実
3. マルチサイト管理の基本機能

### 長期目標（3-6ヶ月）
1. 高度なAIコンテンツ生成機能
2. パフォーマンス分析ダッシュボード
3. 外部サービス連携の拡張

## メンテナンスとサポート

- 定期的なセキュリティアップデートの適用
- 依存パッケージの定期的な更新
- パフォーマンスモニタリングと最適化
- ユーザーフィードバックに基づく改善