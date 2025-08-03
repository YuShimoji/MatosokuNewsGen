import Sidebar from "@/components/Sidebar";

export default function Home() {
  const featuredArticles = [
    {
      id: 1,
      title: "AI技術の最新動向：2024年の展望",
      excerpt: "人工知能技術の急速な発展により、様々な業界で革新的な変化が起きています。今年注目すべきトレンドを解説します。",
      category: "テクノロジー",
      publishedAt: "2024-01-15",
      views: 1250,
      image: "/api/placeholder/400/200"
    },
    {
      id: 2,
      title: "リモートワークの新しい働き方",
      excerpt: "コロナ禍を経て定着したリモートワーク。企業と従業員の双方にとって最適な働き方とは何かを考察します。",
      category: "ビジネス",
      publishedAt: "2024-01-14",
      views: 980,
      image: "/api/placeholder/400/200"
    },
    {
      id: 3,
      title: "次世代Web技術の動向",
      excerpt: "WebAssembly、Progressive Web Apps、そして新しいJavaScriptフレームワークまで、Web開発の未来を探ります。",
      category: "テクノロジー",
      publishedAt: "2024-01-13",
      views: 875,
      image: "/api/placeholder/400/200"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* メインコンテンツ */}
          <div className="flex-1">
            {/* ヒーローセクション */}
            <section className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                MatoSokuNews
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                まとめサイトニュースプラットフォーム
              </p>
              <p className="text-gray-700 leading-relaxed">
                複数のまとめサイトから最新ニュースを収集し、AI技術を活用して質の高い情報を効率的にお届けします。
                テクノロジー、エンタメ、スポーツ、ビジネスなど、幅広いカテゴリの記事をお楽しみください。
              </p>
            </section>

            {/* 注目記事 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">注目記事</h2>
              <div className="grid gap-6">
                {featuredArticles.map((article) => (
                  <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <div className="h-48 md:h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">画像プレースホルダー</span>
                        </div>
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-center mb-2">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {article.category}
                          </span>
                          <span className="text-gray-500 text-sm ml-4">
                            {article.publishedAt}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3 hover:text-blue-600 cursor-pointer">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {article.views.toLocaleString()} views
                          </span>
                          <button className="text-blue-600 hover:text-blue-800 font-medium">
                            続きを読む →
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          {/* サイドバー */}
          <Sidebar />
        </div>
      </div>
    </div>
  );
}