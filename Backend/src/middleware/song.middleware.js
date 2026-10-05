import { getSpotifyAccessToken } from "../service/accessToken.service.js";

// Attaches a valid Spotify app token as req.spotifyToken for downstream handlers.
async function ensureSpotifyToken(req, res, next) {
  try {
    req.spotifyToken = await getSpotifyAccessToken();
    next();
  } catch (error) {
    next(error);
  }
}

// Back-compat alias: previous route used `getSpotifyToken`.
const getSpotifyToken = ensureSpotifyToken;

export { ensureSpotifyToken, getSpotifyToken };
export default { ensureSpotifyToken, getSpotifyToken };
