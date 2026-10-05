import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login, register, signOut } from '../api/auth.api'
import { setLoading, setUserInfo, setIsAuthenticated, setToken, setError, clearError, logout } from '../../../redux/slice/userSlice.redux'

const useAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const state = useSelector((state) => state.user)

  useEffect(() => { dispatch(clearError()) }, [dispatch])

  const authenticate = async (api, credentials) => {
    dispatch(clearError())
    dispatch(setLoading(true))
    try {
      const data = await api(credentials)
      dispatch(setUserInfo(data.user))
      dispatch(setToken(data.token))
      dispatch(setIsAuthenticated(true))
      navigate('/', { replace: true })
    } catch (error) {
      dispatch(setError(error.message))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleLogin = ({ usernameOrEmail, password }) => {
    const identifier = usernameOrEmail.trim()
    return authenticate(login, identifier.includes('@')
      ? { email: identifier, password }
      : { username: identifier, password })
  }

  const handleRegister = ({ name, username, email, password }) =>
    authenticate(register, { name: name.trim(), username: username.trim(), email: email.trim(), password })

  const handleLogout = async () => {
    dispatch(clearError())
    dispatch(setLoading(true))
    try {
      await signOut()
      dispatch(logout())
    } catch (error) {
      dispatch(setError(error.message))
    } finally {
      dispatch(setLoading(false))
    }
  }

  return { ...state, handleLogin, handleRegister, handleLogout, handleClearError: () => dispatch(clearError()) }
}

export default useAuth
