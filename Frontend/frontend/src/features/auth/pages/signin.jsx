import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    HiOutlineUser,
    HiOutlineLockClosed,
    HiOutlineEye,
    HiOutlineEyeOff
} from 'react-icons/hi'
import { IoMusicalNotesOutline } from 'react-icons/io5'
import './auth.css'
import useAuth from '../hooks/useAuth'

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
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

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false)

    const [formData, setFormData] = useState({
        usernameOrEmail: '',
        password: '',
    })
    const { handleLogin, loading, error, handleClearError } = useAuth()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })

        if (error) {
            handleClearError()
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        handleLogin(formData)
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
                    <h1 className="auth-title">Welcome Back</h1>
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

                {/* Form */}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <motion.div
                        className="input-group"
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={1}
                    >
                        <HiOutlineUser className="input-icon" />
                        <input
                            id="signin-username"
                            type="text"
                            name="usernameOrEmail"
                            placeholder="Username or Email"
                            value={formData.usernameOrEmail}
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
                        custom={2}
                    >
                        <HiOutlineLockClosed className="input-icon" />
                        <input
                            id="signin-password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            className="password-input"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="current-password"
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
                        custom={3}
                        whileHover={!loading ? { scale: 1.02 } : {}}
                        whileTap={!loading ? { scale: 0.98 } : {}}
                        disabled={loading}
                        style={{ opacity: loading ? 0.7 : 1 }}
                    >
                        <IoMusicalNotesOutline style={{ marginRight: 8, fontSize: 18, verticalAlign: 'middle' }} />
                        {loading ? 'Signing in...' : 'Sign In'}
                    </motion.button>
                </form>

                {/* Footer */}
                <motion.div
                    className="auth-footer"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={4}
                >
                    Don't have an account?{' '}
                    <Link to="/signup">Sign Up</Link>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default SignIn