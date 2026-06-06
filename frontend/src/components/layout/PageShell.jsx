export default function PageShell({ children, title, subtitle, action, maxWidth = 1200 }) {
  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      backgroundColor: 'var(--app-bg)',
      padding: 'var(--sp-xl, 32px) 20px',
    }} className="page-enter">
      <div style={{ maxWidth, margin: '0 auto' }}>
        {(title || action) && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 16,
            marginBottom: 24,
          }}>
            <div>
              {title && (
                <h1 style={{
                  color: 'var(--text-primary)',
                  fontSize: 'clamp(20px, 4vw, 26px)',
                  fontWeight: 800,
                  margin: '0 0 4px',
                  letterSpacing: '-0.02em',
                }}>
                  {title}
                </h1>
              )}
              {subtitle && (
                <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>{subtitle}</p>
              )}
            </div>
            {action}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
