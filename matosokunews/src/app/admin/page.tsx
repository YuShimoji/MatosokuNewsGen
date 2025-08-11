'use client';

import { useState, useEffect } from 'react';

interface Post {
  id: number;
  title: string;
  content: string;
  articleId: number;
  createdAt: string;
  updatedAt: string;
}

interface Article {
  id: number;
  title: string;
  url: string;
  sourceId: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [articleId, setArticleId] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
    };
    const fetchArticles = async () => {
      const res = await fetch('/api/articles');
      const data = await res.json();
      setArticles(data);
      if (data.length > 0) {
        setArticleId(String(data[0].id));
      }
    };
    fetchPosts();
    fetchArticles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content, articleId: Number(articleId) }),
    });

    if (res.ok) {
      const newPost = await res.json();
      setPosts([...posts, newPost]);
      setTitle('');
      setContent('');
      setArticleId('');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">投稿管理</h1>

      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded">
        <h2 className="text-xl mb-2">新規投稿</h2>
        <div className="mb-2">
          <label htmlFor="title" className="block">タイトル</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label htmlFor="content" className="block">内容</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label htmlFor="articleId" className="block">記事</label>
          <select
            id="articleId"
            value={articleId}
            onChange={(e) => setArticleId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            {articles.map((article) => (
              <option key={article.id} value={article.id}>
                {article.title}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          投稿する
        </button>
      </form>

      <h2 className="text-xl mb-2">投稿一覧</h2>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="p-4 border rounded">
            <h3 className="font-bold">{post.title}</h3>
            <p>{post.content}</p>
            <small>Article ID: {post.articleId}</small>
          </div>
        ))}
      </div>
    </div>
  );
}