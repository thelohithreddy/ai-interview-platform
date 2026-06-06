import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useForm } from '../hooks/useForm'
import { useOAuthErrorFromUrl } from '../hooks/useOAuthErrorFromUrl'
import { validators, getPasswordStrength } from '../utils/validators'
import FormField from '../components/ui/FormField'
import AuthLayout, { authStyles as S } from '../components/auth/AuthLayout'
import SocialAuthButtons from '../components/auth/SocialAuthButtons'
import { startOAuthRedirect } from '../utils/socialAuth'

const validatorMap = {
  name: v => validators.name(v),
  email: v => validators.email(v),
  password: v => validators.password(v),
  confirmPassword: (v, a) => validators.confirmPassword(v, a.password),
}

const INITIAL = { name: '', email: '', password: '', confirmPassword: '' }

const STRENGTH_COLORS = { Weak: 'var(--danger)', Fair: 'var(--warning)', Strong: 'var(--success)' }

export default function SignupPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const form = useForm(INITIAL, validatorMap)
  const strength = getPasswordStrength(form.values.password)

  useOAuthErrorFromUrl(setServerError)

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')
    form.touchAll()
    const errs = form.validate()
    if (!form.isValid(errs)) return

    setLoading(true)
    try {
      await new Promise(res => setTimeout(res, 500))
      login({
        name: form.values.name.trim(),
        email: form.values.email.trim().toLowerCase(),
        authProvider: 'email',
      })
      navigate('/dashboard', { replace: true })
    } catch {
      setServerError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleSocialSignup(provider) {
    setServerError('')
    startOAuthRedirect(provider, '/dashboard')
  }

  const strengthColor = STRENGTH_COLORS[strength.label] || 'var(--border-strong)'

  return (
    <AuthLayout title="Create account" subtitle="Start your interview preparation journey">
      {serverError && (
        <div style={S.serverError} role="alert">
          <span style={{ fontWeight: 700 }}>⚠</span> {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <FormField label="Full name" value={form.values.name}
          onChange={v => form.handleChange('name', v)} onBlur={() => form.handleBlur('name')}
          error={form.errors.name} touched={form.touched.name}
          placeholder="Your name" autoComplete="name" />
        <FormField label="Email address" type="email" value={form.values.email}
          onChange={v => form.handleChange('email', v)} onBlur={() => form.handleBlur('email')}
          error={form.errors.email} touched={form.touched.email}
          placeholder="you@example.com" autoComplete="email" />
        <FormField label="Password" type="password" value={form.values.password}
          onChange={v => form.handleChange('password', v)} onBlur={() => form.handleBlur('password')}
          error={form.errors.password} touched={form.touched.password}
          placeholder="Create a strong password" autoComplete="new-password"
          hint="Min 8 chars · uppercase · lowercase · number" />
        {form.values.password && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: -10, marginBottom: 18 }}>
            <div style={{ flex: 1, display: 'flex', gap: 3 }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} style={{
                  flex: 1, height: 4, borderRadius: 2,
                  backgroundColor: i <= strength.score ? strengthColor : 'var(--border)',
                }} />
              ))}
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: strengthColor }}>{strength.label}</span>
          </div>
        )}
        <FormField label="Confirm password" type="password" value={form.values.confirmPassword}
          onChange={v => form.handleChange('confirmPassword', v)} onBlur={() => form.handleBlur('confirmPassword')}
          error={form.errors.confirmPassword} touched={form.touched.confirmPassword}
          placeholder="Repeat your password" autoComplete="new-password" />
        <button type="submit" style={{ ...S.submitBtn, opacity: loading ? 0.8 : 1, marginTop: 4 }} disabled={loading}>
          {loading ? <span style={S.btnRow}><span style={S.spinner} />Creating account…</span> : 'Create account'}
        </button>
      </form>

      <SocialAuthButtons onProviderClick={handleSocialSignup} disabled={loading} />

      <p style={S.footer}>
        Already have an account? <Link to="/login" style={S.link}>Sign in</Link>
      </p>
    </AuthLayout>
  )
}
