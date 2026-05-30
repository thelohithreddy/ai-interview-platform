import { useMemo } from 'react'
import { generateHeatmapData } from '../../utils/analytics'

const CELL_SIZE = 12
const CELL_GAP  = 3
const COLORS    = ['#E2E8F0', '#BBF7D0', '#4ADE80', '#16A34A', '#166534']

function getLevel(count) {
  if (count === 0) return 0
  if (count === 1) return 1
  if (count <= 3)  return 2
  if (count <= 6)  return 3
  return 4
}

function getMonthLabels(cells) {
  // Returns array of { label, weekIndex } — one per month transition
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

export default function Heatmap({ activityLog = [] }) {
  const cells       = useMemo(() => generateHeatmapData(activityLog), [activityLog])
  const monthLabels = useMemo(() => getMonthLabels(cells), [cells])

  const totalWeeks = Math.ceil(cells.length / 7)
  const gridWidth  = totalWeeks * (CELL_SIZE + CELL_GAP)

  return (
    <div>
      {/* Scrollable wrapper for mobile */}
      <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
        <div style={{ width: gridWidth + 32, minWidth: 'fit-content' }}>

          {/* Month labels row */}
          <div style={{ position: 'relative', height: 20, marginBottom: 4 }}>
            {monthLabels.map((m, i) => {
              const leftPx = m.weekIndex * (CELL_SIZE + CELL_GAP)
              return (
                <span key={i} style={{
                  position: 'absolute',
                  left: leftPx,
                  top: 0,
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                  userSelect: 'none',
                }}>
                  {m.label}
                </span>
              )
            })}
          </div>

          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateRows: `repeat(7, ${CELL_SIZE}px)`,
            gridTemplateColumns: `repeat(${totalWeeks}, ${CELL_SIZE}px)`,
            gap: CELL_GAP,
            gridAutoFlow: 'column',
          }}>
            {cells.map((cell, i) => {
              const level   = getLevel(cell.count)
              const dateStr = cell.date.toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric',
              })
              const tooltipText = cell.count === 0
                ? `${dateStr}: no activity`
                : `${dateStr}: ${cell.count} activit${cell.count === 1 ? 'y' : 'ies'}`

              return (
                <div
                  key={i}
                  title={tooltipText}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    borderRadius: 3,
                    backgroundColor: COLORS[level],
                    cursor: cell.count > 0 ? 'pointer' : 'default',
                    transition: 'opacity 0.1s',
                    flexShrink: 0,
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 5,
        marginTop: 10, justifyContent: 'flex-end',
      }}>
        <span style={{ color: 'var(--text-faint)', fontSize: 11 }}>Less</span>
        {COLORS.map((c, i) => (
          <div key={i} style={{
            width: 11, height: 11, borderRadius: 2,
            backgroundColor: c,
          }} />
        ))}
        <span style={{ color: 'var(--text-faint)', fontSize: 11 }}>More</span>
      </div>
    </div>
  )
}