import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useForm } from '../hooks/useForm'
import { useOAuthErrorFromUrl } from '../hooks/useOAuthErrorFromUrl'
import { validators } from '../utils/validators'
import FormField from '../components/ui/FormField'
import AuthLayout, { authStyles as S } from '../components/auth/AuthLayout'
import SocialAuthButtons from '../components/auth/SocialAuthButtons'
import { startOAuthRedirect } from '../utils/socialAuth'

const validatorMap = {
  email: v => validators.email(v),
  password: v => {
    if (!v) return 'Password is required'
    if (v.length < 8) return 'Password must be at least 8 characters'
    return null
  },
}

const INITIAL = { email: '', password: '' }

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const form = useForm(INITIAL, validatorMap)
  const from = location.state?.from?.pathname ?? '/dashboard'

  useOAuthErrorFromUrl(setServerError)

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')
    form.touchAll()
    const errs = form.validate()
    if (!form.isValid(errs)) return

    setLoading(true)
    try {
      await new Promise(res => setTimeout(res, 400))
      const name = form.values.email.split('@')[0]
      login({ name, email: form.values.email.trim().toLowerCase(), authProvider: 'email' })
      navigate(from, { replace: true })
    } catch {
      setServerError('Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleSocialLogin(provider) {
    setServerError('')
    startOAuthRedirect(provider, from)
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue your practice">
      {serverError && (
        <div style={S.serverError} role="alert">
          <span style={{ fontWeight: 700 }}>⚠</span> {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <FormField
          label="Email address"
          type="email"
          value={form.values.email}
          onChange={v => form.handleChange('email', v)}
          onBlur={() => form.handleBlur('email')}
          error={form.errors.email}
          touched={form.touched.email}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <FormField
          label="Password"
          type="password"
          value={form.values.password}
          onChange={v => form.handleChange('password', v)}
          onBlur={() => form.handleBlur('password')}
          error={form.errors.password}
          touched={form.touched.password}
          placeholder="Enter your password"
          autoComplete="current-password"
        />
        <div style={{ textAlign: 'right', marginTop: -10, marginBottom: 20 }}>
          <Link to="/forgot-password" style={S.forgotLink}>Forgot password?</Link>
        </div>
        <button type="submit" style={{ ...S.submitBtn, opacity: loading ? 0.8 : 1 }} disabled={loading}>
          {loading ? <span style={S.btnRow}><span style={S.spinner} />Signing in…</span> : 'Sign in'}
        </button>
      </form>

      <SocialAuthButtons onProviderClick={handleSocialLogin} disabled={loading} />

      <p style={S.footer}>
        Don&apos;t have an account? <Link to="/signup" style={S.link}>Create one free</Link>
      </p>
    </AuthLayout>
  )
}
