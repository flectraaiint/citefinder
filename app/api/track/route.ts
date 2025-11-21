import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { opportunityId, userId, commentDraft, status } = await request.json();

    if (!opportunityId || !userId) {
      return NextResponse.json(
        { error: 'Opportunity ID and user ID are required' },
        { status: 400 }
      );
    }

    // Save engagement
    const { data, error } = await supabase
      .from('engagement')
      .insert({
        opportunity_id: opportunityId,
        user_id: userId,
        comment_draft: commentDraft || null,
        status: status || 'draft',
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      engagement: data,
    });
  } catch (error: any) {
    console.error('Error tracking engagement:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to track engagement' },
      { status: 500 }
    );
  }
}

