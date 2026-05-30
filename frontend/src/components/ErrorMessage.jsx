// Shows a red error box with a retry button
// onRetry is optional — pass a function if you want a retry button

export default function ErrorMessage({ message = 'Something went wrong.', onRetry }) {
  return (
    <div style={S.box} role="alert">
      <span style={S.icon}>⚠</span>
      <div style={S.content}>
        <p style={S.msg}>{message}</p>
        {onRetry && (
          <button style={S.retryBtn} onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    </div>
  )
}

const S = {
  box: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#2a0d14',
    border: '1px solid #5a1a24',
    borderRadius: 10,
    padding: '14px 16px',
  },
  icon: { fontSize: 18, flexShrink: 0 },
  content: { flex: 1 },
  msg: {
    color: '#ff8a95',
    fontSize: 14,
    margin: '0 0 8px',
    lineHeight: 1.5,
  },
  retryBtn: {
    backgroundColor: 'transparent',
    color: '#ff8a95',
    border: '1px solid #5a1a24',
    padding: '6px 14px',
    borderRadius: 8,
    fontSize: 13,
    cursor: 'pointer',
    fontWeight: 500,
  },
}