import { useState }      from 'react'
import { useNavigate }   from 'react-router-dom'
import { useAuth }       from '../context/AuthContext'
import { useTheme }      from '../context/ThemeContext'
import Modal             from '../components/Modal'
import { showToast }     from '../components/Toast'
import Toggle            from '../components/ui/Toggle'

const SECTIONS = [
  { id: 'general',      label: 'General'       },
  { id: 'career',       label: 'Career'        },
  { id: 'interview',    label: 'Interviews'    },
  { id: 'notifications',label: 'Notifications' },
  { id: 'appearance',   label: 'Appearance'    },
  { id: 'security',     label: 'Security'      },
  { id: 'privacy',      label: 'Privacy'       },
  { id: 'data',         label: 'Data & Export' },
  { id: 'danger',       label: 'Danger zone', danger: true },
]

const INTERVIEW_TYPES  = ['Frontend','Backend','Full Stack','DSA','System Design','Behavioral','HR','Rapid Fire']
const DIFFICULTIES     = ['Easy','Medium','Hard','Adaptive']
const DURATIONS        = ['15','30','45','60']
const LANGUAGES        = ['JavaScript','Python','Java','C++','Go']
const JOB_TYPES        = ['Internship','Full-time','Freelance']
const CAREER_GOALS     = ['Placement','Internship','Job switch','Skill improvement']
const EXP_LEVELS       = ['Student','Entry','Mid-level','Senior']
const INDUSTRIES       = ['Tech','Finance','Healthcare','E-commerce','Startup']

