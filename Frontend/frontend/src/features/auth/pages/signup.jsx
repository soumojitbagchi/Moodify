import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { FiArrowLeft, FiArrowRight, FiEye, FiEyeOff, FiHeadphones } from 'react-icons/fi'
import useAuth from '../hooks/useAuth'
import './auth.css'

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ name: '', username: '', email: '', password: '' })
  const { handleRegister, loading, sessionLoading, error, isAuthenticated, handleClearError } = useAuth()

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
          <p className="auth-kicker">A little more in tune</p>
          <h1 className="auth-title">Make it yours.</h1>
          <p className="auth-subtitle">Create an account. Find music for whatever today feels like.</p>
          {error && <div className="auth-error" role="alert">{error}</div>}
          <form className="auth-form" onSubmit={(event) => { event.preventDefault(); handleRegister(formData) }} aria-busy={loading}>
            <div className="auth-field">
              <label htmlFor="signup-name">Full name</label>
              <input id="signup-name" name="name" value={formData.name} onChange={handleChange} autoComplete="name" placeholder="Your name" minLength={2} maxLength={100} required disabled={loading} />
            </div>
            <div className="auth-field">
              <label htmlFor="signup-username">Username</label>
              <input id="signup-username" name="username" value={formData.username} onChange={handleChange} autoComplete="username" placeholder="your_name" minLength={3} maxLength={30} pattern="[a-zA-Z0-9_]+" aria-describedby="username-hint" required disabled={loading} />
              <p className="field-hint" id="username-hint">3–30 letters, numbers or underscores.</p>
            </div>
            <div className="auth-field">
              <label htmlFor="signup-email">Email</label>
              <input id="signup-email" name="email" type="email" value={formData.email} onChange={handleChange} autoComplete="email" placeholder="you@example.com" maxLength={254} required disabled={loading} />
            </div>
            <div className="auth-field">
              <label htmlFor="signup-password">Password</label>
              <div className="password-field">
                <input id="signup-password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} autoComplete="new-password" placeholder="Create a password" minLength={8} maxLength={72} aria-describedby="password-hint" required disabled={loading} />
                <button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}>{showPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}</button>
              </div>
              <p className="field-hint" id="password-hint">Use at least 8 characters. Password managers welcome.</p>
            </div>
            <button type="submit" className="auth-submit" disabled={loading || sessionLoading}>{loading ? 'Creating your account…' : sessionLoading ? 'Checking session…' : 'Create account'}<FiArrowRight aria-hidden="true" /></button>
          </form>
          <p className="auth-footer">Already have an account? <Link to="/signin">Sign in</Link></p>
        </div>
        <p className="auth-footnote">Just looking around? <Link to="/">Explore as a guest.</Link></p>
      </div>
    </main>
  )
}

export default SignUp
