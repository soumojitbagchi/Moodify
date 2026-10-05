import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { FiArrowLeft, FiArrowRight, FiEye, FiEyeOff, FiHeadphones } from 'react-icons/fi'
import useAuth from '../hooks/useAuth'
import './auth.css'

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ usernameOrEmail: '', password: '' })
  const { handleLogin, loading, sessionLoading, error, isAuthenticated, handleClearError } = useAuth()

  if (isAuthenticated) return <Navigate to="/" replace />

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
    if (error) handleClearError()
  }

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <Link className="auth-back" to="/"><FiArrowLeft aria-hidden="true" /> Back to discovering</Link>
        <div className="auth-card">
          <Link className="auth-brand" to="/"><FiHeadphones aria-hidden="true" /> Moodify.</Link>
          <p className="auth-kicker">Your next soundtrack starts here</p>
          <h1 className="auth-title">Welcome back.</h1>
          <p className="auth-subtitle">Sign in and find a little more of your rhythm.</p>
          {error && <div className="auth-error" role="alert">{error}</div>}
          <form className="auth-form" onSubmit={(event) => { event.preventDefault(); handleLogin(formData) }} aria-busy={loading}>
            <div className="auth-field">
              <label htmlFor="signin-username">Username or email</label>
              <input id="signin-username" name="usernameOrEmail" value={formData.usernameOrEmail} onChange={handleChange} autoComplete="username" placeholder="you@example.com" required maxLength={254} disabled={loading} />
            </div>
            <div className="auth-field">
              <label htmlFor="signin-password">Password</label>
              <div className="password-field">
                <input id="signin-password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} autoComplete="current-password" placeholder="Your password" required disabled={loading} />
                <button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}>{showPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}</button>
              </div>
            </div>
            <button type="submit" className="auth-submit" disabled={loading || sessionLoading}>{loading ? 'Signing in…' : sessionLoading ? 'Checking session…' : 'Sign in'}<FiArrowRight aria-hidden="true" /></button>
          </form>
          <p className="auth-footer">New around here? <Link to="/signup">Create an account</Link></p>
        </div>
        <p className="auth-footnote">Not ready to sign in? <Link to="/">Explore as a guest.</Link></p>
      </div>
    </main>
  )
}

export default SignIn
