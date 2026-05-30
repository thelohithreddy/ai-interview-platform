import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div style={S.page}>
      <h1 style={S.code}>404</h1>
      <h2 style={S.title}>Page not found</h2>
      <p style={S.desc}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div style={S.btns}>
        <button style={S.primaryBtn} onClick={() => navigate('/')}>
          Go home
        </button>
        <button style={S.ghostBtn} onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    </div>
  )
}

const S = {
  page: {
    minHeight: 'calc(100vh - 64px)',
    backgroundColor: '#0d0d1f',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '40px 20px',
  },
  code: {
    fontSize: 'clamp(80px, 15vw, 140px)',
    fontWeight: 800,
    color: '#1e1e40',
    margin: '0 0 8px',
    letterSpacing: '-0.04em',
    lineHeight: 1,
  },
  title: {
    color: '#f0f0f8',
    fontSize: 'clamp(20px, 4vw, 28px)',
    fontWeight: 700,
    margin: '0 0 12px',
  },
  desc: {
    color: '#5a5a7a',
    fontSize: 16,
    maxWidth: 380,
    lineHeight: 1.6,
    marginBottom: 32,
  },
  btns: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  primaryBtn: {
    backgroundColor: '#5b5bf0',
    color: '#fff',
    border: 'none',
    padding: '12px 28px',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
  },
  ghostBtn: {
    backgroundColor: 'transparent',
    color: '#c0c0e8',
    border: '1px solid #252545',
    padding: '12px 28px',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
  },
}