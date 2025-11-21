import { supabase } from './supabase';
import crypto from 'crypto';

// Generate hash for question (cache key)
export function hashQuestion(question: string): string {
  return crypto.createHash('md5').update(question.toLowerCase().trim()).digest('hex');
}

// Check if question is cached
export async function getCachedResults(questionHash: string) {
  const { data, error } = await supabase
    .from('reddit_cache')
    .select('*')
    .eq('question_hash', questionHash)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !data) return null;
  
  return data.results;
}

// Cache Reddit results
export async function cacheResults(
  questionHash: string,
  results: any[],
  expiresInHours: number = 24
) {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiresInHours);

  const { error } = await supabase
    .from('reddit_cache')
    .upsert({
      question_hash: questionHash,
      results: results,
      expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Cache error:', error);
  }
}

