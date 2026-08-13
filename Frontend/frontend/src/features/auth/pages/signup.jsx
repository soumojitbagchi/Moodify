import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiOutlineUser,
  HiOutlineLockClosed,
  HiOutlineMail,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineIdentification
} from 'react-icons/hi'
import { IoMusicalNotesOutline } from 'react-icons/io5'
import { FiCamera } from 'react-icons/fi'
import './auth.css'
import useAuth from '../hooks/useAuth'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
}

const cardVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

const musicNotes = ['♪', '♫', '♬', '♩', '♪', '♫', '♬', '♩']

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const { handleRegister, loading, error, handleClearError } = useAuth()


  const handleSubmit = (e) => {
    e.preventDefault()
    handleRegister({ name, username, email, password })
  }

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <div className="floating-notes">
        {musicNotes.map((note, i) => (
          <span key={i} className="note">{note}</span>
        ))}
      </div>

      <motion.div
        className="auth-card"
        variants={cardVariant}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="auth-header"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <div className="equalizer">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
          <div className="auth-logo">Moodify</div>
          <p className="auth-subtitle">Music that matches your mood</p>
          <h1 className="auth-title">Create Account</h1>
        </motion.div>

        {error && (
          <motion.div
            className="auth-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        {/* Profile Picture Placeholder */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          <div className="profile-pic-placeholder" title="Profile picture">
            <HiOutlineUser className="icon" />
          </div>
          <p className="profile-pic-label">Profile Picture</p>
        </motion.div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <motion.div
            className="input-group"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <HiOutlineIdentification className="input-icon" />
            <input
              id="signup-name"
              type="text"
              name="name"
              placeholder="Full Name"
              value={name}
              onChange={handleNameChange}
              autoComplete="name"
              required
            />
          </motion.div>

          <motion.div
            className="input-group"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <HiOutlineUser className="input-icon" />
            <input
              id="signup-username"
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={handleUsernameChange}
              autoComplete="username"
              required
            />
          </motion.div>

          <motion.div
            className="input-group"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
          >
            <HiOutlineMail className="input-icon" />
            <input
              id="signup-email"
              type="email"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={handleEmailChange}
              autoComplete="email"
              required
            />
          </motion.div>

          <motion.div
            className="input-group"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={5}
          >
            <HiOutlineLockClosed className="input-icon" />
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              className="password-input"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
            </button>
          </motion.div>

          {/* CHANGED: Loading state on button */}
          <motion.button
            type="submit"
            className="auth-submit"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={6}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            <IoMusicalNotesOutline style={{ marginRight: 8, fontSize: 18, verticalAlign: 'middle' }} />
            {loading ? 'Creating account...' : 'Create Account'}
          </motion.button>
        </form>

        {/* Footer */}
        <motion.div
          className="auth-footer"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={7}
        >
          Already have an account?{' '}
          <Link to="/signin">Sign In</Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SignUp