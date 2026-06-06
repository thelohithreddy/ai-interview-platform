export default function ChipGroup({ options, value, onChange, capitalize }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(o => {
        const active = value === o || value === String(o)
        return (
          <button
            key={o}
            type="button"
            className="chip-btn"
            onClick={() => onChange(o)}
            style={{
              padding: '7px 16px',
              borderRadius: 8,
              border: '1px solid',
              fontSize: 13,
              cursor: 'pointer',
              fontWeight: 500,
              backgroundColor: active ? 'var(--primary-light)' : 'transparent',
              color: active ? 'var(--primary-text)' : 'var(--text-secondary)',
              borderColor: active ? 'var(--primary)' : 'var(--border-strong)',
              transition: 'all 0.15s',
              textTransform: capitalize ? 'capitalize' : 'none',
            }}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}
