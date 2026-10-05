import { request } from '../../../api'

export const getMoods = (signal) => request('/moods', { signal })

export const getRecommendations = (mood, signal) =>
  request(`/moods/${encodeURIComponent(mood)}/songs`, { signal })
