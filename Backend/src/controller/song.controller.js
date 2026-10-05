import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../middleware/error.middleware.js";
import { getSpotifyAccessToken } from "../service/accessToken.service.js";

const spotifyFetch = async (path, token) => {
  const response = await fetch(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new ApiError(response.status, `Spotify API error: ${response.status} ${text}`);
  }
  return response.json();
};

// GET /api/songs/token — returns a fresh (cached) app token for the frontend dev flow.
const getToken = asyncHandler(async (req, res) => {
  const accessToken = req.spotifyToken || (await getSpotifyAccessToken());
  res.status(200).json({ success: true, accessToken });
});

// GET /api/songs/search?q=<query>&limit=<1-50>&type=track
// Proxies Spotify search so the client secret never leaves the backend.
const searchTracks = asyncHandler(async (req, res) => {
  const q = req.query.q?.trim();
  if (!q) {
    throw new ApiError(400, "Query param 'q' is required, e.g. /api/songs/search?q=happy");
  }
  const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10) || 10, 1), 50);
  const type = req.query.type || "track";

  const token = req.spotifyToken || (await getSpotifyAccessToken());
  const data = await spotifyFetch(
    `/search?q=${encodeURIComponent(q)}&type=${encodeURIComponent(type)}&limit=${limit}`,
    token
  );
  res.status(200).json({ success: true, data });
});

// GET /api/songs/mood/:mood — opinionated search mapping a mood word to a query.
const MOOD_QUERIES = {
  happy: "happy upbeat party",
  sad: "sad melancholy acoustic",
  chill: "chill lofi relax",
  energetic: "energetic workout edm",
  romantic: "romantic love",
  focus: "focus deep concentration",
};

const getByMood = asyncHandler(async (req, res) => {
  const mood = req.params.mood?.toLowerCase().trim();
  const query = MOOD_QUERIES[mood];
  if (!query) {
    throw new ApiError(
      400,
      `Unknown mood '${req.params.mood}'. Try: ${Object.keys(MOOD_QUERIES).join(", ")}`
    );
  }
  const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10) || 10, 1), 50);
  const token = req.spotifyToken || (await getSpotifyAccessToken());
  const data = await spotifyFetch(
    `/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
    token
  );
  res.status(200).json({ success: true, mood, data });
});

export default { getToken, searchTracks, getByMood };
