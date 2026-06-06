export default function Toggle({ value, onChange, label, desc, disabled = false }) {
  const on = Boolean(value)

  function handleToggle() {
    if (disabled) return
    onChange(!on)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label || undefined}
      disabled={disabled}
      onClick={handleToggle}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20,
        width: '100%',
        padding: '14px 0',
        margin: 0,
        border: 'none',
        background: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        textAlign: 'left',
        fontFamily: 'inherit',
      }}
    >
      {(label || desc) && (
        <span style={{ flex: 1, minWidth: 0 }}>
          {label && (
            <span style={{
              display: 'block',
              color: 'var(--text-primary)',
              fontSize: 14,
              fontWeight: 500,
              marginBottom: desc ? 2 : 0,
            }}>
              {label}
            </span>
          )}
          {desc && (
            <span style={{
              display: 'block',
              color: 'var(--text-muted)',
              fontSize: 13,
              lineHeight: 1.4,
            }}>
              {desc}
            </span>
          )}
        </span>
      )}

      <span
        aria-hidden="true"
        style={{
          width: 42,
          height: 24,
          borderRadius: 100,
          flexShrink: 0,
          backgroundColor: on ? 'var(--primary)' : 'var(--border-strong)',
          position: 'relative',
          transition: 'background-color 0.2s',
        }}
      >
        <span style={{
          position: 'absolute',
          top: 2,
          left: on ? 'calc(100% - 22px)' : 2,
          width: 20,
          height: 20,
          borderRadius: '50%',
          backgroundColor: '#fff',
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </span>
    </button>
  )
}
