// Client-side API functions

export async function findOpportunities(question: string) {
  const response = await fetch('/api/find-opportunities', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    throw new Error('Failed to find opportunities');
  }

  return response.json();
}

export async function generateComment(
  threadTitle: string,
  threadContent: string,
  productName: string,
  productDescription?: string
) {
  const response = await fetch('/api/generate-comment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      threadTitle,
      threadContent,
      productName,
      productDescription,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate comment');
  }

  return response.json();
}

export async function trackEngagement(
  opportunityId: string,
  userId: string,
  commentDraft?: string,
  status?: string
) {
  const response = await fetch('/api/track', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      opportunityId,
      userId,
      commentDraft,
      status,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to track engagement');
  }

  return response.json();
}

