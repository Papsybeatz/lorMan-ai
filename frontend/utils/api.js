const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
const API_URL = configuredApiUrl || (
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:4000/api'
    : null
);

export async function postToApi(path, payload) {
  if (!API_URL) {
    throw new Error('The API is not configured for this deployment.');
  }

  const response = await fetch(`${API_URL.replace(/\/$/, '')}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    let message = `The API request failed (${response.status}).`;
    try {
      const body = await response.json();
      if (body.error) message = body.error;
    } catch {
      // Keep the status-based message when the server did not return JSON.
    }
    throw new Error(message);
  }

  return response.json();
}

export async function createIntake(payload) {
  return postToApi('/intake', payload);
}
