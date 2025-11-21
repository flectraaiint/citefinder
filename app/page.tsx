'use client';

import { useState } from 'react';
import { findOpportunities } from '@/lib/api';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    try {
      const data = await findOpportunities(question);
      setResults(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to find opportunities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">CiteFinder</h1>
        <p className="text-gray-600 mb-8">
          Find where to get cited in AI answers (ChatGPT, Claude, Perplexity)
        </p>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question (e.g., What's the best CRM software?)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Find Opportunities'}
            </button>
          </div>
        </form>

        {results && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">
              Found {results.totalOpportunities} opportunities
            </h2>
            <div className="space-y-4">
              {results.topOpportunities.map((opp: any) => (
                <div
                  key={opp.rank}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{opp.title}</h3>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      Score: {opp.citationScore}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    r/{opp.subreddit} • {opp.upvotes} upvotes • {opp.comments} comments
                  </div>
                  <a
                    href={opp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View thread →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
