import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import AppRoutes from './route'
import { getMe } from './features/auth/api/auth.api'
import { setUserInfo, setIsAuthenticated, setSessionLoading } from './redux/slice/userSlice.redux'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const controller = new AbortController()
    getMe(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return
        dispatch(setUserInfo(data.user))
        dispatch(setIsAuthenticated(true))
      })
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) dispatch(setSessionLoading(false))
      })
    return () => controller.abort()
  }, [dispatch])

  return <AppRoutes />
}

export default App
