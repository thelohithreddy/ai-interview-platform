export default function StatCard({ label, value, sub, icon }) {
  return (
    <div style={{
      backgroundColor: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-xs)',
      padding: '20px 16px',
      textAlign: 'center',
    }}>
      {icon && (
        <div style={{ fontSize: 20, marginBottom: 8, lineHeight: 1 }}>{icon}</div>
      )}
      <p style={{
        color: 'var(--text-primary)',
        fontSize: 'clamp(20px, 2.5vw, 26px)',
        fontWeight: 700, margin: '0 0 5px',
        letterSpacing: '-0.02em',
      }}>
        {value ?? '—'}
      </p>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500, margin: 0 }}>
        {label}
      </p>
      {sub && (
        <p style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 3, margin: '3px 0 0' }}>
          {sub}
        </p>
      )}
    </div>
  )
}