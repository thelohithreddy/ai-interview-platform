import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useForm } from '../hooks/useForm'
import { validators, getPasswordStrength } from '../utils/validators'
import { FormField } from '../components/FormField'

const validatorMap = {
  name:            (v)      => validators.name(v),
  email:           (v)      => validators.email(v),
  password:        (v)      => validators.password(v),
  confirmPassword: (v, all) => validators.confirmPassword(v, all.password),
}

const INITIAL = { name: '', email: '', password: '', confirmPassword: '' }

export default function SignupPage() {
  const navigate  = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading]       = useState(false)
  const [serverError, setServerError] = useState('')

  const form     = useForm(INITIAL, validatorMap)
  const strength = getPasswordStrength(form.values.password)

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')
    form.touchAll()

    const errs = form.validate()
    if (!form.isValid(errs)) return

    setLoading(true)
    try {
      await new Promise((res) => setTimeout(res, 800)) // swap for real API call
      login({
        name:  form.values.name.trim(),
        email: form.values.email.trim().toLowerCase(),
      })
      navigate('/dashboard', { replace: true })
    } catch {
      setServerError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.header}>
          <span style={S.logoMark}>⬡</span>
          <h1 style={S.title}>Create account</h1>
          <p style={S.subtitle}>Start your interview preparation journey</p>
        </div>

        {serverError && (
          <div style={S.serverError} role="alert">{serverError}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Full name"
            type="text"
            value={form.values.name}
            onChange={(v) => form.handleChange('name', v)}
            onBlur={() => form.handleBlur('name')}
            error={form.errors.name}
            touched={form.touched.name}
            placeholder="Ada Lovelace"
            autoComplete="name"
            hint="At least 2 characters, letters only"
          />

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
            placeholder="Create a strong password"
            autoComplete="new-password"
            hint="Min 8 chars · uppercase · lowercase · number"
          />

          {form.values.password && (
            <div style={S.strengthWrap}>
              <div style={S.strengthBar}>
                {[1,2,3,4,5,6].map((i) => (
                  <div
                    key={i}
                    style={{
                      ...S.strengthSeg,
                      backgroundColor: i <= strength.score ? strength.color : '#1e1e38',
                    }}
                  />
                ))}
              </div>
              <span style={{ ...S.strengthLabel, color: strength.color }}>
                {strength.label}
              </span>
            </div>
          )}

          <FormField
            label="Confirm password"
            type="password"
            value={form.values.confirmPassword}
            onChange={(v) => form.handleChange('confirmPassword', v)}
            onBlur={() => form.handleBlur('confirmPassword')}
            error={form.errors.confirmPassword}
            touched={form.touched.confirmPassword}
            placeholder="Repeat your password"
            autoComplete="new-password"
          />

          <button type="submit" style={S.submitBtn(loading)} disabled={loading}>
            {loading
              ? <span style={S.btnRow}><span style={S.spinner} /> Creating account…</span>
              : 'Create account'}
          </button>
        </form>

        <p style={S.footer}>
          Already have an account?{' '}
          <Link to="/login" style={S.link}>Sign in</Link>
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
    maxWidth: 440,
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
  strengthWrap: {
    display: 'flex', alignItems: 'center', gap: 10,
    marginTop: -10, marginBottom: 18,
  },
  strengthBar: { flex: 1, display: 'flex', gap: 4 },
  strengthSeg: { flex: 1, height: 4, borderRadius: 2, transition: 'background-color 0.3s' },
  strengthLabel: { fontSize: 12, fontWeight: 600, minWidth: 40 },
  submitBtn: (loading) => ({
    width: '100%', padding: 14, borderRadius: 10, border: 'none',
    backgroundColor: loading ? '#3d3db0' : '#5b5bf0',
    color: '#ffffff', fontSize: 16, fontWeight: 600,
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.15s', marginTop: 4,
  }),
  btnRow: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: 8,
  },
  spinner: {
    display: 'inline-block', width: 14, height: 14,
    borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff', animation: 'spin 0.7s linear infinite',
  },
  footer: { color: '#5a5a7a', textAlign: 'center', marginTop: 22, fontSize: 14 },
  link: { color: '#7b7bf5', textDecoration: 'none', fontWeight: 600 },
}