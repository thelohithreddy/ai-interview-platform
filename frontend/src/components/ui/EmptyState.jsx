import Button from './Button'

export default function EmptyState({ icon, title, desc, action, compact }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      textAlign: 'center',
      padding: compact ? '28px 20px' : '56px 24px',
      gap: 12,
    }}>
      {icon && (
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          backgroundColor: 'var(--surface-muted)',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, marginBottom: 4,
          flexShrink: 0,
        }}>
          {icon}
        </div>
      )}
      <p style={{
        color: 'var(--text-primary)', fontSize: 16,
        fontWeight: 600, margin: 0,
      }}>
        {title}
      </p>
      {desc && (
        <p style={{
          color: 'var(--text-muted)', fontSize: 14,
          maxWidth: 340, lineHeight: 1.6, margin: 0,
        }}>
          {desc}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} style={{ marginTop: 8 }}>
          {action.label}
        </Button>
      )}
    </div>
  )
}