export default function SettingsPage() {
  const { user, logout, updateUser } = useAuth()
  const { settings, update, updateMany, ACCENT_COLORS } = useTheme()
  const navigate = useNavigate()
  const [active, setActive] = useState('general')

  // General
  const [name, setName] = useState(user?.name ?? '')
  const [bio,  setBio]  = useState(user?.bio  ?? '')

  // Security
  const [curPw,  setCurPw]  = useState('')
  const [newPw,  setNewPw]  = useState('')
  const [confPw, setConfPw] = useState('')
  const [pwErr,  setPwErr]  = useState('')

  // Career
  const [targetRole,  setTargetRole]  = useState(user?.targetRole  ?? '')
  const [expLevel,    setExpLevel]    = useState(settings.experienceLevel ?? 'Student')
  const [gradYear,    setGradYear]    = useState(user?.gradYear    ?? '')
  const [industry,    setIndustry]    = useState(settings.industry ?? '')
  const [jobType,     setJobType]     = useState(settings.jobType  ?? 'Internship')
  const [careerGoal,  setCareerGoal]  = useState(settings.careerGoal ?? 'Placement')

  // Modals
  const [modal, setModal] = useState(null) // 'clear' | 'delete' | 'export' | 'resetAnalytics'

  function saveGeneral() {
    if (name.trim().length < 2) { showToast('Name too short', 'error'); return }
    updateUser({ name: name.trim(), bio: bio.trim() })
    showToast('Profile saved')
  }

  function saveCareer() {
    updateUser({ targetRole: targetRole.trim(), gradYear })
    updateMany({ experienceLevel: expLevel, industry, jobType, careerGoal })
    showToast('Career preferences saved')
  }

  function changePassword() {
    setPwErr('')
    if (!curPw)           { setPwErr('Enter current password'); return }
    if (newPw.length < 8) { setPwErr('Min 8 characters required'); return }
    if (!/[A-Z]/.test(newPw)) { setPwErr('Include one uppercase letter'); return }
    if (!/[0-9]/.test(newPw)) { setPwErr('Include one number'); return }
    if (newPw !== confPw) { setPwErr('Passwords do not match'); return }
    setCurPw(''); setNewPw(''); setConfPw('')
    showToast('Password updated')
  }

  function handleExport() {
    const data = { user, exportedAt: new Date().toISOString(), interviews: [], saved: [] }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'ai-interviewer-export.json'; a.click()
    URL.revokeObjectURL(url)
    setModal(null); showToast('Data exported')
  }

  return (
    <div style={S.page} className="page-enter">
      <div style={S.container}>
        <h1 style={S.pageTitle}>Settings</h1>

        <div style={S.layout} className="settings-layout">

          {/* Sidebar */}
          <aside style={S.sidebar}>
            {SECTIONS.map(sec => (
              <button key={sec.id}
                style={{
                  ...S.sideItem,
                  ...(active === sec.id ? S.sideItemActive : {}),
                  ...(sec.danger ? S.sideItemDanger : {}),
                }}
                onClick={() => setActive(sec.id)}
              >
                {sec.label}
              </button>
            ))}
          </aside>

          {/* Panel */}
          <div style={S.panel}>

            {active === 'general' && (
              <Panel title="General" desc="Update your account information">
                <Field label="Display name">
                  <input style={S.input} value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your full name" />
                </Field>
                <Field label="Email address" hint="Email cannot be changed at this time">
                  <input style={{ ...S.input, opacity: 0.6 }} value={user?.email ?? ''} disabled />
                </Field>
                <Field label="Bio">
                  <textarea style={{ ...S.input, resize: 'vertical', minHeight: 80, lineHeight: 1.6 }}
                    value={bio} onChange={e => setBio(e.target.value)}
                    placeholder="Tell us about yourself..." rows={3} />
                </Field>
                <SaveBtn onClick={saveGeneral} />
              </Panel>
            )}

            {active === 'career' && (
              <Panel title="Career preferences" desc="Personalize your AI interview experience">
                <Field label="Target role">
                  <input style={S.input} value={targetRole}
                    onChange={e => setTargetRole(e.target.value)}
                    placeholder="Full Stack Developer Intern" />
                </Field>
                <Field label="Experience level">
                  <ChipGroup options={EXP_LEVELS} value={expLevel} onChange={setExpLevel} />
                </Field>
                <Field label="Graduation year">
                  <input style={S.input} value={gradYear}
                    onChange={e => setGradYear(e.target.value)}
                    placeholder="2026" />
                </Field>
                <Field label="Preferred industry">
                  <ChipGroup options={INDUSTRIES} value={industry} onChange={setIndustry} />
                </Field>
                <Field label="Job type">
                  <ChipGroup options={JOB_TYPES} value={jobType} onChange={setJobType} />
                </Field>
                <Field label="Career goal">
                  <ChipGroup options={CAREER_GOALS} value={careerGoal} onChange={setCareerGoal} />
                </Field>
                <SaveBtn onClick={saveCareer} />
              </Panel>
            )}

            {active === 'interview' && (
              <Panel title="Interview preferences" desc="Configure your practice sessions">
                <Field label="Preferred interview types">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {INTERVIEW_TYPES.map(t => {
                      const on = settings.preferredTypes?.includes(t)
                      return (
                        <button key={t}
                          style={{ ...S.chip, ...(on ? S.chipActive : {}) }}
                          onClick={() => {
                            const next = on
                              ? (settings.preferredTypes || []).filter(x => x !== t)
                              : [...(settings.preferredTypes || []), t]
                            update('preferredTypes', next)
                          }}
                        >
                          {t}
                        </button>
                      )
                    })}
                  </div>
                </Field>
                <Field label="Difficulty">
                  <ChipGroup options={DIFFICULTIES} value={settings.difficulty} onChange={v => update('difficulty', v)} />
                </Field>
                <Field label="Session duration (minutes)">
                  <ChipGroup options={DURATIONS} value={settings.interviewLength} onChange={v => update('interviewLength', v)} />
                </Field>
                <Field label="Preferred coding language">
                  <ChipGroup options={LANGUAGES} value={settings.preferredLang} onChange={v => update('preferredLang', v)} />
                </Field>
                <Toggle label="Adaptive difficulty" desc="AI adjusts difficulty based on your performance"
                  value={settings.adaptiveDifficulty ?? false}
                  onChange={v => { update('adaptiveDifficulty', v); showToast(v ? 'Adaptive difficulty on' : 'Adaptive difficulty off') }} />
                <SaveBtn onClick={() => showToast('Interview preferences saved')} />
              </Panel>
            )}

            {active === 'notifications' && (
              <Panel title="Notifications" desc="Control how and when you hear from us">
                <Toggle label="Interview reminders" desc="Daily reminder to maintain your streak"
                  value={settings.interviewReminder}
                  onChange={v => { update('interviewReminder', v); showToast(v ? 'Reminders on' : 'Reminders off') }} />
                <Divider />
                <Toggle label="Email notifications" desc="Tips and account updates by email"
                  value={settings.emailNotif}
                  onChange={v => { update('emailNotif', v); showToast(v ? 'Email notifications on' : 'Email notifications off') }} />
                <Divider />
                <Toggle label="Weekly progress report" desc="Summary of your performance each week"
                  value={settings.weeklyReport}
                  onChange={v => { update('weeklyReport', v); showToast(v ? 'Weekly reports on' : 'Weekly reports off') }} />
                <Divider />
                <Toggle label="Achievement alerts" desc="Get notified when you unlock an achievement"
                  value={settings.achievementAlerts ?? true}
                  onChange={v => { update('achievementAlerts', v); showToast('Preference saved') }} />
                <Divider />
                <Toggle label="Browser push notifications" desc="Desktop alerts when streak is at risk"
                  value={settings.browserPush}
                  onChange={v => { update('browserPush', v); showToast(v ? 'Push notifications on' : 'Push notifications off') }} />
              </Panel>
            )}

            {active === 'appearance' && (
              <Panel title="Appearance" desc="Customize how the app looks">
                <Toggle label="Dark mode" desc="Switch between light and dark theme"
                  value={settings.darkMode}
                  onChange={v => { update('darkMode', v); showToast(v ? 'Dark mode on' : 'Light mode on') }} />
                <Divider />
                <Toggle label="Compact mode" desc="Reduce spacing to fit more on screen"
                  value={settings.compactMode}
                  onChange={v => { update('compactMode', v); showToast(v ? 'Compact mode on' : 'Normal mode on') }} />
                <Divider />
                <Field label="Font size">
                  <ChipGroup
                    options={['small','medium','large']}
                    value={settings.fontSize}
                    onChange={v => { update('fontSize', v); showToast(`Font size: ${v}`) }}
                    capitalize
                  />
                </Field>
                <Divider />
                <Field label="Accent color">
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {Object.entries(ACCENT_COLORS).map(([key, val]) => (
                      <button key={key}
                        title={key}
                        onClick={() => { update('accentColor', key); showToast(`Accent: ${key}`) }}
                        style={{
                          width: 32, height: 32, borderRadius: '50%',
                          border: 'none', cursor: 'pointer',
                          backgroundColor: val.primary,
                          outline: settings.accentColor === key ? `3px solid ${val.primary}` : 'none',
                          outlineOffset: 3,
                          transform: settings.accentColor === key ? 'scale(1.15)' : 'scale(1)',
                          transition: 'all 0.15s',
                        }}
                      />
                    ))}
                  </div>
                </Field>
              </Panel>
            )}

            {active === 'security' && (
              <Panel title="Security" desc="Manage your account security">
                <InfoBox text="Password changes apply after backend integration. This UI demonstrates the full pattern." />
                <Field label="Current password">
                  <input style={S.input} type="password" value={curPw}
                    onChange={e => { setCurPw(e.target.value); setPwErr('') }}
                    placeholder="Enter current password"
                    autoComplete="current-password" />
                </Field>
                <Field label="New password" hint="Min 8 chars · uppercase · number">
                  <input style={S.input} type="password" value={newPw}
                    onChange={e => { setNewPw(e.target.value); setPwErr('') }}
                    placeholder="Create new password"
                    autoComplete="new-password" />
                </Field>
                <Field label="Confirm new password">
                  <input style={S.input} type="password" value={confPw}
                    onChange={e => { setConfPw(e.target.value); setPwErr('') }}
                    placeholder="Repeat new password"
                    autoComplete="new-password" />
                </Field>
                {pwErr && <p style={{ color: 'var(--danger-text)', fontSize: 13, margin: '0 0 12px' }}>⚠ {pwErr}</p>}
                <SaveBtn label="Update password" onClick={changePassword} />

                <div style={{ marginTop: 28 }}>
                  <p style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
                    Active sessions
                  </p>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 16px',
                    backgroundColor: 'var(--surface-muted)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 20 }}>💻</span>
                      <div>
                        <p style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 500, margin: 0 }}>
                          Current browser
                        </p>
                        <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: '2px 0 0' }}>Active now</p>
                      </div>
                    </div>
                    <span style={{
                      backgroundColor: 'var(--success-bg)', color: 'var(--success-text)',
                      border: '1px solid var(--success-border)',
                      fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 100,
                    }}>Active</span>
                  </div>
                </div>
              </Panel>
            )}

            {active === 'privacy' && (
              <Panel title="Privacy" desc="Control your data and visibility">
                <Toggle label="Public profile" desc="Let others view your profile and stats"
                  value={settings.publicProfile}
                  onChange={v => { update('publicProfile', v); showToast(v ? 'Profile is now public' : 'Profile is now private') }} />
                <Divider />
                <Toggle label="Share anonymous stats" desc="Help improve AI question quality"
                  value={settings.shareStats}
                  onChange={v => { update('shareStats', v); showToast('Preference saved') }} />
                <Divider />
                <Toggle label="Show achievements on profile" desc="Display your earned badges publicly"
                  value={settings.showAchievements ?? true}
                  onChange={v => { update('showAchievements', v); showToast('Preference saved') }} />
                <Divider />
                <Toggle label="Allow AI personalization" desc="Use your interview data to improve recommendations"
                  value={settings.aiPersonalization ?? true}
                  onChange={v => { update('aiPersonalization', v); showToast('Preference saved') }} />
                <InfoBox text="We never sell your data. All interview transcripts are private by default." />
              </Panel>
            )}

            {active === 'data' && (
              <Panel title="Data & Export" desc="Download or manage your data">
                <DangerAction
                  label="Export all data"
                  desc="Download your profile, interviews, saved questions, and settings as JSON."
                  btnLabel="Export JSON"
                  onClick={() => setModal('export')}
                />
                <Divider />
                <DangerAction
                  label="Export interview history"
                  desc="Download only your interview sessions and scores."
                  btnLabel="Export history"
                  onClick={() => { showToast('Export started') }}
                />
                <Divider />
                <DangerAction
                  label="Export saved questions"
                  desc="Download your saved question bank."
                  btnLabel="Export questions"
                  onClick={() => { showToast('Export started') }}
                />
              </Panel>
            )}

            {active === 'danger' && (
              <Panel title="Danger zone" desc="Irreversible actions — read carefully" danger>
                <DangerAction
                  label="Clear saved questions"
                  desc="Permanently delete all your saved questions. Cannot be undone."
                  btnLabel="Clear questions"
                  onClick={() => setModal('clearQuestions')}
                />
                <Divider />
                <DangerAction
                  label="Reset analytics"
                  desc="Delete all interview scores and analytics. Your history remains."
                  btnLabel="Reset analytics"
                  onClick={() => setModal('resetAnalytics')}
                />
                <Divider />
                <DangerAction
                  label="Clear interview history"
                  desc="Permanently delete all past interview sessions. Account stays active."
                  btnLabel="Clear history"
                  onClick={() => setModal('clear')}
                  destructive
                />
                <Divider />
                <DangerAction
                  label="Delete account"
                  desc="Permanently delete your account and all data. This cannot be undone."
                  btnLabel="Delete account"
                  onClick={() => setModal('delete')}
                  destructive
                />
              </Panel>
            )}

          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      <Modal open={modal === 'export'} onClose={() => setModal(null)} title="Export your data">
        <p style={S.modalText}>
          This will download all your profile, interviews, saved questions, and settings as a JSON file.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={S.btnPrimary} onClick={handleExport}>Download JSON</button>
          <button style={S.btnSecondary} onClick={() => setModal(null)}>Cancel</button>
        </div>
      </Modal>

      <Modal open={modal === 'clear'} onClose={() => setModal(null)} title="Clear interview history" danger>
        <p style={S.modalText}>
          All your past interview sessions will be permanently deleted. Your account and saved questions
          will not be affected.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={S.btnDanger} onClick={() => { setModal(null); showToast('History cleared') }}>
            Yes, clear history
          </button>
          <button style={S.btnSecondary} onClick={() => setModal(null)}>Cancel</button>
        </div>
      </Modal>

      <Modal open={modal === 'clearQuestions'} onClose={() => setModal(null)} title="Clear saved questions" danger>
        <p style={S.modalText}>
          All saved questions will be permanently deleted. This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={S.btnDanger} onClick={() => { setModal(null); showToast('Questions cleared') }}>
            Yes, clear all
          </button>
          <button style={S.btnSecondary} onClick={() => setModal(null)}>Cancel</button>
        </div>
      </Modal>

      <Modal open={modal === 'resetAnalytics'} onClose={() => setModal(null)} title="Reset analytics" danger>
        <p style={S.modalText}>
          All your scores and analytics will be reset. Interview history remains intact.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={S.btnDanger} onClick={() => { setModal(null); showToast('Analytics reset') }}>
            Yes, reset
          </button>
          <button style={S.btnSecondary} onClick={() => setModal(null)}>Cancel</button>
        </div>
      </Modal>

      <Modal open={modal === 'delete'} onClose={() => setModal(null)} title="Delete account" danger>
        <p style={S.modalText}>
          This will permanently delete your account, all interviews, saved questions, and settings.
          <strong style={{ color: 'var(--danger-text)' }}> This cannot be undone.</strong>
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={S.btnDanger} onClick={() => { setModal(null); logout(); navigate('/') }}>
            Yes, delete everything
          </button>
          <button style={S.btnSecondary} onClick={() => setModal(null)}>Cancel, keep my account</button>
        </div>
      </Modal>

    </div>
  )
}

