import Link from 'next/link';

export default function Sidebar() {
  const categories = [
    { name: 'テクノロジー', href: '/categories/tech', count: 45 },
    { name: 'エンタメ', href: '/categories/entertainment', count: 32 },
    { name: 'スポーツ', href: '/categories/sports', count: 28 },
    { name: 'ビジネス', href: '/categories/business', count: 21 },
    { name: '政治', href: '/categories/politics', count: 18 },
    { name: '国際', href: '/categories/international', count: 15 },
  ];

  const popularArticles = [
    { title: 'AI技術の最新動向について', views: 1250 },
    { title: '新しいプログラミング言語の登場', views: 980 },
    { title: 'リモートワークの未来', views: 875 },
    { title: 'クラウドサービスの比較', views: 720 },
    { title: 'セキュリティ対策の重要性', views: 650 },
  ];

  return (
    <aside className="w-full lg:w-80 space-y-6">
      {/* カテゴリ一覧 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">カテゴリ</h3>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.name}>
              <Link 
                href={category.href}
                className="flex justify-between items-center py-2 px-3 rounded hover:bg-gray-100 text-gray-700 hover:text-blue-600"
              >
                <span>{category.name}</span>
                <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 人気記事 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">人気記事</h3>
        <ul className="space-y-3">
          {popularArticles.map((article, index) => (
            <li key={index}>
              <Link href="#" className="block hover:bg-gray-50 p-2 rounded">
                <h4 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">
                  {article.title}
                </h4>
                <p className="text-xs text-gray-500">
                  {article.views.toLocaleString()} views
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 広告スペース */}
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <p className="text-gray-500 text-sm mb-2">広告</p>
        <div className="bg-white rounded border-2 border-dashed border-gray-300 h-32 flex items-center justify-center">
          <p className="text-gray-400 text-sm">広告スペース</p>
        </div>
      </div>

      {/* タグクラウド */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">人気タグ</h3>
        <div className="flex flex-wrap gap-2">
          {['React', 'Next.js', 'TypeScript', 'AI', 'Machine Learning', 'Web開発', 'モバイル', 'クラウド'].map((tag) => (
            <Link
              key={tag}
              href={`/tags/${tag.toLowerCase()}`}
              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}