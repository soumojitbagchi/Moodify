const apiUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

export async function request(path, { body, token, signal, ...options } = {}) {
  let response
  try {
    response = await fetch(`${apiUrl}${path}`, {
      ...options,
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(10000)]) : AbortSignal.timeout(10000),
      credentials: 'include',
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error('Unable to reach Moodify. Check that the backend is running and try again.', { cause: error })
  }

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(data?.message || 'Something went wrong. Please try again.')
  }
  if (!data) throw new Error('The server returned an unexpected response. Please try again.')
  return data
}
