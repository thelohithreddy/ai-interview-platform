import { useState } from 'react'

export function FormField({
  label, type = 'text', value, onChange, onBlur,
  placeholder, error, touched, hint, autoComplete,
}) {
  const [showPw, setShowPw] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPw ? 'text' : 'password') : type
  const showError = touched && error

  return (
    <div style={{ marginBottom: 18 }}>
      <label style={S.label}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          style={{
            ...S.input,
            borderColor: showError ? 'var(--danger)' : 'var(--border-strong)',
            paddingRight: isPassword ? 42 : 13,
          }}
          type={inputType}
          value={value}
          onChange={e => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          spellCheck={false}
        />
        {isPassword && (
          <button
            type="button"
            style={S.eyeBtn}
            onClick={() => setShowPw(v => !v)}
            tabIndex={-1}
            aria-label={showPw ? 'Hide password' : 'Show password'}
          >
            {showPw ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {showError && (
        <p style={S.error} role="alert">
          <span>⚠</span> {error}
        </p>
      )}
      {hint && !showError && <p style={S.hint}>{hint}</p>}
    </div>
  )
}

const S = {
  label: {
    display: 'block',
    color: 'var(--text-secondary)',
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 6,
  },
  input: {
    width: '100%',
    padding: '11px 13px',
    borderRadius: 10,
    border: '1.5px solid var(--border-strong)',
    backgroundColor: 'var(--surface-muted)',
    color: 'var(--text-primary)',
    fontSize: 15,
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: 'inherit',
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    fontSize: 12,
    fontWeight: 600,
  },
  error: {
    color: 'var(--danger-text)',
    fontSize: 12,
    marginTop: 5,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  hint: {
    color: 'var(--text-muted)',
    fontSize: 12,
    marginTop: 5,
  },
}

export default FormField
