import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 記事一覧を取得するAPI
export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      include: {
        source: true
      }
    });
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Articles API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}