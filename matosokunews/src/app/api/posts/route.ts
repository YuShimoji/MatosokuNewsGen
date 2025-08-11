import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 投稿一覧を取得するAPI
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        article: {
          include: {
            source: true
          }
        }
      }
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Posts GET API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// 新しい投稿を作成するAPI
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, articleId } = body;

    if (!title || !content || !articleId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        articleId: Number(articleId),
      },
      include: {
        article: {
          include: {
            source: true
          }
        }
      }
    });
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Posts POST API Error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}