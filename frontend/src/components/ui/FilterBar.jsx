export default function FilterBar({ label, options, value, onChange, disabled }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: disabled ? 0.5 : 1 }}>
      <span style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
        {label}:
      </span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {options.map(o => (
          <button
            key={o}
            type="button"
            disabled={disabled}
            onClick={() => onChange(o)}
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              border: '1px solid',
              fontSize: 12,
              cursor: disabled ? 'not-allowed' : 'pointer',
              fontWeight: 500,
              backgroundColor: value === o ? 'var(--brand-light)' : 'transparent',
              color: value === o ? 'var(--brand-text)' : 'var(--text-muted)',
              borderColor: value === o ? 'var(--primary)' : 'var(--border)',
            }}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}
