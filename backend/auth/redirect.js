function frontendUrl() {
  return (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '')
}

function backendUrl() {
  return (process.env.BACKEND_URL || `http://127.0.0.1:${process.env.PORT || 5001}`).replace(/\/$/, '')
}

function redirectToFrontend(res, params) {
  const q = new URLSearchParams(params)
  res.redirect(`${frontendUrl()}/auth/callback?${q}`)
}

function redirectToLoginWithError(res, code, detail) {
  const q = new URLSearchParams({ oauth_error: code })
  if (detail) q.set('oauth_detail', detail)
  res.redirect(`${frontendUrl()}/login?${q}`)
}

function safeReturnPath(path) {
  if (!path || typeof path !== 'string') return '/dashboard'
  if (!path.startsWith('/') || path.startsWith('//')) return '/dashboard'
  return path
}

module.exports = {
  frontendUrl,
  backendUrl,
  redirectToFrontend,
  redirectToLoginWithError,
  safeReturnPath,
}
