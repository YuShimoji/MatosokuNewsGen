import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 シードデータの投入を開始します...');

  // 既存のデータをクリア
  await prisma.post.deleteMany();
  await prisma.article.deleteMany();
  await prisma.source.deleteMany();

  console.log('🗑️ 既存データをクリアしました');

  // テスト用のSourceを作成
  const source1 = await prisma.source.create({
    data: {
      name: 'テストニュースサイト1',
      url: 'https://example1.com',
    },
  });

  const source2 = await prisma.source.create({
    data: {
      name: 'テストニュースサイト2',
      url: 'https://example2.com',
    },
  });

  console.log('✅ ソースを作成しました');

  // テスト用のArticleを作成
  await prisma.article.createMany({
    data: [
      {
        title: 'テスト記事1：技術ニュース',
        url: 'https://example1.com/article1',
        summary: 'これは技術関連のテスト記事です。',
        sourceId: source1.id,
      },
      {
        title: 'テスト記事2：ビジネスニュース',
        url: 'https://example1.com/article2',
        summary: 'これはビジネス関連のテスト記事です。',
        sourceId: source1.id,
      },
      {
        title: 'テスト記事3：スポーツニュース',
        url: 'https://example2.com/article3',
        summary: 'これはスポーツ関連のテスト記事です。',
        sourceId: source2.id,
      },
    ],
  });

  console.log('✅ 記事を作成しました');
  console.log('🎉 シードデータの投入が完了しました！');
  
  console.log('\n📊 作成されたデータ:');
  console.log(`- ソース: ${await prisma.source.count()}件`);
  console.log(`- 記事: ${await prisma.article.count()}件`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });