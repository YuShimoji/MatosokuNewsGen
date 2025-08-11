import 'next-auth';

declare module 'next-auth' {
  /**
   * セッションのユーザーオブジェクトの型を拡張
   */
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  }

  /**
   * セッションオブジェクトの型を拡張
   */
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  /**
   * JWTトークンの型を拡張
   */
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
  }
}
