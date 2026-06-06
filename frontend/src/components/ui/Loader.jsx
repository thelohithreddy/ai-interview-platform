export default function Loader({ size = 'md', text = '' }) {
  const sizes = { sm: 24, md: 32, lg: 48 }
  const px = sizes[size] || sizes.md

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: px, height: px, borderRadius: '50%',
        border: '3px solid var(--border)',
        borderTopColor: 'var(--primary)',
        animation: 'spin 0.8s linear infinite',
      }} />
      {text && (
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>{text}</p>
      )}
    </div>
  )
}
