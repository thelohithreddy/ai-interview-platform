export default function ErrorMessage({ message = 'Something went wrong.', onRetry }) {
  return (
    <div style={{
      backgroundColor: 'var(--danger-bg)',
      border: '1px solid var(--danger-border)',
      borderRadius: 'var(--radius-sm)',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      flexWrap: 'wrap',
    }}>
      <p style={{ color: 'var(--danger-text)', fontSize: 14, margin: 0 }}>{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--danger-border)',
            color: 'var(--danger-text)',
            padding: '6px 14px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      )}
    </div>
  )
}
