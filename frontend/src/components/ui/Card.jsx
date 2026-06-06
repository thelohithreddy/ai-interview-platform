export default function Card({ children, style: extra, padding = true, hover, className = '' }) {
  return (
    <div
      className={[hover ? 'card-hover' : '', className].filter(Boolean).join(' ')}
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        padding: padding ? 'var(--sp-lg, 24px)' : 0,
        ...extra,
      }}
    >
      {children}
    </div>
  )
}
