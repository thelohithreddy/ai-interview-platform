import { authStyles as S } from './AuthLayout'

const PROVIDERS = [
  {
    id: 'google',
    label: 'Continue with Google',
    style: 'google',
    Icon: GoogleIcon,
  },
  {
    id: 'apple',
    label: 'Continue with Apple',
    style: 'apple',
    Icon: AppleIcon,
  },
  {
    id: 'github',
    label: 'Continue with GitHub',
    style: 'github',
    Icon: GitHubIcon,
  },
]

const buttonStyles = {
  google: {
    backgroundColor: 'var(--surface)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border)',
  },
  apple: {
    backgroundColor: 'var(--text-primary)',
    color: 'var(--surface)',
    border: '1px solid var(--text-primary)',
  },
  github: {
    backgroundColor: 'var(--surface-muted)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border)',
  },
}

export default function SocialAuthButtons({ onProviderClick, disabled = false }) {
  return (
    <div style={{ marginTop: 8 }}>
      <div style={S.divider} role="separator">
        <div style={S.dividerLine} />
        <span style={S.dividerText}>or continue with</span>
        <div style={S.dividerLine} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {PROVIDERS.map(({ id, label, style, Icon }) => (
          <button
            key={id}
            type="button"
            disabled={disabled}
            onClick={() => onProviderClick(id)}
            style={{
              ...S.socialBtn,
              ...buttonStyles[style],
              opacity: disabled ? 0.55 : 1,
            }}
            aria-label={label}
          >
            <span style={S.socialBtnInner}>
              <Icon />
              <span>{label}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05 1.88-3.51 1.9-1.46.02-1.93-.86-3.6-.86-1.67 0-2.19.84-3.57.88-1.38.04-2.43-1.41-3.41-2.35C2.45 17.25 1.04 12.45 3.1 8.67c1.03-1.84 2.87-3 4.87-3.03 1.52-.03 2.95 1.02 3.6 1.02.65 0 2.87-1.26 4.84-1.08.82.03 3.13.33 4.6 2.49-3.97 2.17-3.33 7.81.66 9.29-.8 2.07-1.88 4.12-3.62 5.92zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}
