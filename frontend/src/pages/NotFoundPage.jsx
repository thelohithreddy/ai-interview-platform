import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div style={S.page}>
      <p style={S.code}>404</p>
      <h1 style={S.title}>Page not found</h1>
      <p style={S.desc}>
        The page you are looking for does not exist or has been moved.
      </p>
      <div style={S.btns}>
        <button type="button" style={S.primaryBtn} onClick={() => navigate('/')}>
          Go home
        </button>
        <button type="button" style={S.ghostBtn} onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    </div>
  )
}

const S = {
  page: {
    minHeight: 'calc(100vh - 60px)',
    backgroundColor: 'var(--app-bg)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    textAlign: 'center', padding: '40px 20px',
  },
  code: {
    fontSize: 'clamp(80px, 15vw, 120px)',
    fontWeight: 800, color: 'var(--border)',
    margin: '0 0 8px', letterSpacing: '-0.04em', lineHeight: 1,
  },
  title: {
    color: 'var(--text-primary)',
    fontSize: 'clamp(20px, 4vw, 26px)',
    fontWeight: 700, margin: '0 0 12px',
  },
  desc: {
    color: 'var(--text-muted)', fontSize: 16,
    maxWidth: 380, lineHeight: 1.6, marginBottom: 32,
  },
  btns: { display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' },
  primaryBtn: {
    backgroundColor: 'var(--primary)', color: '#fff',
    border: '1px solid var(--primary)',
    padding: '11px 28px', borderRadius: 10,
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
  ghostBtn: {
    backgroundColor: 'var(--surface)', color: 'var(--text-secondary)',
    border: '1px solid var(--border-strong)',
    padding: '11px 28px', borderRadius: 10,
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
}