import Parser from 'rss-parser';
import axios from 'axios';
import * as cheerio from 'cheerio';

// カスタム型定義
interface CustomItem {
  title?: string;
  link?: string;
  contentSnippet?: string;
  isoDate?: string;
  [key: string]: any;
}

// カスタムフィード型
type CustomFeed = { [key: string]: any };
type CustomItemType = { [key: string]: any };

const parser = new Parser<CustomFeed, CustomItemType>({
  customFields: {
    feed: [],
    item: [
      ['content:encoded', 'contentEncoded'],
      ['dc:creator', 'creator'],
      ['pubDate', 'pubDate'],
    ],
  },
});

/**
 * RSSフィードから記事のリストを取得します。
 * @param feedUrl RSSフィードのURL
 * @returns 記事の配列
 */
export async function fetchArticlesFromFeed(feedUrl: string) {
  console.log(`Fetching feed from: ${feedUrl}`);
  try {
    const feed = await parser.parseURL(feedUrl);
    console.log(`Successfully fetched ${feed.items?.length || 0} items from ${feedUrl}`);
    return feed.items || [];
  } catch (error) {
    console.error(`Error fetching feed from ${feedUrl}:`, error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
      });
    }
    return [];
  }
}

/**
 * 指定されたURLから記事の本文を取得します。
 * @param url 記事のURL
 * @returns 記事の本文テキスト
 */
export async function fetchArticleContent(url: string) {
  console.log(`Fetching article content from: ${url}`);
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 10000, // 10秒でタイムアウト
    });
    
    const $ = cheerio.load(data);

    // 記事本文を抽出するロジック
    let articleBody = '';
    
    // 一般的な記事のセレクタを試す
    const selectors = [
      'article',
      'main',
      '.post-content',
      '.article-body',
      '#article-body',
      '.content',
      'div[itemprop="articleBody"]',
    ];

    for (const selector of selectors) {
      const content = $(selector).first();
      if (content.length > 0) {
        articleBody = content.text().trim();
        if (articleBody.length > 100) { // 十分な長さがあるか確認
          break;
        }
      }
    }

    // 本文が見つからない場合は、pタグを連結して代用
    if (!articleBody) {
      articleBody = $('p').map((_, el) => $(el).text().trim()).get().join('\n\n');
    }

    console.log(`Fetched ${articleBody.length} characters from ${url}`);
    return articleBody;
    
  } catch (error) {
    console.error(`Error fetching article content from ${url}:`, error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
    } else if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
      });
    }
    return null;
  }
}
