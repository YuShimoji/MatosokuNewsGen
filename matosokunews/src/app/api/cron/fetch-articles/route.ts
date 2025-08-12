import { NextResponse } from 'next/server';
import { fetchArticlesFromFeed, fetchArticleContent } from '@/lib/fetcher';
import { PrismaClient } from '@prisma/client';

// サーバーサイドでのみ実行されることを保証
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// ブラウザからの直接アクセスを防ぐ
const CRON_SECRET = process.env.CRON_SECRET;

// 認証ミドルウェア
function authenticateRequest(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.split(' ')[1];
  return token === CRON_SECRET;
}

const prisma = new PrismaClient();

// 収集対象のRSSフィードリスト
const FEED_URLS = [
  'http://feeds.bbci.co.uk/news/rss.xml', // BBC News
  'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', // New York Times
  // 他のRSSフィードを追加
];

export async function GET(request: Request) {
  // 認証チェック
  if (!authenticateRequest(request)) {
    console.error('Unauthorized access attempt');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('Cron job started: Fetching articles...');

  try {
    for (const feedUrl of FEED_URLS) {
      const articles = await fetchArticlesFromFeed(feedUrl);

      for (const article of articles) {
        if (!article.link) continue;

        // データベースに同じURLの記事が既に存在するか確認
        const existingArticle = await prisma.article.findUnique({
          where: { url: article.link },
        });

        if (existingArticle) {
          console.log(`Article already exists: ${article.title}`);
          continue;
        }

        // 記事本文を取得
        const content = await fetchArticleContent(article.link);
        if (!content) {
          console.log(`Failed to fetch content for: ${article.title}`);
          continue;
        }

        // データベースに新しい記事を保存
        await prisma.article.create({
          data: {
            title: article.title || 'No title',
            url: article.link,
            content: content,
            summary: article.contentSnippet || '',
            publishedAt: article.isoDate ? new Date(article.isoDate) : new Date(),
            source: new URL(feedUrl).hostname,
          },
        });

        console.log(`Successfully added article: ${article.title}`);
      }
    }

    console.log('Cron job finished successfully.');
    return NextResponse.json({ message: 'Articles fetched successfully' });
  } catch (error) {
    console.error('Error during cron job:', error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}
