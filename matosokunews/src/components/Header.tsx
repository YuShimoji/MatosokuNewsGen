import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
              MatoSokuNews
            </Link>
          </div>

          {/* ナビゲーション */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              ホーム
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              カテゴリ
            </Link>
            <Link href="/trending" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              トレンド
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              サイトについて
            </Link>
          </nav>

          {/* 検索ボックス */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="記事を検索..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* モバイルメニューボタン */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-blue-600 p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}