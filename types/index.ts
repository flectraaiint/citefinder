// Reddit thread type
export interface RedditThread {
  id: string;
  title: string;
  url: string;
  permalink: string;
  upvotes: number;
  comments: number;
  subreddit: string;
  created: Date;
  selftext: string;
  author: string;
  citationScore?: number;
}

// Opportunity (prioritized thread)
export interface Opportunity extends RedditThread {
  citationScore: number;
  rank: number;
  currentlyCited: boolean;
}

// Question type
export interface Question {
  id: string;
  questionText: string;
  userId: string;
  createdAt: Date;
}

// Engagement type
export interface Engagement {
  id: string;
  opportunityId: string;
  userId: string;
  commentDraft: string;
  status: 'draft' | 'posted' | 'pending';
  createdAt: Date;
}

// Tracking type
export interface Tracking {
  id: string;
  engagementId: string;
  citationStatus: boolean;
  platform: 'chatgpt' | 'claude' | 'perplexity' | 'gemini';
  checkedAt: Date;
}

