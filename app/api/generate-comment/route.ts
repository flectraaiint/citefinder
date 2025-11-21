import { NextRequest, NextResponse } from 'next/server';
import { generateCommentDraft } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { threadTitle, threadContent, productName, productDescription } =
      await request.json();

    if (!threadTitle || !productName) {
      return NextResponse.json(
        { error: 'Thread title and product name are required' },
        { status: 400 }
      );
    }

    const commentDraft = await generateCommentDraft(
      threadTitle,
      threadContent || '',
      productName,
      productDescription || ''
    );

    return NextResponse.json({
      commentDraft,
    });
  } catch (error: any) {
    console.error('Error generating comment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate comment' },
      { status: 500 }
    );
  }
}

