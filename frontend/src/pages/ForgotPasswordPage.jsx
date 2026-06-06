import { Link } from 'react-router-dom'
import AuthLayout, { authStyles as S } from '../components/auth/AuthLayout'

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title="Reset password" subtitle="We'll send you a reset link when email is configured">
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
        Password reset via email is not yet connected to the backend. Contact support or create a new account if needed.
      </p>
      <Link to="/login" style={{ ...S.link, display: 'block', textAlign: 'center' }}>
        ← Back to sign in
      </Link>
    </AuthLayout>
  )
}
