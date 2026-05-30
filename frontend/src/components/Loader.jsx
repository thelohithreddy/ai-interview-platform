// CONCEPT: Reusable component
// Instead of writing a spinner in every page, we build it ONCE here
// and import it wherever needed. This is DRY (Don't Repeat Yourself)

// size = 'sm' | 'md' | 'lg'
// text = optional loading message shown below spinner

export default function Loader({ size = 'md', text = '' }) {
  const sizes = { sm: 24, md: 36, lg: 52 }
  const px = sizes[size] ?? 36
  const border = px <= 24 ? 2 : 3

  return (
    <div style={S.wrap}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <div style={{
        width: px,
        height: px,
        borderRadius: '50%',
        border: `${border}px solid #252540`,
        borderTopColor: '#5b5bf0',
        animation: 'spin 0.7s linear infinite',
      }} />
      {text && <p style={S.text}>{text}</p>}
    </div>
  )
}

const S = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    padding: '40px 20px',
  },
  text: {
    color: '#5a5a7a',
    fontSize: 14,
    margin: 0,
  },
}