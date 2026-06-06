import { useMemo } from 'react'
import { generateHeatmapData } from '../../utils/analytics'

const COLORS = ['#E2E8F0', '#BBF7D0', '#4ADE80', '#16A34A', '#166534']
const CELL_GAP = 3

function getLevel(count) {
  if (count === 0) return 0
  if (count === 1) return 1
  if (count <= 3) return 2
  if (count <= 6) return 3
  return 4
}

function getMonthLabels(cells) {
  const labels = []
  let lastMonth = -1
  cells.forEach((cell, i) => {
    const weekIndex = Math.floor(i / 7)
    const month = cell.date.getMonth()
    if (month !== lastMonth) {
      labels.push({
        label: cell.date.toLocaleString('default', { month: 'short' }),
        weekIndex,
      })
      lastMonth = month
    }
  })
  return labels
}

export default function Heatmap({ activityLog = [], emptyMessage }) {
  const cells = useMemo(() => generateHeatmapData(activityLog), [activityLog])
  const monthLabels = useMemo(() => getMonthLabels(cells), [cells])
  const hasActivity = activityLog?.length > 0

  const totalWeeks = Math.ceil(cells.length / 7)

  return (
    <div style={{ width: '100%' }}>
      {!hasActivity && emptyMessage && (
        <p style={{
          color: 'var(--text-muted)',
          fontSize: 13,
          margin: '0 0 12px',
          lineHeight: 1.5,
        }}>
          {emptyMessage}
        </p>
      )}

      <div style={{ width: '100%', minWidth: 0 }}>
        <div style={{ position: 'relative', height: 18, marginBottom: 6, width: '100%' }}>
          {monthLabels.map((m, i) => (
            <span
              key={`${m.label}-${m.weekIndex}-${i}`}
              style={{
                position: 'absolute',
                left: `${(m.weekIndex / totalWeeks) * 100}%`,
                top: 0,
                fontSize: 11,
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
                userSelect: 'none',
                transform: 'translateX(-2px)',
              }}
            >
              {m.label}
            </span>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateRows: 'repeat(7, 1fr)',
            gridTemplateColumns: `repeat(${totalWeeks}, minmax(0, 1fr))`,
            gap: CELL_GAP,
            gridAutoFlow: 'column',
            width: '100%',
          }}
          role="img"
          aria-label="Practice activity heatmap for the last 52 weeks"
        >
          {cells.map((cell) => {
            const level = getLevel(cell.count)
            const dateStr = cell.date.toLocaleDateString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric',
            })
            const tooltipText = cell.count === 0
              ? `${dateStr}: no activity`
              : `${dateStr}: ${cell.count} activit${cell.count === 1 ? 'y' : 'ies'}`

            return (
              <div
                key={cell.date.toISOString()}
                title={tooltipText}
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: 3,
                  backgroundColor: COLORS[level],
                  cursor: cell.count > 0 ? 'pointer' : 'default',
                }}
              />
            )
          })}
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        marginTop: 12,
        justifyContent: 'flex-end',
      }}>
        <span style={{ color: 'var(--text-faint)', fontSize: 11 }}>Less</span>
        {COLORS.map(c => (
          <div
            key={c}
            style={{ width: 11, height: 11, borderRadius: 2, backgroundColor: c }}
            aria-hidden="true"
          />
        ))}
        <span style={{ color: 'var(--text-faint)', fontSize: 11 }}>More</span>
      </div>
    </div>
  )
}
