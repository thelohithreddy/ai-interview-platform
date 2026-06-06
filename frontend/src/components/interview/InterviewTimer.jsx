import { useState, useEffect, useRef } from 'react'

export default function InterviewTimer({ mode = 'up', seconds = 1800, onTimeUp }) {
  const [time, setTime] = useState(mode === 'down' ? seconds : 0)
  const [running, setRunning] = useState(true)
  const ref = useRef(null)

  useEffect(() => {
    if (!running) return undefined
    ref.current = setInterval(() => {
      setTime((t) => {
        if (mode === 'down') {
          if (t <= 1) {
            clearInterval(ref.current)
            onTimeUp?.()
            return 0
          }
          return t - 1
        }
        return t + 1
      })
    }, 1000)
    return () => clearInterval(ref.current)
  }, [running, mode, onTimeUp])

  function format(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  const isWarning = mode === 'down' && time < 300

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      backgroundColor: 'var(--surface-muted)',
      border: '1px solid var(--border)',
      borderRadius: 10, padding: '7px 14px',
    }}>
      <span style={{ fontSize: 14 }} aria-hidden="true">⏱</span>
      <span style={{
        fontSize: 14, fontWeight: 600,
        fontVariantNumeric: 'tabular-nums',
        color: isWarning ? 'var(--danger-text)' : 'var(--text-primary)',
      }}>
        {format(time)}
      </span>
      <button
        type="button"
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 12, color: 'var(--text-muted)', padding: '0 2px',
        }}
        onClick={() => setRunning(v => !v)}
        title={running ? 'Pause timer' : 'Resume timer'}
      >
        {running ? 'Pause' : 'Resume'}
      </button>
    </div>
  )
}

export function useElapsedSeconds(running = true) {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    if (!running) return undefined
    const id = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [running])
  return seconds
}
