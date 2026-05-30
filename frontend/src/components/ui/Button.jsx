export default function Button({
  children, variant = 'primary', size = 'md',
  disabled, onClick, type = 'button', style: extra,
  loading,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...BASE,
        ...SIZES[size],
        ...VARIANTS[variant],
        opacity: (disabled || loading) ? 0.55 : 1,
        cursor:  (disabled || loading) ? 'not-allowed' : 'pointer',
        ...extra,
      }}
    >
      {loading && <span style={S.spinner} />}
      {children}
    </button>
  )
}

const BASE = {
  display: 'inline-flex', alignItems: 'center',
  justifyContent: 'center', gap: 6,
  fontFamily: 'inherit', fontWeight: 600,
  border: 'none', transition: 'all 0.15s',
  borderRadius: 'var(--radius-sm)',
  lineHeight: 1,
}

const SIZES = {
  xs: { padding: '5px 10px',  fontSize: 12 },
  sm: { padding: '7px 14px',  fontSize: 13 },
  md: { padding: '9px 18px',  fontSize: 14 },
  lg: { padding: '12px 24px', fontSize: 15 },
}

const VARIANTS = {
  primary: {
    backgroundColor: 'var(--primary)',
    color: '#fff',
    border: '1px solid var(--primary)',
  },
  secondary: {
    backgroundColor: 'var(--surface)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-strong)',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border)',
  },
  danger: {
    backgroundColor: 'var(--danger-bg)',
    color: 'var(--danger-text)',
    border: '1px solid var(--danger-border)',
  },
  link: {
    backgroundColor: 'transparent',
    color: 'var(--primary)',
    border: 'none',
    padding: 0,
    fontWeight: 500,
  },
}

const S = {
  spinner: {
    display: 'inline-block',
    width: 13, height: 13,
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    animation: 'spin 0.7s linear infinite',
  },
}