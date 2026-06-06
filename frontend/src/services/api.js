const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001'

function getAuthHeaders() {
  try {
    const raw = localStorage.getItem('ai_interviewer_session')
    if (!raw) return {}
    const session = JSON.parse(raw)
    if (session?.user?.email) {
      return { Authorization: `Bearer ${session.user.email}` }
    }
  } catch { /* ignore */ }
  return {}
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...options.headers,
  }

  const res = await fetch(url, { ...options, headers })

  if (!res.ok) {
    const err = new Error(`API error ${res.status}`)
    err.status = res.status
    try { err.body = await res.json() } catch { /* ignore */ }
    throw err
  }

  const contentType = res.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    return res.json()
  }
  return res.text()
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body: JSON.stringify(body) }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body: JSON.stringify(body) }),
  delete: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
}

export { BASE_URL }
