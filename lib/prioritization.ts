import { RedditThread } from '@/types';

// Calculate engagement score (0-100)
export function calculateEngagementScore(upvotes: number, comments: number): number {
  // Normalize upvotes (assume max 10,000 = 100 points)
  const upvoteScore = Math.min((upvotes / 10000) * 50, 50);
  
  // Normalize comments (assume max 1,000 = 100 points)
  const commentScore = Math.min((comments / 1000) * 50, 50);
  
  return Math.round(upvoteScore + commentScore);
}

// Calculate recency score (0-100)
export function calculateRecencyScore(createdDate: Date): number {
  const daysOld = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
  
  // Recent threads (0-7 days) get higher scores
  if (daysOld <= 7) return 100;
  if (daysOld <= 30) return 75;
  if (daysOld <= 90) return 50;
  if (daysOld <= 180) return 25;
  return 10; // Older threads get lower scores
}

// Calculate citation potential score (0-100)
export function calculateCitationPotential(
  thread: RedditThread,
  question: string
): number {
  let score = 50; // Base score
  
  // Check if question keywords appear in title
  const questionKeywords = question.toLowerCase().split(' ');
  const titleLower = thread.title.toLowerCase();
  
  const keywordMatches = questionKeywords.filter(keyword => 
    titleLower.includes(keyword)
  ).length;
  
  // More keyword matches = higher citation potential
  score += keywordMatches * 10;
  
  // High engagement = more likely to be cited
  if (thread.upvotes > 500) score += 20;
  if (thread.comments > 100) score += 20;
  
  return Math.min(score, 100);
}

// Calculate combined citation score
export function calculateCitationScore(
  thread: RedditThread,
  question: string
): number {
  const engagementScore = calculateEngagementScore(thread.upvotes, thread.comments);
  const recencyScore = calculateRecencyScore(thread.created);
  const citationPotential = calculateCitationPotential(thread, question);
  
  // Weighted combination
  // Engagement: 40%, Citation Potential: 40%, Recency: 20%
  const combinedScore = 
    (engagementScore * 0.4) +
    (citationPotential * 0.4) +
    (recencyScore * 0.2);
  
  return Math.round(combinedScore);
}

// Prioritize threads by citation score
export function prioritizeThreads(
  threads: RedditThread[],
  question: string
): RedditThread[] {
  return threads
    .map(thread => ({
      ...thread,
      citationScore: calculateCitationScore(thread, question),
    }))
    .sort((a, b) => b.citationScore - a.citationScore);
}

