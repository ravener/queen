export const BASE_URL = 'https://api.quavergame.com/v1';

export async function request(endpoint: string) {
  const response = await fetch(BASE_URL + endpoint, {
    headers: {
      'User-Agent': 'Queen Discord Bot',
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    // Resource not found.
    if (response.status === 404) return { status: 404 };
    throw new Error(`Request to '${endpoint}' failed with status ${response.status}: ${response.statusText}`);
  }

  return response.json();
}
