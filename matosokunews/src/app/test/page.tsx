'use client';

export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">テストページ</h1>
        <p className="mb-4">このページが表示されれば、Next.jsは正常に動作しています。</p>
        
        <div className="space-y-4">
          <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            <p>✓ Next.jsの動作確認</p>
          </div>
          
          <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            <p>ℹ 以下のリンクからサインインページに移動できます</p>
            <a 
              href="/auth/signin" 
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              サインインページへ →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
