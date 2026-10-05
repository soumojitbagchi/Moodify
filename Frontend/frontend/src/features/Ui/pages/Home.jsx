import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../auth/hooks/useAuth'
import { FiArrowDown, FiArrowUpRight, FiHeadphones, FiLogOut, FiMusic, FiRefreshCw } from 'react-icons/fi'
import { getMoods, getRecommendations } from '../api/ui.api'
import './home.css'

const Home = () => {
  const { isAuthenticated, userInfo, sessionLoading, loading: authLoading, error: authError, handleLogout } = useAuth()
  const [catalog, setCatalog] = useState({ moods: [], loading: true, error: '' })
  const [selectedMood, setSelectedMood] = useState('calm')
  const [selection, setSelection] = useState({ mood: '', songs: [], error: '' })
  const [retry, setRetry] = useState(0)
  const [catalogRetry, setCatalogRetry] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    getMoods(controller.signal)
      .then((data) => setCatalog({ moods: data.moods, loading: false, error: '' }))
      .catch((error) => {
        if (!controller.signal.aborted) setCatalog({ moods: [], loading: false, error: error.message })
      })
    return () => controller.abort()
  }, [catalogRetry])

  useEffect(() => {
    const controller = new AbortController()
    getRecommendations(selectedMood, controller.signal)
      .then((data) => setSelection({ mood: selectedMood, songs: data.songs, error: '' }))
      .catch((error) => {
        if (!controller.signal.aborted) setSelection({ mood: selectedMood, songs: [], error: error.message })
      })
    return () => controller.abort()
  }, [selectedMood, retry])

  const currentMood = catalog.moods.find((mood) => mood.id === selectedMood)
  const loading = selection.mood !== selectedMood

  const retrySongs = () => {
    setSelection({ mood: '', songs: [], error: '' })
    setRetry((value) => value + 1)
  }

  return (
    <div className="home-page">
      <a className="skip-link" href="#moods">Skip to mood selection</a>
      <header className="site-header page-width">
        <Link className="brand" to="/" aria-label="Moodify home"><FiHeadphones aria-hidden="true" /> Moodify<span className="brand-dot">.</span></Link>
        <nav aria-label="Main navigation">
          <a className="nav-discover" href="#moods">Discover</a>
          {sessionLoading ? <span className="status-text" role="status">Checking session…</span> : isAuthenticated ? (
            <button className="button button-quiet" onClick={handleLogout} disabled={authLoading}><FiLogOut aria-hidden="true" /> {authLoading ? 'Signing out…' : 'Sign out'}</button>
          ) : (
            <Link className="button button-quiet" to="/signin">Sign in <FiArrowUpRight aria-hidden="true" /></Link>
          )}
        </nav>
      </header>

      <main className="page-width">
        {authError && <p className="inline-error" role="alert">{authError}</p>}
        <section className="home-hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">A soundtrack for every state of mind</p>
            <h1 id="hero-title">Your mood.<br />Your <span>rhythm.</span></h1>
            <p className="hero-description">Some days need a little energy. Others, a softer beat. Find a few songs that meet you where you are.</p>
            <a className="button button-primary" href="#moods">Find my soundtrack <FiArrowDown aria-hidden="true" /></a>
            <p className="hero-note">No camera. No guessing. Just choose how you feel.</p>
          </div>
          <div className="record-scene" aria-hidden="true">
            <div className="record-sleeve"><span>MOODIFY / VOL. 01</span><div className="sleeve-orbit"></div><p>A little more<br />in tune.</p></div>
            <div className="vinyl"><div className="vinyl-label"><FiMusic /><span>moodify</span><i></i></div></div>
            <div className="record-caption"><span className="caption-line"></span> Made for the way you feel</div>
          </div>
        </section>

        <section id="moods" className="mood-section" aria-labelledby="mood-title">
          <div className="section-heading"><div><p className="eyebrow">01 / Set the tone</p><h2 id="mood-title">{isAuthenticated && userInfo?.name ? `How are you feeling, ${userInfo.name.split(' ')[0]}?` : 'How are you feeling?'}</h2></div><p>Pick a mood. We’ll take it from here.</p></div>
          {catalog.loading && <p className="status-text" role="status">Loading moods…</p>}
          {catalog.error && <div className="inline-error" role="alert"><p>{catalog.error}</p><button className="button button-quiet" onClick={() => { setCatalog({ moods: [], loading: true, error: '' }); setCatalogRetry((value) => value + 1) }}><FiRefreshCw aria-hidden="true" /> Try again</button></div>}
          {!catalog.loading && !catalog.error && catalog.moods.length === 0 && <p className="status-text">No moods are available yet.</p>}
          <div className="mood-options" role="group" aria-label="Choose your mood">
            {catalog.moods.map((mood, index) => (
              <button key={mood.id} className={`mood-option ${selectedMood === mood.id ? 'is-selected' : ''}`} aria-pressed={selectedMood === mood.id} onClick={() => setSelectedMood(mood.id)}>
                <span className="mood-number" aria-hidden="true">0{index + 1}</span><span className="mood-label">{mood.label}</span><span className="mood-description">{mood.description}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="recommendations" aria-labelledby="recommendation-title" aria-busy={loading}>
          <div className="section-heading"><div><p className="eyebrow">02 / Your soundtrack</p><h2 id="recommendation-title">{currentMood ? currentMood.title : 'A softer kind of sound'}</h2></div><span className="demo-label">Demo collection</span></div>
          <p className="collection-description">Handpicked suggestions for your mood. Spotify playback isn’t connected yet.</p>
          <div className="song-list" aria-live="polite">
            {loading ? <div className="list-placeholder" role="status">Finding your soundtrack…</div> : selection.error ? (
              <div className="inline-error" role="alert"><p>{selection.error}</p><button className="button button-quiet" onClick={retrySongs}><FiRefreshCw aria-hidden="true" /> Try again</button></div>
            ) : selection.songs.length === 0 ? <div className="list-placeholder">No songs for this mood yet. Try another mood.</div> : (
              <ol>
                {selection.songs.map((song, index) => (
                  <li className="song-row" key={song.id}>
                    <span className="song-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    <span className={`song-art artwork-${index % 4}`} aria-hidden="true"><FiMusic /></span>
                    <div className="song-details"><h3>{song.title}</h3><p>{song.artist}</p></div>
                    <span className="song-genre">{song.genre}</span>
                    <span className="song-duration" aria-label={`Duration ${song.duration}`}>{song.duration}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>
        {!isAuthenticated && <aside className="join-banner"><div><h2>Make yourself at home.</h2><p>Create an account, or keep exploring. Your mood comes first.</p></div><Link className="button button-quiet" to="/signup">Create an account <FiArrowUpRight aria-hidden="true" /></Link></aside>}
      </main>
      <footer className="site-footer page-width"><span>Moodify. Find your frequency.</span><span>Manual mood selection · Demo recommendations</span></footer>
    </div>
  )
}

export default Home
