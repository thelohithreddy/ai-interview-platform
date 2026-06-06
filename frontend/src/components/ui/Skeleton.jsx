export function SkeletonLine({ width = '100%', height = 16 }) {
  return <div className="skeleton" style={{ width, height, marginBottom: 8 }} />
}

export function SkeletonCard({ height = 120 }) {
  return (
    <div style={{ backgroundColor:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', overflow:'hidden', height }} className="skeleton" />
  )
}

export function SkeletonStats({ count = 4 }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:`repeat(${count},1fr)`, gap:12 }}>
      {Array(count).fill(0).map((_,i) => <SkeletonCard key={i} height={90} />)}
    </div>
  )
}