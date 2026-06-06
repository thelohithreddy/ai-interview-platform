const { backendUrl } = require('./redirect')

function googleClientId() {
  return String(process.env.GOOGLE_CLIENT_ID || '').trim()
}

function googleClientSecret() {
  return String(process.env.GOOGLE_CLIENT_SECRET || '').trim()
}

function isGoogleConfigured() {
  return Boolean(googleClientId() && googleClientSecret())
}

function getGoogleCallbackUrl() {
  return `${backendUrl()}/api/auth/google/callback`
}

function buildGoogleAuthUrl(state) {
  const params = new URLSearchParams({
    client_id: googleClientId(),
    redirect_uri: getGoogleCallbackUrl(),
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    include_granted_scopes: 'true',
    prompt: 'select_account',
    state,
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}

async function exchangeGoogleCode(code) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: googleClientId(),
      client_secret: googleClientSecret(),
      redirect_uri: getGoogleCallbackUrl(),
      grant_type: 'authorization_code',
    }),
  })
  const data = await res.json()
  if (!res.ok) {
    const err = new Error(data.error_description || data.error || 'Google token exchange failed')
    err.status = res.status
    throw err
  }
  return data
}

async function fetchGoogleProfile(accessToken) {
  const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Failed to load Google profile')
  return {
    name: data.name || data.given_name || 'Google User',
    email: data.email,
    picture: data.picture,
  }
}

async function handleGoogleCallback(code) {
  const tokens = await exchangeGoogleCode(code)
  const profile = await fetchGoogleProfile(tokens.access_token)
  if (!profile.email) throw new Error('Google did not return an email for this account')
  return profile
}

module.exports = {
  isGoogleConfigured,
  buildGoogleAuthUrl,
  handleGoogleCallback,
}
