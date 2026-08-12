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
import { register } from '../api/auth.api'

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
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    register(formData)
      .then((data) => {
        console.log('Sign up successful:', data)
      })
      .catch((error) => {
        console.error('Sign up failed:', error)
      })
    console.log('Sign up:', formData)
  }

  return (
    <div className="auth-page">
      {/* Animated Background */}
      <div className="auth-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Floating Music Notes */}
      <div className="floating-notes">
        {musicNotes.map((note, i) => (
          <span key={i} className="note">{note}</span>
        ))}
      </div>

      {/* Auth Card */}
      <motion.div
        className="auth-card"
        variants={cardVariant}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
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

        {/* Form */}
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
              value={formData.name}
              onChange={handleChange}
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
              value={formData.username}
              onChange={handleChange}
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
              value={formData.email}
              onChange={handleChange}
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
              value={formData.password}
              onChange={handleChange}
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

          <motion.button
            type="submit"
            className="auth-submit"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={6}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <IoMusicalNotesOutline style={{ marginRight: 8, fontSize: 18, verticalAlign: 'middle' }} />
            Create Account
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