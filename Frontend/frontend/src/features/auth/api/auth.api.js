import { request } from '../../../api'

export const login = (credentials) =>
  request('/auth/login', { method: 'POST', body: credentials })

export const register = (credentials) =>
  request('/auth/register', { method: 'POST', body: credentials })

export const getMe = (signal) => request('/auth/me', { signal })

export const signOut = () => request('/auth/logout', { method: 'POST' })
