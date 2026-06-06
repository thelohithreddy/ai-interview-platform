import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/ui/Loader'

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()
  const [message, setMessage] = useState('Completing sign-in…')

  useEffect(() => {
    const provider = searchParams.get('provider')
    const email = searchParams.get('email')
    const name = searchParams.get('name')
    const returnTo = searchParams.get('returnTo') || '/dashboard'
    const error = searchParams.get('error')

    if (error) {
      navigate(`/login?oauth_error=${encodeURIComponent(error)}`, { replace: true })
      return
    }

    if (!provider || !email || !name) {
      navigate('/login?oauth_error=invalid_callback', { replace: true })
      return
    }

    setMessage(`Signed in with ${provider}. Redirecting…`)
    login({
      name,
      email: email.trim().toLowerCase(),
      authProvider: provider,
    })

    const path = returnTo.startsWith('/') ? returnTo : '/dashboard'
    navigate(path, { replace: true })
  }, [searchParams, login, navigate])

  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--app-bg)',
    }}>
      <Loader text={message} />
    </div>
  )
}