/* ── Sub-components ── */

function Panel({ title, desc, danger, children }) {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ ...S.sectionTitle, ...(danger ? { color: 'var(--danger-text)' } : {}) }}>
          {title}
        </h2>
        {desc && <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>{desc}</p>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>{children}</div>
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={S.fieldLabel}>{label}</label>
      {children}
      {hint && <p style={{ color: 'var(--text-faint)', fontSize: 12, marginTop: 5 }}>{hint}</p>}
    </div>
  )
}

function ChipGroup({ options, value, onChange, capitalize }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(o => {
        const active = value === o || value === String(o)
        return (
          <button key={o} onClick={() => onChange(o)} style={{
            padding: '7px 16px', borderRadius: 8,
            border: '1px solid',
            fontSize: 13, cursor: 'pointer', fontWeight: 500,
            backgroundColor: active ? 'var(--primary-light)' : 'transparent',
            color:           active ? 'var(--primary-text)'  : 'var(--text-secondary)',
            borderColor:     active ? 'var(--primary)'       : 'var(--border-strong)',
            transition: 'all 0.15s',
            textTransform: capitalize ? 'capitalize' : 'none',
          }}>
            {o}
          </button>
        )
      })}
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, backgroundColor: 'var(--border)', margin: '8px 0' }} />
}

