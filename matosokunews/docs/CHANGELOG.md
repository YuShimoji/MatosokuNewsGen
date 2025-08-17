# 開発履歴

## v0.1.1 (2025/08/17)

- 修正: `POST /api/posts` で `authorId` を必須化し、Prisma `post.create` に反映（`src/app/api/posts/route.ts`）
- 安定化: Hydration 警告抑止（`src/app/layout.tsx` の `<html suppressHydrationWarning>`）
- 安定化: favicon を `favicon.svg` に統一し、`/favicon.ico` を 308 リダイレクト（`src/app/favicon.ico/route.ts`, `src/app/icon.svg`）
- ドキュメント: `docs/TESTING.md` に `POST /api/posts` の `authorId` 必須と cURL 例を追記
- ドキュメント: Kiro 仕様（`tasks.md`, `requirements.md`, `design.md`）を `docs/specs/ai-news-platform/` へ移設し、参照を更新
- ドキュメント: `docs/STATUS.md`, `docs/KIRO_PROGRESS.md`, `docs/GIT_WORKFLOW.md`, `docs/KNOWN_ISSUES.md`, `docs/RELEASE_CHECKLIST.md` を更新

## v0.1.0 (2025/08/01)

- プロジェクトの初期設定
- Next.js, TypeScript, Tailwind CSS の導入
- 基本的なディレクトリ構造の作成
- Git リポジトリの初期化
- ドキュメント（仕様書、機能一覧、開発履歴）の作成
- Supabase (PostgreSQL) とのデータベース接続設定
- Prisma ORM の導入とマイグレーションの実行

