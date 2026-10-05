// Cached Spotify client-credentials token.
// Spotify tokens live ~3600s; we cache in memory and refresh with a safety buffer.
// No side effects on import — call getSpotifyAccessToken() explicitly.

let cachedToken = null;
let expiresAtMs = 0;
const EXPIRY_BUFFER_MS = 60 * 1000;

async function fetchNewToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET are not set");
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Spotify token request failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  if (!data.access_token) {
    throw new Error("Spotify token response missing access_token");
  }
  cachedToken = data.access_token;
  expiresAtMs = Date.now() + (data.expires_in || 3600) * 1000;
  return cachedToken;
}

export async function getSpotifyAccessToken() {
  if (cachedToken && Date.now() < expiresAtMs - EXPIRY_BUFFER_MS) {
    return cachedToken;
  }
  return fetchNewToken();
}

export function clearSpotifyTokenCache() {
  cachedToken = null;
  expiresAtMs = 0;
}
