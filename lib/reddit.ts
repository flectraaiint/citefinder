import snoowrap from 'snoowrap';

// Initialize Reddit client
export function getRedditClient() {
  if (!process.env.REDDIT_CLIENT_ID || !process.env.REDDIT_CLIENT_SECRET) {
    throw new Error('Reddit API credentials not configured');
  }

  return new snoowrap({
    userAgent: process.env.REDDIT_USER_AGENT || 'CiteFinder/1.0',
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
  });
}

// Search Reddit for threads matching a question
export async function searchRedditThreads(question: string, limit: number = 50) {
  const reddit = getRedditClient();
  
  try {
    const results = await reddit.search({
      query: question,
      subreddit: 'all',
      limit: limit,
      sort: 'relevance',
    });

    return results.map((submission: any) => ({
      id: submission.id,
      title: submission.title,
      url: `https://reddit.com${submission.permalink}`,
      permalink: submission.permalink,
      upvotes: submission.score,
      comments: submission.num_comments,
      subreddit: submission.subreddit.display_name,
      created: new Date(submission.created_utc * 1000),
      selftext: submission.selftext,
      author: submission.author.name,
    }));
  } catch (error) {
    console.error('Reddit API error:', error);
    throw error;
  }
}

