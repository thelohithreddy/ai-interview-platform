// A countdown/count-up timer for the interview session
// mode = 'up' (count up from 0) | 'down' (countdown from seconds)
// seconds = starting seconds for countdown mode
// onTimeUp = callback when countdown hits 0

import { useState, useEffect, useRef } from 'react'

export default function InterviewTimer({
  mode = 'up',
  seconds = 1800,
  onTimeUp,
}) {
  const [time, setTime] = useState(mode === 'down' ? seconds : 0)
  const [running, setRunning] = useState(true)
  const ref = useRef(null)

  useEffect(() => {
    if (!running) return
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

  // Format seconds into MM:SS
  function format(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  // Warning color when under 5 minutes in countdown mode
  const isWarning = mode === 'down' && time < 300

  return (
    <div style={S.wrap}>
      <span style={S.clockIcon}>⏱</span>
      <span style={{ ...S.time, color: isWarning ? '#ff6b7a' : '#f0f0f8' }}>
        {format(time)}
      </span>
      <button
        style={S.toggleBtn}
        onClick={() => setRunning((v) => !v)}
        title={running ? 'Pause timer' : 'Resume timer'}
      >
        {running ? '⏸' : '▶'}
      </button>
    </div>
  )
}

const S = {
  wrap: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#12122a',
    border: '1px solid #1e1e38',
    borderRadius: 10,
    padding: '7px 14px',
  },
  clockIcon: { fontSize: 15 },
  time: {
    fontSize: 15,
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums', // numbers don't shift width
    letterSpacing: '0.04em',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 13,
    padding: '0 2px',
    color: '#5a5a7a',
    lineHeight: 1,
  },
}