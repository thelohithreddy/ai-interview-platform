const VARIANTS = {
  default: { bg: 'var(--surface-muted)', color: 'var(--text-secondary)', border: 'var(--border)' },
  brand:   { bg: 'var(--primary-light)', color: 'var(--primary-text)',   border: 'var(--primary-light)' },
  success: { bg: 'var(--success-bg)',    color: 'var(--success-text)',   border: 'var(--success-border)' },
  warning: { bg: 'var(--warning-bg)',    color: 'var(--warning-text)',   border: 'var(--warning-border)' },
  danger:  { bg: 'var(--danger-bg)',     color: 'var(--danger-text)',    border: 'var(--danger-border)' },
  info:    { bg: 'var(--info-bg)',       color: 'var(--info-text)',      border: 'var(--info-border)' },
}

export default function Badge({ children, variant = 'default', style: extra }) {
  const v = VARIANTS[variant] || VARIANTS.default
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 10px', borderRadius: 100,
      fontSize: 12, fontWeight: 600,
      backgroundColor: v.bg, color: v.color,
      border: `1px solid ${v.border}`,
      whiteSpace: 'nowrap',
      ...extra,
    }}>
      {children}
    </span>
  )
}