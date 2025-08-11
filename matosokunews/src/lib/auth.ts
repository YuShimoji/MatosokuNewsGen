import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

/**
 * サーバーサイドで現在のセッションを取得する
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

/**
 * 認証が必要なページで使用する
 * 未認証の場合はログインページにリダイレクトする
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/signin");
  }
  return user;
}

/**
 * 管理者権限が必要なページで使用する
 * 未認証または管理者権限がない場合はホームにリダイレクトする
 */
export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    redirect("/");
  }
  return user;
}

/**
 * エディター権限が必要なページで使用する
 * 未認証または権限がない場合はホームにリダイレクトする
 */
export async function requireEditor() {
  const user = await requireAuth();
  if (!["EDITOR", "ADMIN"].includes(user.role || "")) {
    redirect("/");
  }
  return user;
}
