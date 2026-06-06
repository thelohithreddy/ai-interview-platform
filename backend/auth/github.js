const { backendUrl } = require('./redirect')

function isGitHubConfigured() {
  return Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET)
}

function getGitHubCallbackUrl() {
  return `${backendUrl()}/api/auth/github/callback`
}

function buildGitHubAuthUrl(state) {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: getGitHubCallbackUrl(),
    scope: 'read:user user:email',
    state,
    allow_signup: 'true',
  })
  return `https://github.com/login/oauth/authorize?${params}`
}

async function exchangeGitHubCode(code) {
  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: getGitHubCallbackUrl(),
    }),
  })
  const data = await res.json()
  if (!res.ok || data.error) {
    throw new Error(data.error_description || data.error || 'GitHub token exchange failed')
  }
  return data.access_token
}

async function fetchGitHubProfile(accessToken) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'ai-interview-platform',
  }

  const userRes = await fetch('https://api.github.com/user', { headers })
  const user = await userRes.json()
  if (!userRes.ok) throw new Error(user.message || 'Failed to load GitHub profile')

  let email = user.email
  if (!email) {
    const emailsRes = await fetch('https://api.github.com/user/emails', { headers })
    const emails = await emailsRes.json()
    if (emailsRes.ok && Array.isArray(emails)) {
      const primary = emails.find(e => e.primary && e.verified)
      const verified = emails.find(e => e.verified)
      email = primary?.email || verified?.email || emails[0]?.email
    }
  }

  if (!email) throw new Error('GitHub did not return a verified email. Make email public or grant user:email scope.')

  return {
    name: user.name || user.login || 'GitHub User',
    email,
    picture: user.avatar_url,
  }
}

async function handleGitHubCallback(code) {
  const accessToken = await exchangeGitHubCode(code)
  return fetchGitHubProfile(accessToken)
}

module.exports = {
  isGitHubConfigured,
  buildGitHubAuthUrl,
  handleGitHubCallback,
}
