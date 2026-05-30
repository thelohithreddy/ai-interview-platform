// A single stat display card
// Used in Dashboard, Profile, Results pages
// number = the big number to show
// label  = the description below
// icon   = emoji
// accent = optional color for the number (defaults to purple)

export default function StatCard({ number, label, icon, accent = '#5b5bf0' }) {
  return (
    <div style={S.card}>
      {icon && <span style={S.icon}>{icon}</span>}
      <h3 style={{ ...S.number, color: accent }}>{number}</h3>
      <p style={S.label}>{label}</p>
    </div>
  )
}

const S = {
  card: {
    backgroundColor: '#12122a',
    border: '1px solid #1e1e38',
    borderRadius: 12,
    padding: '20px 16px',
    textAlign: 'center',
  },
  icon: {
    fontSize: 24,
    display: 'block',
    marginBottom: 8,
  },
  number: {
    fontSize: 'clamp(26px, 4vw, 36px)',
    fontWeight: 700,
    margin: '0 0 4px',
    letterSpacing: '-0.02em',
  },
  label: {
    color: '#5a5a7a',
    fontSize: 13,
    margin: 0,
  },
}