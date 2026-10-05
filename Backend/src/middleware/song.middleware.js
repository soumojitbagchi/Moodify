import { getSpotifyAccessToken } from '../service/accessToken.service.js';
import { ApiError } from './error.middleware.js';

export async function ensureSpotifyToken(req, res, next) {
  try {
    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
      throw new ApiError(503, 'Spotify is not configured yet. Use the demo mood collection for now.');
    }
    req.spotifyToken = await getSpotifyAccessToken();
    next();
  } catch (error) {
    next(error);
  }
}
