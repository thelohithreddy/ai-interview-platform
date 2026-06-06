export default function ProgressBar({ value, color, label, showPct = true }) {
  return (
    <div>
      {(label || showPct) && (
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
          {label && <span style={{ color:'var(--text-secondary)', fontSize:13 }}>{label}</span>}
          {showPct && <span style={{ color:'var(--text-muted)', fontSize:13 }}>{value}%</span>}
        </div>
      )}
      <div style={{ height:6, backgroundColor:'var(--border)', borderRadius:3, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${Math.min(100, value)}%`, backgroundColor: color || 'var(--primary)', borderRadius:3, transition:'width 0.6s ease' }} />
      </div>
    </div>
  )
}