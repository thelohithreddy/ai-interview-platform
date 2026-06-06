const express = require('express')
const { createOAuthState, verifyState } = require('../auth/state')
const {
  redirectToFrontend,
  redirectToLoginWithError,
  safeReturnPath,
} = require('../auth/redirect')
const google = require('../auth/google')
const github = require('../auth/github')
const apple = require('../auth/apple')

const router = express.Router()

const PROVIDERS = {
  google: {
    isConfigured: google.isGoogleConfigured,
    buildAuthUrl: google.buildGoogleAuthUrl,
    handleCallback: google.handleGoogleCallback,
    notConfiguredCode: 'google_not_configured',
  },
  github: {
    isConfigured: github.isGitHubConfigured,
    buildAuthUrl: github.buildGitHubAuthUrl,
    handleCallback: github.handleGitHubCallback,
    notConfiguredCode: 'github_not_configured',
  },
  apple: {
    isConfigured: apple.isAppleConfigured,
    buildAuthUrl: apple.buildAppleAuthUrl,
    handleCallback: apple.handleAppleCallback,
    notConfiguredCode: 'apple_not_configured',
  },
}

router.get('/api/auth/status', (_req, res) => {
  res.json({
    google: google.isGoogleConfigured(),
    github: github.isGitHubConfigured(),
    apple: apple.isAppleConfigured(),
  })
})

router.get('/api/auth/:provider', (req, res) => {
  const provider = req.params.provider
  const config = PROVIDERS[provider]
  if (!config) {
    return redirectToLoginWithError(res, 'unknown_provider')
  }
  if (!config.isConfigured()) {
    return redirectToLoginWithError(res, config.notConfiguredCode)
  }

  const returnTo = safeReturnPath(req.query.returnTo)
  const state = createOAuthState(provider, returnTo)
  res.redirect(config.buildAuthUrl(state))
})

async function finishOAuth(res, state, profile, provider) {
  const payload = verifyState(state)
  if (!payload || payload.provider !== provider) {
    return redirectToLoginWithError(res, 'invalid_state')
  }

  redirectToFrontend(res, {
    provider,
    name: profile.name || 'User',
    email: profile.email,
    returnTo: payload.returnTo || '/dashboard',
  })
}

router.get('/api/auth/google/callback', async (req, res) => {
  const { code, state, error } = req.query
  if (error) return redirectToLoginWithError(res, 'google_denied', error)
  if (!code) return redirectToLoginWithError(res, 'google_missing_code')
  try {
    const profile = await google.handleGoogleCallback(code)
    await finishOAuth(res, state, profile, 'google')
  } catch (err) {
    console.error('Google OAuth error:', err.message)
    redirectToLoginWithError(res, 'google_failed', err.message)
  }
})

router.get('/api/auth/github/callback', async (req, res) => {
  const { code, state, error, error_description } = req.query
  if (error) return redirectToLoginWithError(res, 'github_denied', error_description || error)
  if (!code) return redirectToLoginWithError(res, 'github_missing_code')
  try {
    const profile = await github.handleGitHubCallback(code)
    await finishOAuth(res, state, profile, 'github')
  } catch (err) {
    console.error('GitHub OAuth error:', err.message)
    redirectToLoginWithError(res, 'github_failed', err.message)
  }
})

router.post(
  '/api/auth/apple/callback',
  express.urlencoded({ extended: false }),
  async (req, res) => {
    const { code, state, error, user } = req.body
    if (error) return redirectToLoginWithError(res, 'apple_denied', error)
    if (!code) return redirectToLoginWithError(res, 'apple_missing_code')
    try {
      const profile = await apple.handleAppleCallback(code, user)
      await finishOAuth(res, state, profile, 'apple')
    } catch (err) {
      console.error('Apple OAuth error:', err.message)
      redirectToLoginWithError(res, 'apple_failed', err.message)
    }
  }
)

module.exports = router
