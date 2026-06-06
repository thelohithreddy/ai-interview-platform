import { BASE_URL } from '../services/api'

const OAUTH_ERROR_MESSAGES = {
  google_not_configured:
    'Google sign-in is not configured yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to backend/.env',
  github_not_configured:
    'GitHub sign-in is not configured yet. Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to backend/.env',
  apple_not_configured:
    'Apple sign-in is not configured yet. Add Apple OAuth keys to backend/.env',
  google_denied: 'Google sign-in was cancelled.',
  github_denied: 'GitHub sign-in was cancelled.',
  apple_denied: 'Apple sign-in was cancelled.',
  google_failed: 'Google sign-in failed. Check your OAuth credentials and redirect URI.',
  github_failed: 'GitHub sign-in failed. Check your OAuth credentials and redirect URI.',
  apple_failed: 'Apple sign-in failed. Check your Apple Developer settings.',
  invalid_state: 'Sign-in session expired. Please try again.',
  unknown_provider: 'Unknown sign-in provider.',
  invalid_callback: 'Sign-in could not be completed. Please try again.',
}

export function getOAuthErrorMessage(code, detail) {
  const base = OAUTH_ERROR_MESSAGES[code] || 'Sign-in failed. Please try again.'
  if (detail && !base.includes(detail)) {
    return `${base} (${detail})`
  }
  return base
}

/**
 * Redirects the browser to the provider (Google account chooser, GitHub, Apple ID).
 */
export function startOAuthRedirect(provider, returnTo = '/dashboard') {
  const params = new URLSearchParams()
  if (returnTo && returnTo.startsWith('/')) {
    params.set('returnTo', returnTo)
  }
  const qs = params.toString()
  const url = `${BASE_URL}/api/auth/${provider}${qs ? `?${qs}` : ''}`
  window.location.assign(url)
}

export async function fetchOAuthStatus() {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/status`)
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}
