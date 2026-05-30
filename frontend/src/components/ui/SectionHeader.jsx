export default function SectionHeader({ title, desc, action }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'flex-start', marginBottom: 20, gap: 16,
    }}>
      <div>
        <h3 style={{
          color: 'var(--text-primary)', fontSize: 15,
          fontWeight: 600, margin: '0 0 3px',
        }}>
          {title}
        </h3>
        {desc && (
          <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>
            {desc}
          </p>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          style={{
            background: 'none', border: 'none',
            color: 'var(--primary)', fontSize: 13,
            fontWeight: 600, cursor: 'pointer',
            whiteSpace: 'nowrap', flexShrink: 0, padding: 0,
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}