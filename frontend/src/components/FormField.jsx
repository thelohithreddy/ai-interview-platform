import { useState } from 'react'

const S = {
  wrapper: { marginBottom: 18 },
  label: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#8b8fa8',
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 6,
    letterSpacing: '0.02em',
  },
  inputWrap: { position: 'relative' },
  input: (hasError, hasPadRight) => ({
    width: '100%',
    padding: hasPadRight ? '11px 42px 11px 14px' : '11px 14px',
    borderRadius: 10,
    border: `1.5px solid ${hasError ? '#e74c3c' : '#252540'}`,
    backgroundColor: '#0d0d1f',
    color: '#f0f0f8',
    fontSize: 15,
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.15s',
    fontFamily: 'inherit',
  }),
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    color: '#5a5a7a',
    fontSize: 16,
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
  },
  error: {
    color: '#ff6b7a',
    fontSize: 12,
    marginTop: 5,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  hint: {
    color: '#5a5a7a',
    fontSize: 12,
    marginTop: 5,
  },
}

export function FormField({
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
  hint,
  autoComplete,
}) {
  const [showPw, setShowPw] = useState(false)
  const isPassword = type === 'password'
  const inputType  = isPassword ? (showPw ? 'text' : 'password') : type
  const showError  = touched && error

  return (
    <div style={S.wrapper}>
      <label style={S.label}>
        <span>{label}</span>
      </label>
      <div style={S.inputWrap}>
        <input
          style={S.input(showError, isPassword)}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          spellCheck={false}
          onFocus={(e) => {
            e.target.style.borderColor = showError ? '#e74c3c' : '#5b5bf0'
          }}
          onBlurCapture={(e) => {
            e.target.style.borderColor = showError ? '#e74c3c' : '#252540'
          }}
        />
        {isPassword && (
          <button
            type="button"
            style={S.eyeBtn}
            onClick={() => setShowPw((v) => !v)}
            tabIndex={-1}
            aria-label={showPw ? 'Hide password' : 'Show password'}
          >
            {showPw ? '🙈' : '👁️'}
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