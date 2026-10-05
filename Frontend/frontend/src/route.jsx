import SignIn from './features/auth/pages/signin'
import SignUp from './features/auth/pages/signup'
import Home from './features/Ui/pages/Home'
import { Routes, Route, Link } from 'react-router-dom'

const AppRoutes = () => (
  <Routes>
    <Route path="/signin" element={<SignIn />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/" element={<Home />} />
    <Route path="/detect-mood" element={<Home />} />
    <Route path="*" element={<main className="not-found"><p className="eyebrow">404 / Off the record</p><h1>This page missed a beat.</h1><p>Let’s get you back to your soundtrack.</p><Link className="button button-primary" to="/">Back to Moodify</Link></main>} />
  </Routes>
)

export default AppRoutes
