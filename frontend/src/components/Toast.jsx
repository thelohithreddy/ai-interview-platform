import { useState, useEffect } from 'react'

let _addToast = null
export function showToast(msg, type = 'success') {
  _addToast?.(msg, type)
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    _addToast = (msg, type) => {
      const id = Date.now()
      setToasts(p => [...p, { id, msg, type }])
      setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500)
    }
    return () => { _addToast = null }
  }, [])

  const STYLES = {
    success: { bg: 'var(--success-bg)', border: 'var(--success-border)', color: 'var(--success-text)', icon: '✓' },
    error:   { bg: 'var(--danger-bg)',  border: 'var(--danger-border)',  color: 'var(--danger-text)',  icon: '⚠' },
    info:    { bg: 'var(--info-bg)',    border: 'var(--info-border)',    color: 'var(--info-text)',    icon: 'ℹ' },
  }

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24,
      zIndex: 99999, display: 'flex',
      flexDirection: 'column', gap: 10,
    }}>
      {toasts.map(t => {
        const s = STYLES[t.type] || STYLES.info
        return (
          <div key={t.id} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px', borderRadius: 10,
            border: `1px solid ${s.border}`,
            backgroundColor: s.bg, color: s.color,
            fontSize: 14, fontWeight: 500,
            minWidth: 240, maxWidth: 360,
            boxShadow: 'var(--shadow-md)',
            animation: 'fadeIn 0.2s ease-out',
          }}>
            <span style={{ fontWeight: 700, flexShrink: 0 }}>{s.icon}</span>
            {t.msg}
          </div>
        )
      })}
    </div>
  )
}