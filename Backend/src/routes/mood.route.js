import express from 'express';

const moods = [
  { id: 'happy', label: 'Happy', description: 'Keep the good going', title: 'A little sunshine on repeat' },
  { id: 'calm', label: 'Calm', description: 'Slow down a little', title: 'A softer kind of sound' },
  { id: 'focus', label: 'Focused', description: 'Find your flow', title: 'Less noise. More flow.' },
  { id: 'energetic', label: 'Energetic', description: 'Turn up the energy', title: 'For a little extra momentum' },
  { id: 'reflective', label: 'Reflective', description: 'Feel it all', title: 'Room for a quieter moment' },
];

const songs = [
  { id: 'happy-1', mood: 'happy', title: 'Here Comes the Sun', artist: 'The Beatles', genre: 'Classic pop', duration: '3:05' },
  { id: 'happy-2', mood: 'happy', title: 'Put Your Records On', artist: 'Corinne Bailey Rae', genre: 'Soul', duration: '3:35' },
  { id: 'happy-3', mood: 'happy', title: 'Sunday Best', artist: 'Surfaces', genre: 'Pop', duration: '2:38' },
  { id: 'calm-1', mood: 'calm', title: 'Sunset Lover', artist: 'Petit Biscuit', genre: 'Electronic', duration: '3:57' },
  { id: 'calm-2', mood: 'calm', title: 'Bloom', artist: 'The Paper Kites', genre: 'Indie folk', duration: '3:30' },
  { id: 'calm-3', mood: 'calm', title: 'Weightless', artist: 'Marconi Union', genre: 'Ambient', duration: '8:09' },
  { id: 'focus-1', mood: 'focus', title: 'Awake', artist: 'Tycho', genre: 'Instrumental', duration: '4:43' },
  { id: 'focus-2', mood: 'focus', title: 'A Walk', artist: 'Tycho', genre: 'Electronic', duration: '5:17' },
  { id: 'focus-3', mood: 'focus', title: 'First Breath After Coma', artist: 'Explosions in the Sky', genre: 'Post-rock', duration: '9:33' },
  { id: 'energetic-1', mood: 'energetic', title: 'Midnight City', artist: 'M83', genre: 'Synth-pop', duration: '4:03' },
  { id: 'energetic-2', mood: 'energetic', title: 'Blinding Lights', artist: 'The Weeknd', genre: 'Pop', duration: '3:20' },
  { id: 'energetic-3', mood: 'energetic', title: 'Walking on a Dream', artist: 'Empire of the Sun', genre: 'Electronic', duration: '3:18' },
  { id: 'reflective-1', mood: 'reflective', title: 'Holocene', artist: 'Bon Iver', genre: 'Indie folk', duration: '5:36' },
  { id: 'reflective-2', mood: 'reflective', title: 'The Night We Met', artist: 'Lord Huron', genre: 'Indie folk', duration: '3:28' },
  { id: 'reflective-3', mood: 'reflective', title: 'Kasoor', artist: 'Prateek Kuhad', genre: 'Indie', duration: '3:17' },
];

const moodRouter = express.Router();

moodRouter.get('/', (req, res) => {
  res.json({ success: true, source: 'demo', moods });
});

moodRouter.get('/:mood/songs', (req, res) => {
  const mood = moods.find((item) => item.id === req.params.mood);
  if (!mood) return res.status(400).json({ success: false, message: 'Choose a supported mood.' });
  res.json({ success: true, source: 'demo', mood: mood.id, songs: songs.filter((song) => song.mood === mood.id) });
});

export default moodRouter;
