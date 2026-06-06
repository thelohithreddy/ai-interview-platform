import { useEffect, useRef } from 'react'

export default function Modal({ open, onClose, title, children, danger }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    function handler(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    dialogRef.current?.focus()
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      style={S.overlay}
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={S.modal}
        onClick={e => e.stopPropagation()}
      >
        <div style={S.header}>
          <h3
            id="modal-title"
            style={{
              ...S.title,
              color: danger ? 'var(--danger-text)' : 'var(--text-primary)',
            }}
          >
            {title}
          </h3>
          <button type="button" style={S.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

const S = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 9999,
    backgroundColor: 'rgba(15,23,42,0.5)',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: 20,
    backdropFilter: 'blur(4px)',
    animation: 'fadeIn 0.15s ease-out',
  },
  modal: {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '28px 28px 24px',
    width: '100%', maxWidth: 440,
    boxShadow: 'var(--shadow-lg)',
    outline: 'none',
  },
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: 700, margin: 0 },
  closeBtn: {
    background: 'none', border: 'none',
    color: 'var(--text-muted)', fontSize: 16,
    cursor: 'pointer', padding: '4px 8px',
    borderRadius: 6, lineHeight: 1,
  },
}
