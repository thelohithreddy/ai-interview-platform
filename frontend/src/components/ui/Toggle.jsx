export default function Toggle({ value, onChange, label, desc }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', gap: 20, padding: '14px 0',
    }}>
      {(label || desc) && (
        <div style={{ flex: 1 }}>
          {label && (
            <p style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 500, margin: '0 0 2px' }}>
              {label}
            </p>
          )}
          {desc && (
            <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0, lineHeight: 1.4 }}>
              {desc}
            </p>
          )}
        </div>
      )}
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        style={{
          width: 42, height: 24, borderRadius: 100,
          border: 'none', cursor: 'pointer', flexShrink: 0,
          backgroundColor: value ? 'var(--primary)' : 'var(--border-strong)',
          position: 'relative', padding: 0,
          transition: 'background-color 0.2s',
        }}
      >
        <span style={{
          position: 'absolute', top: 2,
          width: 20, height: 20, borderRadius: '50%',
          backgroundColor: '#fff',
          transition: 'transform 0.2s', pointerEvents: 'none',
          transform: value ? 'translateX(20px)' : 'translateX(2px)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </button>
    </div>
  )
}