function InfoBox({ text }) {
  return (
    <div style={{
      display: 'flex', gap: 10, alignItems: 'flex-start',
      backgroundColor: 'var(--info-bg)',
      border: '1px solid var(--info-border)',
      borderRadius: 'var(--radius-sm)', padding: '12px 14px', marginTop: 16,
    }}>
      <span style={{ color: 'var(--info-text)', fontSize: 16, flexShrink: 0 }}>ℹ</span>
      <p style={{ color: 'var(--info-text)', fontSize: 13, lineHeight: 1.5, margin: 0 }}>{text}</p>
    </div>
  )
}

function DangerAction({ label, desc, btnLabel, onClick, destructive }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', gap: 20, padding: '14px 0', flexWrap: 'wrap',
    }}>
      <div style={{ flex: 1 }}>
        <p style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, margin: '0 0 3px' }}>{label}</p>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.5, margin: 0 }}>{desc}</p>
      </div>
      <button
        onClick={onClick}
        style={destructive ? S.btnDanger : S.btnSecondaryDanger}
      >
        {btnLabel}
      </button>
    </div>
  )
}

function SaveBtn({ onClick, label = 'Save changes' }) {
  return (
    <button style={{ ...S.btnPrimary, marginTop: 8 }} onClick={onClick}>{label}</button>
  )
}

