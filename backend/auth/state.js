const crypto = require('crypto')

function getSecret() {
  return process.env.OAUTH_STATE_SECRET || 'dev-oauth-state-secret-change-in-production'
}

function createState(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = crypto.createHmac('sha256', getSecret()).update(data).digest('base64url')
  return `${data}.${sig}`
}

function verifyState(state) {
  if (!state || typeof state !== 'string') return null
  const dot = state.lastIndexOf('.')
  if (dot === -1) return null
  const data = state.slice(0, dot)
  const sig = state.slice(dot + 1)
  const expected = crypto.createHmac('sha256', getSecret()).update(data).digest('base64url')
  if (sig.length !== expected.length) return null
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'))
    if (!payload?.provider || !payload?.nonce) return null
    return payload
  } catch {
    return null
  }
}

function createOAuthState(provider, returnTo) {
  return createState({
    provider,
    returnTo: returnTo || '/dashboard',
    nonce: crypto.randomBytes(16).toString('hex'),
    ts: Date.now(),
  })
}

module.exports = { createOAuthState, verifyState }
