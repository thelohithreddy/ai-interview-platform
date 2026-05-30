import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useForm } from '../hooks/useForm'
import { validators } from '../utils/validators'
import { FormField } from '../components/FormField'

const validatorMap = {
  email:    (v) => validators.email(v),
  password: (v) => {
    if (!v) return 'Password is required'
    if (v.length < 6) return 'Password must be at least 6 characters'
    return null
  },
}

const INITIAL = { email: '', password: '' }

export default function LoginPage() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const { login }  = useAuth()
  const [loading, setLoading]         = useState(false)
  const [serverError, setServerError] = useState('')

  const form = useForm(INITIAL, validatorMap)

  // Redirect back to wherever the user came from (e.g. a protected page)
  const from = location.state?.from?.pathname ?? '/dashboard'

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')
    form.touchAll()

    const errs = form.validate()
    if (!form.isValid(errs)) return

    setLoading(true)
    try {
      await new Promise((res) => setTimeout(res, 700)) // replace with real API
      const name = form.values.email.split('@')[0]
      login({ name, email: form.values.email.trim().toLowerCase() })
      navigate(from, { replace: true })
    } catch {
      setServerError('Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.header}>
          <span style={S.logoMark}>⬡</span>
          <h1 style={S.title}>Welcome back</h1>
          <p style={S.subtitle}>Sign in to continue your practice</p>
        </div>

        {serverError && (
          <div style={S.serverError} role="alert">{serverError}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Email address"
            type="email"
            value={form.values.email}
            onChange={(v) => form.handleChange('email', v)}
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
            onChange={(v) => form.handleChange('password', v)}
            onBlur={() => form.handleBlur('password')}
            error={form.errors.password}
            touched={form.touched.password}
            placeholder="Enter your password"
            autoComplete="current-password"
          />

          <button type="submit" style={S.submitBtn(loading)} disabled={loading}>
            {loading
              ? <span style={S.btnRow}><span style={S.spinner} /> Signing in…</span>
              : 'Sign in'}
          </button>
        </form>

        <p style={S.footer}>
          Don't have an account?{' '}
          <Link to="/signup" style={S.link}>Create one</Link>
        </p>
      </div>
    </div>
  )
}

const S = {
  page: {
    minHeight: 'calc(100vh - 64px)',
    backgroundColor: '#0d0d1f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#12122a',
    border: '1px solid #1e1e38',
    borderRadius: 18,
    padding: '36px 36px 32px',
    boxSizing: 'border-box',
  },
  header: { textAlign: 'center', marginBottom: 28 },
  logoMark: { fontSize: 32, color: '#5b5bf0', display: 'block', marginBottom: 12 },
  title: {
    color: '#f0f0f8', fontSize: 24, fontWeight: 700,
    margin: '0 0 8px', letterSpacing: '-0.02em',
  },
  subtitle: { color: '#5a5a7a', fontSize: 14, margin: 0 },
  serverError: {
    backgroundColor: '#2a0d14', border: '1px solid #5a1a24',
    color: '#ff8a95', padding: '12px 14px', borderRadius: 10,
    fontSize: 14, marginBottom: 20,
  },
  submitBtn: (loading) => ({
    width: '100%', padding: 14, borderRadius: 10, border: 'none',
    backgroundColor: loading ? '#3d3db0' : '#5b5bf0',
    color: '#ffffff', fontSize: 16, fontWeight: 600,
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.15s', marginTop: 4,
  }),
  btnRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  spinner: {
    display: 'inline-block', width: 14, height: 14, borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff',
    animation: 'spin 0.7s linear infinite',
  },
  footer: { color: '#5a5a7a', textAlign: 'center', marginTop: 22, fontSize: 14 },
  link: { color: '#7b7bf5', textDecoration: 'none', fontWeight: 600 },
}