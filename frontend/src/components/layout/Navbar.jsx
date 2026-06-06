import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { getInitials } from '../../hooks/useInitials'
import Toggle from '../ui/Toggle'

const AUTH_LINKS = [{ to: '/', label: 'Home' }]

const USER_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/interview', label: 'Interview' },
  { to: '/resume', label: 'Resume' },
  { to: '/history', label: 'History' },
  { to: '/saved', label: 'Saved' },
  { to: '/profile', label: 'Profile' },
  { to: '/settings', label: 'Settings' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const { settings, update } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const navRef = useRef(null)

  const links = user ? [{ to: '/', label: 'Home' }, ...USER_LINKS] : AUTH_LINKS
  const initials = getInitials(user?.name, '?')

  useEffect(() => {
    setMobileOpen(false)
    setProfileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    function handler(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMobileOpen(false)
        setProfileOpen(false)
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  useEffect(() => {
    function handler(e) {
      if (e.key === 'Escape') {
        setMobileOpen(false)
        setProfileOpen(false)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  function isActive(path) {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav ref={navRef} style={S.nav}>
      <div style={S.inner}>
        <Link to="/" style={S.logo}>
          <div style={S.logoMark}>A</div>
          <span style={S.logoText}>AI Interviewer</span>
        </Link>

        <div className="desktop-nav" style={S.centerLinks}>
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{ ...S.navLink, ...(isActive(to) ? S.navLinkActive : {}) }}
            >
              {label}
              {isActive(to) && <span style={S.activeDot} />}
            </Link>
          ))}
        </div>

        <div className="desktop-auth" style={S.rightSection}>
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                style={S.profileTrigger}
                onClick={() => setProfileOpen(v => !v)}
              >
                <div style={S.avatar}>{initials}</div>
                <span style={S.triggerName}>{user.name?.split(' ')[0]}</span>
                <span style={{
                  ...S.chevron,
                  transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}>▾</span>
              </button>

              {profileOpen && (
                <div style={S.dropdown}>
                  <div style={S.dropdownHead}>
                    <div style={S.dropdownAvatar}>{initials}</div>
                    <div>
                      <p style={S.dropdownName}>{user.name}</p>
                      <p style={S.dropdownEmail}>{user.email}</p>
                    </div>
                  </div>
                  <div style={S.dropdownDivider} />
                  <DropItem to="/profile" label="Profile" />
                  <DropItem to="/dashboard" label="Dashboard" />
                  <DropItem to="/settings" label="Settings" />
                  <div style={S.dropdownDivider} />
                  <div style={{ padding: '4px 12px' }}>
                    <Toggle
                      label="Dark mode"
                      value={settings.themeMode === 'dark'}
                      onChange={v => update('themeMode', v ? 'dark' : 'light')}
                    />
                  </div>
                  <div style={S.dropdownDivider} />
                  <button type="button" style={S.dropdownLogout} onClick={handleLogout}>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Link to="/login" style={S.loginLink}>Sign in</Link>
              <Link to="/signup" style={S.signupLink}>Get started</Link>
            </div>
          )}
        </div>

        <button
          type="button"
          className="mobile-btn"
          style={S.hamburger}
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span style={{ ...S.bar, transform: mobileOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
          <span style={{ ...S.bar, opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ ...S.bar, transform: mobileOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
        </button>
      </div>

      {mobileOpen && (
        <div style={S.mobileMenu}>
          {user && (
            <>
              <div style={S.mobileUser}>
                <div style={S.mobileAvatar}>{initials}</div>
                <div>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 15, margin: 0 }}>{user.name}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: '2px 0 0' }}>{user.email}</p>
                </div>
              </div>
              <div style={S.mobileDivider} />
            </>
          )}
          {links.map(({ to, label }) => (
            <Link key={to} to={to} style={S.mobileLink}>{label}</Link>
          ))}
          <div style={S.mobileDivider} />
          {user ? (
            <button type="button" style={S.mobileLogout} onClick={handleLogout}>Sign out</button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8 }}>
              <Link to="/login" style={S.mobileLoginBtn}>Sign in</Link>
              <Link to="/signup" style={S.mobileSignupBtn}>Get started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

function DropItem({ to, label }) {
  return <Link to={to} style={S.dropdownItem}>{label}</Link>
}

const S = {
  nav: {
    position: 'sticky', top: 0, zIndex: 1000,
    backgroundColor: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
    boxShadow: 'var(--shadow-xs)',
  },
  inner: {
    maxWidth: 'var(--page-width)', margin: '0 auto',
    padding: '0 24px', height: 60,
    display: 'flex', alignItems: 'center', gap: 16,
  },
  logo: { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 },
  logoMark: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: 'var(--primary)', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, fontWeight: 800,
  },
  logoText: { color: 'var(--text-primary)', fontWeight: 700, fontSize: 16 },
  centerLinks: { display: 'flex', alignItems: 'center', gap: 2, flex: 1, overflowX: 'auto' },
  navLink: {
    position: 'relative', color: 'var(--text-secondary)',
    textDecoration: 'none', fontSize: 13, fontWeight: 500,
    padding: '6px 8px', borderRadius: 6, whiteSpace: 'nowrap',
  },
  navLinkActive: { color: 'var(--text-primary)', fontWeight: 600 },
  activeDot: {
    position: 'absolute', bottom: 0, left: '50%',
    transform: 'translateX(-50%)',
    width: 4, height: 4, borderRadius: '50%',
    backgroundColor: 'var(--primary)',
  },
  rightSection: { marginLeft: 'auto', display: 'flex', alignItems: 'center' },
  profileTrigger: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'none', border: '1px solid var(--border)',
    borderRadius: 10, padding: '5px 10px 5px 5px', cursor: 'pointer',
  },
  avatar: {
    width: 28, height: 28, borderRadius: '50%',
    backgroundColor: 'var(--primary-light)',
    border: '1.5px solid var(--primary)',
    color: 'var(--primary-text)', fontSize: 11, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  triggerName: { color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 },
  chevron: { color: 'var(--text-muted)', fontSize: 11, transition: 'transform 0.2s' },
  dropdown: {
    position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 232,
    backgroundColor: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 12, padding: 6, boxShadow: 'var(--shadow-lg)',
  },
  dropdownHead: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px 12px' },
  dropdownAvatar: {
    width: 34, height: 34, borderRadius: '50%',
    backgroundColor: 'var(--primary-light)', border: '1.5px solid var(--primary)',
    color: 'var(--primary-text)', fontSize: 12, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  dropdownName: { color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, margin: 0 },
  dropdownEmail: { color: 'var(--text-muted)', fontSize: 12, margin: '1px 0 0' },
  dropdownDivider: { height: 1, backgroundColor: 'var(--border)', margin: '4px 0' },
  dropdownItem: {
    display: 'block', padding: '9px 12px', borderRadius: 7,
    color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500, textDecoration: 'none',
  },
  dropdownLogout: {
    display: 'block', width: '100%', padding: '9px 12px',
    borderRadius: 7, background: 'none', border: 'none',
    color: 'var(--danger-text)', fontSize: 13, fontWeight: 500,
    cursor: 'pointer', textAlign: 'left',
  },
  loginLink: { color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500, padding: '7px 12px' },
  signupLink: {
    backgroundColor: 'var(--primary)', color: '#fff',
    fontSize: 14, fontWeight: 600, padding: '7px 16px', borderRadius: 8,
  },
  hamburger: {
    display: 'none', flexDirection: 'column', gap: 5,
    background: 'none', border: 'none', cursor: 'pointer', padding: 6, marginLeft: 'auto',
  },
  bar: {
    display: 'block', width: 20, height: 2,
    backgroundColor: 'var(--text-primary)', borderRadius: 2, transition: 'all 0.2s',
  },
  mobileMenu: {
    backgroundColor: 'var(--surface)', borderTop: '1px solid var(--border)',
    padding: '12px 20px 20px', display: 'flex', flexDirection: 'column', gap: 2,
  },
  mobileUser: { display: 'flex', alignItems: 'center', gap: 12, padding: '8px 4px 12px' },
  mobileAvatar: {
    width: 38, height: 38, borderRadius: '50%',
    backgroundColor: 'var(--primary-light)', border: '1.5px solid var(--primary)',
    color: 'var(--primary-text)', fontSize: 13, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  mobileDivider: { height: 1, backgroundColor: 'var(--border)', margin: '8px 0' },
  mobileLink: {
    display: 'block', padding: '10px 8px', borderRadius: 7,
    color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500, textDecoration: 'none',
  },
  mobileLogout: {
    width: '100%', padding: '11px', borderRadius: 8,
    background: 'none', border: '1px solid var(--danger-border)',
    color: 'var(--danger-text)', fontSize: 14, fontWeight: 500, cursor: 'pointer', marginTop: 4,
  },
  mobileLoginBtn: {
    display: 'block', textAlign: 'center', color: 'var(--text-primary)',
    border: '1px solid var(--border-strong)', padding: 11, borderRadius: 8, fontSize: 14,
  },
  mobileSignupBtn: {
    display: 'block', textAlign: 'center',
    backgroundColor: 'var(--primary)', color: '#fff',
    padding: 11, borderRadius: 8, fontSize: 14, fontWeight: 600,
  },
}