import OpenAI from 'openai';

// Initialize OpenAI client
export function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Generate comment draft for Reddit thread
export async function generateCommentDraft(
  threadTitle: string,
  threadContent: string,
  productName: string,
  productDescription: string
): Promise<string> {
  const openai = getOpenAIClient();

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that generates authentic, helpful Reddit comments. 
          The comment should be natural, helpful, and mention the product organically. 
          Never sound like spam or marketing. Be genuine and provide value.`,
        },
        {
          role: 'user',
          content: `Generate a helpful Reddit comment for this thread:

Thread Title: ${threadTitle}
Thread Content: ${threadContent}

Product: ${productName}
Description: ${productDescription}

Create an authentic comment that:
1. Provides helpful information
2. Mentions ${productName} naturally if relevant
3. Sounds like a real person, not marketing
4. Adds value to the discussion
5. Is 2-4 sentences long`,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

