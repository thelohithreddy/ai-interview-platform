const crypto = require('crypto')
const { backendUrl } = require('./redirect')

function isAppleConfigured() {
  return Boolean(
    process.env.APPLE_CLIENT_ID
    && process.env.APPLE_TEAM_ID
    && process.env.APPLE_KEY_ID
    && process.env.APPLE_PRIVATE_KEY
  )
}

function getAppleCallbackUrl() {
  return `${backendUrl()}/api/auth/apple/callback`
}

function normalizeApplePrivateKey(key) {
  if (!key) return ''
  return key.includes('\\n') ? key.replace(/\\n/g, '\n') : key
}

function createAppleClientSecret() {
  const teamId = process.env.APPLE_TEAM_ID
  const clientId = process.env.APPLE_CLIENT_ID
  const keyId = process.env.APPLE_KEY_ID
  const privateKey = normalizeApplePrivateKey(process.env.APPLE_PRIVATE_KEY)

  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'ES256', kid: keyId }
  const payload = {
    iss: teamId,
    iat: now,
    exp: now + 60 * 5,
    aud: 'https://appleid.apple.com',
    sub: clientId,
  }

  const encode = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url')
  const signingInput = `${encode(header)}.${encode(payload)}`
  const sign = crypto.createSign('SHA256')
  sign.update(signingInput)
  sign.end()
  const signature = sign.sign({ key: privateKey, dsaEncoding: 'ieee-p1363' }).toString('base64url')
  return `${signingInput}.${signature}`
}

function buildAppleAuthUrl(state) {
  const params = new URLSearchParams({
    client_id: process.env.APPLE_CLIENT_ID,
    redirect_uri: getAppleCallbackUrl(),
    response_type: 'code',
    response_mode: 'form_post',
    scope: 'name email',
    state,
  })
  return `https://appleid.apple.com/auth/authorize?${params}`
}

async function exchangeAppleCode(code) {
  const clientSecret = createAppleClientSecret()
  const res = await fetch('https://appleid.apple.com/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.APPLE_CLIENT_ID,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: getAppleCallbackUrl(),
    }),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error_description || data.error || 'Apple token exchange failed')
  }
  return data
}

function decodeAppleIdToken(idToken) {
  const parts = idToken.split('.')
  if (parts.length < 2) throw new Error('Invalid Apple ID token')
  const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'))
  return payload
}

async function handleAppleCallback(code, userPayload) {
  const tokens = await exchangeAppleCode(code)
  const claims = decodeAppleIdToken(tokens.id_token)

  let name = 'Apple User'
  if (userPayload) {
    try {
      const parsed = typeof userPayload === 'string' ? JSON.parse(userPayload) : userPayload
      const first = parsed?.name?.firstName || ''
      const last = parsed?.name?.lastName || ''
      const full = `${first} ${last}`.trim()
      if (full) name = full
    } catch { /* ignore */ }
  }

  const email = claims.email
  if (!email) throw new Error('Apple did not return an email for this account')

  return { name, email, picture: null }
}

module.exports = {
  isAppleConfigured,
  buildAppleAuthUrl,
  handleAppleCallback,
}