const S = {
  page: {
    minHeight: 'calc(100vh - 60px)',
    backgroundColor: 'var(--app-bg)',
    padding: 'var(--sp-xl, 32px) 20px',
  },
  container: { maxWidth: 960, margin: '0 auto' },
  pageTitle: {
    color: 'var(--text-primary)',
    fontSize: 'clamp(20px,4vw,26px)',
    fontWeight: 700, margin: '0 0 24px',
    letterSpacing: '-0.02em',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '188px 1fr',
    gap: 20, alignItems: 'start',
  },
  sidebar: {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-xs)',
    padding: 6, display: 'flex',
    flexDirection: 'column', gap: 2,
    position: 'sticky', top: 76,
  },
  sideItem: {
    display: 'flex', alignItems: 'center',
    padding: '9px 12px', borderRadius: 7,
    border: 'none', backgroundColor: 'transparent',
    color: 'var(--text-secondary)', fontSize: 13,
    fontWeight: 500, cursor: 'pointer',
    textAlign: 'left', width: '100%',
    transition: 'all 0.15s',
  },
  sideItemActive: {
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary-text)',
    fontWeight: 600,
  },
  sideItemDanger: {
    color: 'var(--danger-text)', marginTop: 6,
  },
  panel: {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)',
    padding: '28px 32px', minHeight: 400,
  },
  sectionTitle: {
    color: 'var(--text-primary)', fontSize: 18,
    fontWeight: 700, margin: '0 0 4px',
  },
  fieldLabel: {
    display: 'block', color: 'var(--text-secondary)',
    fontSize: 13, fontWeight: 600,
    marginBottom: 7, letterSpacing: '0.01em',
  },
  input: {
    width: '100%', padding: '10px 13px',
    backgroundColor: 'var(--surface-muted)',
    border: '1.5px solid var(--border-strong)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)', fontSize: 14,
    outline: 'none', boxSizing: 'border-box',
    fontFamily: 'inherit', transition: 'border-color 0.15s',
  },
  chip: {
    padding: '7px 14px', borderRadius: 8,
    border: '1px solid var(--border-strong)',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: 13, cursor: 'pointer', fontWeight: 500,
    transition: 'all 0.15s',
  },
  chipActive: {
    backgroundColor: 'var(--primary-light)',
    borderColor: 'var(--primary)',
    color: 'var(--primary-text)',
  },
  btnPrimary: {
    backgroundColor: 'var(--primary)', color: '#fff',
    border: '1px solid var(--primary)',
    padding: '10px 22px', borderRadius: 9,
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
  btnSecondary: {
    backgroundColor: 'var(--surface)', color: 'var(--text-secondary)',
    border: '1px solid var(--border-strong)',
    padding: '10px 22px', borderRadius: 9,
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
  btnDanger: {
    backgroundColor: 'var(--danger-bg)', color: 'var(--danger-text)',
    border: '1px solid var(--danger-border)',
    padding: '9px 18px', borderRadius: 9,
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  btnSecondaryDanger: {
    backgroundColor: 'transparent', color: 'var(--danger-text)',
    border: '1px solid var(--danger-border)',
    padding: '9px 18px', borderRadius: 9,
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  modalText: {
    color: 'var(--text-secondary)', fontSize: 14,
    lineHeight: 1.6, marginBottom: 22,
  },
}