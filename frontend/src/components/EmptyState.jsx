// Shown when a list or section has no data yet
// icon  = emoji or symbol
// title = main message
// desc  = helper text
// action = optional { label, onClick } for a CTA button

export default function EmptyState({ icon = '📭', title, desc, action }) {
  return (
    <div style={S.wrap}>
      <span style={S.icon}>{icon}</span>
      {title && <p style={S.title}>{title}</p>}
      {desc  && <p style={S.desc}>{desc}</p>}
      {action && (
        <button style={S.btn} onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  )
}

const S = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '48px 24px',
    gap: 8,
  },
  icon:  { fontSize: 44, marginBottom: 6 },
  title: { color: '#f0f0f8', fontSize: 17, fontWeight: 600, margin: 0 },
  desc:  {
    color: '#5a5a7a', fontSize: 14, lineHeight: 1.6,
    maxWidth: 300, margin: '4px 0 12px',
  },
  btn: {
    backgroundColor: 'transparent',
    color: '#7b7bf5',
    border: '1px solid #2e2e6a',
    padding: '10px 20px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 4,
  },
}