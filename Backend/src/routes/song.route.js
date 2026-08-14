import songController from '../controller/song.controller.js'
import songMiddleware from '../middleware/song.middleware.js'
import express from 'express'

const songRoute = express.Router()

songRoute.get('/callback', songMiddleware.getSpotifyToken, songController.refreshToken);