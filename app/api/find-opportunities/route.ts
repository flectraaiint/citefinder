import { NextRequest, NextResponse } from 'next/server';
import { searchRedditThreads } from '@/lib/reddit';
import { prioritizeThreads } from '@/lib/prioritization';
import { hashQuestion, getCachedResults, cacheResults } from '@/lib/cache';
import { supabase } from '@/lib/supabase';
import { RedditThread } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { question, userId } = await request.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    // Check cache first
    const questionHash = hashQuestion(question);
    const cachedResults = await getCachedResults(questionHash);

    let threads: RedditThread[];

    if (cachedResults) {
      // Use cached results
      threads = cachedResults;
    } else {
      // Query Reddit API
      const redditResults = await searchRedditThreads(question, 50);
      threads = redditResults as RedditThread[];

      // Cache results for 24 hours
      await cacheResults(questionHash, threads, 24);
    }

    // Prioritize threads by citation score
    const prioritized = prioritizeThreads(threads, question);

    // Save question to database
    if (userId) {
      await supabase.from('questions').insert({
        question_text: question,
        user_id: userId,
      });
    }

    // Save opportunities to database
    const opportunitiesData = prioritized.map((thread, index) => ({
      question_id: questionHash, // Temporary, will link to actual question ID
      thread_id: thread.id,
      title: thread.title,
      url: thread.url,
      permalink: thread.permalink,
      upvotes: thread.upvotes,
      comments: thread.comments,
      subreddit: thread.subreddit,
      created: thread.created.toISOString(),
      author: thread.author,
      citation_score: thread.citationScore || 0,
    }));

    // Upsert opportunities (avoid duplicates)
    await supabase.from('reddit_opportunities').upsert(opportunitiesData, {
      onConflict: 'thread_id',
    });

    // Format response
    const opportunities = prioritized.slice(0, 10).map((thread, index) => ({
      rank: index + 1,
      title: thread.title,
      url: thread.url,
      subreddit: thread.subreddit,
      upvotes: thread.upvotes,
      comments: thread.comments,
      created: thread.created,
      citationScore: thread.citationScore || 0,
      currentlyCited: false, // Will check later
    }));

    return NextResponse.json({
      question,
      totalOpportunities: prioritized.length,
      topOpportunities: opportunities,
      cached: !!cachedResults,
    });
  } catch (error: any) {
    console.error('Error finding opportunities:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to find opportunities' },
      { status: 500 }
    );
  }
}

