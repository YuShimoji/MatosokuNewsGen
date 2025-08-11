import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from './prisma';

/**
 * サーバーサイドで現在のユーザーを取得
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  return await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
    },
  });
}

/**
 * ユーザーが管理者かどうかを確認
 */
export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === 'ADMIN';
}

/**
 * ユーザーがエディターかどうかを確認
 */
export async function isEditor() {
  const user = await getCurrentUser();
  return user?.role === 'EDITOR' || user?.role === 'ADMIN';
}

/**
 * ユーザーが特定のリソースの所有者かどうかを確認
 */
export async function isResourceOwner(resourceType: 'article' | 'post', resourceId: string) {
  const user = await getCurrentUser();
  if (!user) return false;
  if (user.role === 'ADMIN') return true;

  const resource = await prisma[resourceType].findUnique({
    where: { id: resourceId },
    select: { authorId: true },
  });

  return resource?.authorId === user.id;
}
