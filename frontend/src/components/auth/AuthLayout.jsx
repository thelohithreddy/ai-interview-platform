export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      backgroundColor: 'var(--app-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 440,
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 18,
        padding: 'clamp(28px, 5vw, 40px)',
        boxSizing: 'border-box',
        boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            backgroundColor: 'var(--primary)',
            color: '#fff', fontSize: 20, fontWeight: 800,
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 16px',
          }}>
            A
          </div>
          <h1 style={{
            color: 'var(--text-primary)',
            fontSize: 24, fontWeight: 700,
            margin: '0 0 6px', letterSpacing: '-0.02em',
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}

export const authStyles = {
  serverError: {
    display: 'flex', alignItems: 'center', gap: 8,
    backgroundColor: 'var(--danger-bg)',
    border: '1px solid var(--danger-border)',
    color: 'var(--danger-text)',
    padding: '12px 14px', borderRadius: 10,
    fontSize: 14, marginBottom: 20,
  },
  submitBtn: {
    width: '100%', padding: 13, borderRadius: 10, border: 'none',
    backgroundColor: 'var(--primary)', color: '#fff',
    fontSize: 15, fontWeight: 600,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background-color 0.15s',
  },
  btnRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  spinner: {
    display: 'inline-block', width: 14, height: 14,
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    animation: 'spin 0.7s linear infinite',
  },
  socialBtn: {
    width: '100%',
    padding: '11px 16px',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    transition: 'opacity 0.15s, background-color 0.15s',
  },
  socialBtnInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  socialSpinner: {
    display: 'inline-block',
    width: 16,
    height: 16,
    borderRadius: '50%',
    border: '2px solid var(--border)',
    borderTopColor: 'var(--primary)',
    animation: 'spin 0.7s linear infinite',
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0 18px',
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'var(--border)' },
  dividerText: { color: 'var(--text-muted)', fontSize: 12, whiteSpace: 'nowrap' },
  footer: { color: 'var(--text-muted)', textAlign: 'center', marginTop: 22, fontSize: 14 },
  link: { color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' },
  forgotLink: { color: 'var(--primary)', fontSize: 13, fontWeight: 500, textDecoration: 'none' },
}
