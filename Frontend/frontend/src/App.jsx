import { Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './features/auth/pages/signin'
import SignUp from './features/auth/pages/signup'

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  )
}

export default App
