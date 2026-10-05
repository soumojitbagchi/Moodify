import express from "express";
import songController from "../controller/song.controller.js";
import { ensureSpotifyToken } from "../middleware/song.middleware.js";

const songRoute = express.Router();

// All song routes need a Spotify app token; middleware caches it in memory.
songRoute.get("/token", ensureSpotifyToken, songController.getToken);
songRoute.get("/search", ensureSpotifyToken, songController.searchTracks);
songRoute.get("/mood/:mood", ensureSpotifyToken, songController.getByMood);

export default songRoute;
