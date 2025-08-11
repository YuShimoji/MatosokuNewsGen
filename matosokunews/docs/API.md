# API リファレンス

このドキュメントでは、MatoSokuNewsのAPI仕様について説明します。

## 基本情報

- **ベースURL**: `/api`
- **認証**: Bearer トークン認証
- **レスポンス形式**: JSON
- **エンコーディング**: UTF-8

## 認証

### ログイン

```http
POST /api/auth/signin
```

**リクエストボディ:**

```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

**成功時のレスポンス (200 OK):**

```json
{
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "ADMIN"
  },
  "accessToken": "jwt-access-token"
}
```

## 記事関連

### 記事一覧の取得

```http
GET /api/articles
```

**クエリパラメータ:**

| パラメータ | 型 | 説明 | デフォルト |
|------------|----|------|------------|
| page | number | ページ番号 | 1 |
| limit | number | 1ページあたりの項目数 | 10 |
| category | string | カテゴリでフィルタ | - |
| q | string | 検索クエリ | - |
| sort | string | ソート項目 (createdAt, updatedAt, views) | createdAt |
| order | string | ソート順 (asc, desc) | desc |

**成功時のレスポンス (200 OK):**

```json
{
  "data": [
    {
      "id": "article-id",
      "title": "記事タイトル",
      "summary": "記事のサマリー",
      "category": "テクノロジー",
      "publishedAt": "2024-01-01T00:00:00.000Z",
      "views": 100,
      "source": {
        "id": "source-id",
        "name": "ソース名",
        "url": "https://example.com"
      }
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### 記事の詳細取得

```http
GET /api/articles/{id}
```

**パスパラメータ:**

| パラメータ | 型 | 説明 |
|------------|----|------|
| id | string | 記事ID |

**成功時のレスポンス (200 OK):**

```json
{
  "id": "article-id",
  "title": "記事タイトル",
  "content": "記事の本文（HTML形式）",
  "summary": "記事のサマリー",
  "category": "テクノロジー",
  "publishedAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T01:00:00.000Z",
  "views": 150,
  "source": {
    "id": "source-id",
    "name": "ソース名",
    "url": "https://example.com"
  },
  "relatedArticles": [
    {
      "id": "related-article-id",
      "title": "関連記事タイトル",
      "summary": "関連記事のサマリー",
      "publishedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## 管理API

### 記事の作成 (管理者用)

```http
POST /api/admin/articles
```

**リクエストヘッダー:**

```
Authorization: Bearer your-jwt-token
Content-Type: application/json
```

**リクエストボディ:**

```json
{
  "title": "新しい記事タイトル",
  "content": "記事の本文（Markdown形式）",
  "summary": "記事のサマリー",
  "category": "テクノロジー",
  "sourceId": "source-id",
  "publishedAt": "2024-01-01T00:00:00.000Z",
  "isDraft": false
}
```

**成功時のレスポンス (201 Created):**

```json
{
  "id": "new-article-id",
  "title": "新しい記事タイトル",
  "status": "PUBLISHED"
}
```

## エラーレスポンス

### 400 Bad Request

```json
{
  "error": "VALIDATION_ERROR",
  "message": "バリデーションエラーが発生しました",
  "details": [
    {
      "field": "title",
      "message": "タイトルは必須です"
    }
  ]
}
```

### 401 Unauthorized

```json
{
  "error": "UNAUTHORIZED",
  "message": "認証が必要です"
}
```

### 403 Forbidden

```json
{
  "error": "FORBIDDEN",
  "message": "この操作を実行する権限がありません"
}
```

### 404 Not Found

```json
{
  "error": "NOT_FOUND",
  "message": "リソースが見つかりません"
}
```

### 500 Internal Server Error

```json
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "サーバーでエラーが発生しました",
  "requestId": "req_1234567890"
}
```

## レートリミット

- 認証済みユーザー: 1,000リクエスト/時間
- 未認証ユーザー: 100リクエスト/時間

レートリミットに達すると、以下のヘッダーがレスポンスに含まれます：

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1617185200
Retry-After: 3600
```

## バージョン管理

APIのバージョンはリクエストヘッダーで管理されます：

```
Accept: application/vnd.matosokunews.v1+json
```

現在のバージョン: `v1`

## サンプルコード

### cURL

```bash
curl -X GET 'https://api.matosokunews.com/api/articles?category=technology&limit=5' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer your-jwt-token'
```

### JavaScript (fetch)

```javascript
const response = await fetch('https://api.matosokunews.com/api/articles', {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer your-jwt-token'
  }
});

const data = await response.json();
console.log(data);
```

## サポート

APIに関するお問い合わせは、サポートチームまでご連絡ください：
- メール: support@matosokunews.com
- 営業時間: 月曜日〜金曜日 10:00-18:00 (JST)
