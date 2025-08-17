# MatoSokuNews 現状ステータス

最終更新日: 2025-08-17

## 概要
Next.js 14 / TypeScript / Prisma / NextAuth.js を用いたニュース収集・配信基盤。RSS収集 + 本文スクレイピング + 将来的なAI要約/分類を想定。

## 直近の修正点
- Prisma スキーマ整合:
  - `Source` モデルを追加し、`Article` を `sourceId` で `Source` とリレーション化
  - `User.hashedPassword` を追加（将来のCredentials対応を考慮）
- PrismaClient の共有化:
  - `@/lib/prisma` を API ルートで使用するよう統一（`articles`, `posts`, `cron`）
- Cronの保存処理:
  - フィードURLのホスト名から `Source` を upsert → `Article.sourceId` で接続
- Seed 修正:
  - `Article.content` 必須化に伴い、シードデータへ `content` を追加
- 認証UI:
  - `auth/signin` で Credentials 送信を抑止し、Google サインインを案内
- テスト手順更新:
  - `docs/TESTING.md` にスモークテスト追加、ポート 3000 に統一
  - `scripts/test-fetch-articles.js` のポートを 3000 に変更

## 実装済み
- Google OAuth によるサインイン（NextAuth.js）
- 記事/投稿 API（`GET /api/articles`, `GET/POST /api/posts`）
- RSS収集 + 本文スクレイピング + 重複URL排除（cron API、Bearer `CRON_SECRET`）
- 共有 PrismaClient（開発時の再接続安定化）

## 既知の課題 / 未対応
- Credentials 認証（メール/パスワード）は現在無効
- 本番DB（PostgreSQL）移行計画の具体化（現状SQLite）
- 管理画面UIの拡充（記事/ユーザー管理など）
- AI要約/分類・関連付け機能の実装
- E2E/統合テストの整備と CI 連携

## 次アクション（優先順）
1. 本番DB移行計画（PostgreSQL）と接続周りの設定
2. 管理画面（記事・ユーザー管理）の画面設計と実装
3. AI要約/分類の設計（APIキー、失敗時フォールバックを含む）
4. CI 上でのスモークテスト/統合テストの自動化

## テスト
- 詳細は `docs/TESTING.md` を参照
- スモークテスト（DBマイグレーション→シード→API疎通→cron実行→認証UI確認）

## Kiro タスク達成度（docs/specs/ai-news-platform）

-- 参照: `/matosokunews/docs/specs/ai-news-platform/tasks.md`, `requirements.md`, `design.md`

- 現状サマリ（大項目の進捗目安）
  - [未着手] 1. AI処理基盤（API連携/エラーハンドリング/ENV）: 0%
  - [未着手] 2. コアAI機能（要約/タイトル/分類/関連記事）: 0%
  - [一部既存基盤] 3. AIパイプライン統合（ジョブ/cron統合/品質検証）: 10%（記事収集cronは有、AI処理連携は未）
  - [部分] 4. DB拡張（Post AIフィールド/分析モデル/監査）: 20%（一部モデル整合は対応、AI専用フィールド未）
  - [未着手] 5. 動的フロント（一覧/詳細/カテゴリ/検索/レスポンシブ強化）: 10%（基本APIは有、UI強化は未）
  - [未着手] 6. 管理ダッシュボード（UI/承認フロー/分析）: 0%
  - [未着手] 7. 本番運用（PostgreSQL/自動cron/ログ/監視/キャッシュ/バックアップ）: 10%（開発向け基盤のみ）
  - [部分] 8. 品質/重複検知（AI品質/重複/出典表記）: 20%（収集段階のURL重複排除は有、AI品質は未）
  - [未着手] 9. テスト（単体/統合/E2E/カバレッジ）: 10%（スモーク手順は有、自動化未）
  - [未着手] 10. 総合統合と本番準備: 0%

- 補足
  - favicon 安定化・開発時の拡張由来ログ切り分けは完了（アプリ安定性に寄与）
  - 近い将来の優先は「AI処理基盤の着手」「DBスキーマ拡張（PostにAIフィールド）」「簡易的なAI処理API/ジョブの骨組み作成」

