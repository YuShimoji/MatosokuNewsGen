import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

// RSSフィードのURLリスト
const RSS_FEEDS = [
  { id: 1, url: 'https://news.yahoo.co.jp/rss/topics/top-picks.xml' },
  { id: 2, url: 'https://www.itmedia.co.jp/rss/2.0/itmedia_all.xml' },
  { id: 3, url: 'https://www.watch.impress.co.jp/data/rss/1.0/ipw/feed.rdf' },
];

/**
 * GETリクエストを処理して、RSSフィードから記事を取得し、処理する
 * @param _req - NextRequestオブジェクト
 * @returns - NextResponseオブジェクト
 */
export async function GET(_req: Request) {
  try {
    const parser = new Parser();
    const allArticles: any[] = [];

    for (const feed of RSS_FEEDS) {
      try {
        const feedData = await parser.parseURL(feed.url);
        const articles = feedData.items.map((item) => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          content: item.content,
          sourceId: feed.id,
        }));
        allArticles.push(...articles);
      } catch (error) {
        console.error(`Error fetching feed from ${feed.url}:`, error);
      }
    }

    // 取得した記事をコンソールに出力（デバッグ用）
    console.log(`Fetched ${allArticles.length} articles.`);

    return NextResponse.json({ message: 'ok', articleCount: allArticles.length, articles: allArticles });
  } catch (error) {
    console.error('Error in cron job:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}