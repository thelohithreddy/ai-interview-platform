import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme, ACCENT_COLORS } from '../context/ThemeContext'
import { useAppData } from '../context/AppDataContext'
import Modal from '../components/ui/Modal'
import { showToast } from '../components/ui/Toast'
import Toggle from '../components/ui/Toggle'
import Button from '../components/ui/Button'
import ChipGroup from '../components/ui/ChipGroup'

const SECTIONS = [
  { id: 'general', label: 'General' },
  { id: 'career', label: 'Career' },
  { id: 'interview', label: 'Interviews' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'security', label: 'Security' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'data', label: 'Data & Export' },
  { id: 'danger', label: 'Danger zone', danger: true },
]

const INTERVIEW_TYPES = ['Frontend', 'Backend', 'Full Stack', 'DSA', 'System Design', 'Behavioral', 'HR', 'Rapid Fire']
const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Adaptive']
const DURATIONS = ['15', '30', '45', '60']
const LANGUAGES = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go']
const JOB_TYPES = ['Internship', 'Full-time', 'Freelance']
const CAREER_GOALS = ['Placement', 'Internship', 'Job switch', 'Skill improvement']
const EXP_LEVELS = ['Student', 'Entry', 'Mid-level', 'Senior']
const INDUSTRIES = ['Tech', 'Finance', 'Healthcare', 'E-commerce', 'Startup']
const THEME_MODES = ['light', 'dark', 'system']

export default function SettingsPage() {
  const { user, logout, updateUser } = useAuth()
  const { settings, update, updateMany } = useTheme()
  const {
    interviews, savedQuestions, resumeAnalysis,
    clearSavedQuestions, resetAnalytics, clearHistory,
  } = useAppData()
  const navigate = useNavigate()
  const [active, setActive] = useState('general')
  const [modal, setModal] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [exporting, setExporting] = useState(false)

  const [name, setName] = useState(user?.name ?? '')
  const [bio, setBio] = useState(user?.bio ?? '')
  const [curPw, setCurPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confPw, setConfPw] = useState('')
  const [pwErr, setPwErr] = useState('')
  const [targetRole, setTargetRole] = useState(user?.targetRole ?? '')
  const [expLevel, setExpLevel] = useState(settings.experienceLevel || '')
  const [gradYear, setGradYear] = useState(user?.gradYear ?? '')
  const [industry, setIndustry] = useState(settings.industry ?? '')
  const [jobType, setJobType] = useState(settings.jobType ?? '')
  const [careerGoal, setCareerGoal] = useState(settings.careerGoal ?? '')

  function saveGeneral() {
    if (name.trim().length < 2) { showToast('Name too short', 'error'); return }
    updateUser({ name: name.trim(), bio: bio.trim() })
    showToast('Profile saved')
  }

  function saveCareer() {
    const year = gradYear.trim()
    if (year && (Number(year) < 1950 || Number(year) > 2040)) {
      showToast('Graduation year must be between 1950 and 2040', 'error')
      return
    }
    updateUser({ targetRole: targetRole.trim(), gradYear: year })
    updateMany({ experienceLevel: expLevel, industry, jobType, careerGoal })
    showToast('Career preferences saved')
  }

  function changePassword() {
    setPwErr('')
    if (!curPw) { setPwErr('Enter current password'); return }
    if (newPw.length < 8) { setPwErr('Min 8 characters required'); return }
    if (!/[A-Z]/.test(newPw)) { setPwErr('Include one uppercase letter'); return }
    if (!/[0-9]/.test(newPw)) { setPwErr('Include one number'); return }
    if (newPw !== confPw) { setPwErr('Passwords do not match'); return }
    setCurPw(''); setNewPw(''); setConfPw('')
    showToast('Password updated')
  }

  async function handleExport() {
    setExporting(true)
    try {
      const data = {
        user, settings, exportedAt: new Date().toISOString(),
        interviews, savedQuestions, resumeAnalysis,
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'ai-interviewer-export.json'
      a.click()
      URL.revokeObjectURL(url)
      setModal(null)
      showToast('Data exported')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div style={S.page} className="page-enter">
      <div style={S.container}>
        <h1 style={S.pageTitle}>Settings</h1>
        <div style={S.layout} className="settings-layout">
          <aside style={S.sidebar}>
            {SECTIONS.map(sec => (
              <button key={sec.id} type="button"
                style={{ ...S.sideItem, ...(active === sec.id ? S.sideItemActive : {}), ...(sec.danger ? S.sideItemDanger : {}) }}
                onClick={() => setActive(sec.id)}
              >
                {sec.label}
              </button>
            ))}
          </aside>

          <div style={S.panel}>
            {active === 'general' && (
              <Panel title="General" desc="Update your account information">
                <Field label="Full name">
                  <input style={S.input} value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
                </Field>
                <Field label="Email address" hint="Email cannot be changed at this time">
                  <input style={S.inputDisabled} value={user?.email ?? ''} disabled readOnly />
                </Field>
                <Field label="Bio">
                  <textarea style={{ ...S.input, resize: 'vertical', minHeight: 80 }}
                    value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about yourself..." rows={3} />
                </Field>
                <SaveRow><Button className="settings-save-btn" onClick={saveGeneral}>Save changes</Button></SaveRow>
              </Panel>
            )}

            {active === 'career' && (
              <Panel title="Career preferences" desc="Personalize your interview experience">
                <Field label="Target role">
                  <input style={S.input} value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder="e.g. Full Stack Developer Intern" />
                </Field>
                <Field label="Experience level">
                  <ChipGroup options={EXP_LEVELS} value={expLevel} onChange={setExpLevel} />
                </Field>
                <Field label="Graduation year">
                  <input style={S.input} type="number" min={1950} max={2040} value={gradYear}
                    onChange={e => setGradYear(e.target.value)} placeholder="2026" />
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
                <SaveRow><Button className="settings-save-btn" onClick={saveCareer}>Save changes</Button></SaveRow>
              </Panel>
            )}

            {active === 'interview' && (
              <Panel title="Interview preferences" desc="Configure your practice sessions">
                <Field label="Preferred interview types">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {INTERVIEW_TYPES.map(t => {
                      const on = settings.preferredTypes?.includes(t)
                      return (
                        <button key={t} type="button" className="chip-btn" style={{ ...S.chip, ...(on ? S.chipActive : {}) }}
                          onClick={() => {
                            const next = on
                              ? (settings.preferredTypes || []).filter(x => x !== t)
                              : [...(settings.preferredTypes || []), t]
                            update('preferredTypes', next)
                          }}
                        >{t}</button>
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
                <Divider />
                <Toggle label="Adaptive difficulty" desc="Adjust difficulty based on performance (off by default)"
                  value={settings.adaptiveDifficulty ?? false}
                  onChange={v => update('adaptiveDifficulty', v)} />
                <SaveRow><Button className="settings-save-btn" onClick={() => showToast('Interview preferences saved')}>Save changes</Button></SaveRow>
              </Panel>
            )}

            {active === 'notifications' && (
              <Panel title="Notifications" desc="Control how and when you hear from us">
                <Toggle label="Interview reminders" desc="Daily reminder to maintain your streak"
                  value={settings.interviewReminder}
                  onChange={v => update('interviewReminder', v)} />
                {settings.interviewReminder && (
                  <Field label="Reminder time">
                    <input style={S.input} type="time" value={settings.reminderTime || '09:00'}
                      onChange={e => update('reminderTime', e.target.value)} />
                  </Field>
                )}
                <Divider />
                <Toggle label="Email notifications" value={settings.emailNotif} onChange={v => update('emailNotif', v)} />
                <Divider />
                <Toggle label="Weekly progress report" value={settings.weeklyReport} onChange={v => update('weeklyReport', v)} />
                <Divider />
                <Toggle label="Achievement alerts" value={settings.achievementAlerts ?? false}
                  onChange={v => update('achievementAlerts', v)} />
                <Divider />
                <Toggle
                  label="Browser push notifications"
                  value={settings.browserPush}
                  onChange={async (v) => {
                    if (v) {
                      if (!('Notification' in window)) {
                        showToast('Push notifications are not supported in this browser', 'error')
                        return
                      }
                      const permission = await Notification.requestPermission()
                      if (permission !== 'granted') {
                        showToast('Enable notifications in your browser to use this', 'error')
                        return
                      }
                    }
                    update('browserPush', v)
                  }}
                />
              </Panel>
            )}

            {active === 'appearance' && (
              <Panel title="Appearance" desc="Customize how the app looks">
                <Field label="Theme">
                  <ChipGroup options={THEME_MODES} value={settings.themeMode || 'light'}
                    onChange={v => update('themeMode', v)} capitalize />
                </Field>
                <Divider />
                <Toggle label="Compact mode" value={settings.compactMode}
                  onChange={v => update('compactMode', v)} />
                <Divider />
                <Field label="Font size">
                  <ChipGroup options={['small', 'medium', 'large']} value={settings.fontSize}
                    onChange={v => update('fontSize', v)} capitalize />
                </Field>
                <Divider />
                <Field label="Accent color">
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {Object.entries(ACCENT_COLORS).map(([key, val]) => (
                      <button key={key} type="button" title={key}
                        onClick={() => update('accentColor', key)}
                        style={{
                          width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer',
                          backgroundColor: val.primary,
                          outline: settings.accentColor === key ? `2px solid ${val.primary}` : '1px solid var(--border)',
                          outlineOffset: 2,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontSize: 12,
                        }}
                      >
                        {settings.accentColor === key ? '✓' : ''}
                      </button>
                    ))}
                  </div>
                </Field>
              </Panel>
            )}

            {active === 'security' && (
              <Panel title="Security" desc="Manage your account security">
                <InfoBox text="Password changes apply after backend integration. This UI demonstrates the full pattern." />
                <Field label="Current password">
                  <input style={S.input} type="password" value={curPw} onChange={e => { setCurPw(e.target.value); setPwErr('') }} autoComplete="current-password" />
                </Field>
                <Field label="New password" hint="Min 8 chars · uppercase · number">
                  <input style={S.input} type="password" value={newPw} onChange={e => { setNewPw(e.target.value); setPwErr('') }} autoComplete="new-password" />
                </Field>
                <Field label="Confirm new password">
                  <input style={S.input} type="password" value={confPw} onChange={e => { setConfPw(e.target.value); setPwErr('') }} autoComplete="new-password" />
                </Field>
                {pwErr && <p style={{ color: 'var(--danger-text)', fontSize: 13 }}>{pwErr}</p>}
                <SaveRow><Button className="settings-save-btn" onClick={changePassword}>Update password</Button></SaveRow>
              </Panel>
            )}

            {active === 'privacy' && (
              <Panel title="Privacy" desc="Control your data and visibility">
                <Toggle label="Public profile" desc="Let others view your profile and stats"
                  value={settings.publicProfile} onChange={v => update('publicProfile', v)} />
                <Divider />
                <Toggle label="Share anonymous stats" value={settings.shareStats} onChange={v => update('shareStats', v)} />
                <Divider />
                <Toggle label="Show achievements on profile" value={settings.showAchievements ?? false}
                  onChange={v => update('showAchievements', v)} />
                <Divider />
                <Toggle label="Allow AI personalization" value={settings.aiPersonalization ?? false}
                  onChange={v => update('aiPersonalization', v)} />
                <InfoBox text="We never sell your data. All interview transcripts are private by default." />
              </Panel>
            )}

            {active === 'data' && (
              <Panel title="Data & Export" desc="Download or manage your data">
                <DataAction label="Export all data" desc="Download profile, interviews, saved questions, and settings."
                  btnLabel={exporting ? 'Exporting…' : 'Export JSON'} onClick={() => setModal('export')} />
                <Divider />
                <DataAction label="Export interview history" desc="Download interview sessions and scores."
                  btnLabel="Export history" onClick={() => showToast('Export started', 'info')} />
              </Panel>
            )}

            {active === 'danger' && (
              <Panel title="Danger zone" desc="Irreversible actions — read carefully" danger>
                <DangerAction label="Clear saved questions" desc="Permanently delete all saved questions."
                  btnLabel="Clear questions" onClick={() => setModal('clearQuestions')} />
                <Divider />
                <DangerAction label="Reset analytics" desc="Reset scores on interviews. History remains."
                  btnLabel="Reset analytics" onClick={() => setModal('resetAnalytics')} />
                <Divider />
                <DangerAction label="Clear interview history" desc="Delete all past sessions."
                  btnLabel="Clear history" onClick={() => setModal('clear')} destructive />
                <Divider />
                <DangerAction label="Delete account" desc="Permanently delete your account and all data."
                  btnLabel="Delete account" onClick={() => { setDeleteConfirm(''); setModal('delete') }} destructive />
              </Panel>
            )}
          </div>
        </div>
      </div>

      <Modal open={modal === 'export'} onClose={() => setModal(null)} title="Export your data">
        <p style={S.modalText}>Download all your data as JSON.</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" onClick={handleExport} loading={exporting}>Download JSON</Button>
          <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
        </div>
      </Modal>

      <Modal open={modal === 'clear'} onClose={() => setModal(null)} title="Clear interview history" danger>
        <p style={S.modalText}>All past interview sessions will be permanently deleted.</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="danger" onClick={() => { clearHistory(); setModal(null); showToast('History cleared') }}>Yes, clear history</Button>
          <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
        </div>
      </Modal>

      <Modal open={modal === 'clearQuestions'} onClose={() => setModal(null)} title="Clear saved questions" danger>
        <p style={S.modalText}>All saved questions will be permanently deleted.</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="danger" onClick={() => { clearSavedQuestions(); setModal(null); showToast('Questions cleared') }}>Yes, clear all</Button>
          <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
        </div>
      </Modal>

      <Modal open={modal === 'resetAnalytics'} onClose={() => setModal(null)} title="Reset analytics" danger>
        <p style={S.modalText}>All scores will be reset. Interview history remains.</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="danger" onClick={() => { resetAnalytics(); setModal(null); showToast('Analytics reset') }}>Yes, reset</Button>
          <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
        </div>
      </Modal>

      <Modal open={modal === 'delete'} onClose={() => setModal(null)} title="Delete account" danger>
        <p style={S.modalText}>
          This permanently deletes your account and all data. Type <strong>DELETE</strong> to confirm.
        </p>
        <input style={S.input} value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder="Type DELETE" />
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <Button variant="danger" disabled={deleteConfirm !== 'DELETE'}
            onClick={() => { setModal(null); logout(); navigate('/') }}>
            Yes, delete everything
          </Button>
          <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
        </div>
      </Modal>
    </div>
  )
}

function Panel({ title, desc, danger, children }) {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ ...S.sectionTitle, ...(danger ? { color: 'var(--danger-text)' } : {}) }}>{title}</h2>
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

function Divider() {
  return <div style={{ height: 1, backgroundColor: 'var(--border)', margin: '8px 0' }} />
}

function InfoBox({ text }) {
  return (
    <div style={{
      display: 'flex', gap: 10, alignItems: 'flex-start',
      backgroundColor: 'var(--info-bg)', border: '1px solid var(--info-border)',
      borderRadius: 'var(--radius-sm)', padding: '12px 14px', marginBottom: 16,
    }}>
      <span style={{ color: 'var(--info-text)', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>i</span>
      <p style={{ color: 'var(--info-text)', fontSize: 13, lineHeight: 1.5, margin: 0 }}>{text}</p>
    </div>
  )
}

function SaveRow({ children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
      {children}
    </div>
  )
}

function DataAction({ label, desc, btnLabel, onClick }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap', padding: '14px 0' }}>
      <div style={{ flex: 1 }}>
        <p style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, margin: '0 0 3px' }}>{label}</p>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>{desc}</p>
      </div>
      <Button variant="secondary" size="sm" onClick={onClick}>{btnLabel}</Button>
    </div>
  )
}

function DangerAction({ label, desc, btnLabel, onClick, destructive }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap', padding: '14px 0' }}>
      <div style={{ flex: 1 }}>
        <p style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, margin: '0 0 3px' }}>{label}</p>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>{desc}</p>
      </div>
      <Button variant={destructive ? 'danger' : 'secondary'} size="sm" onClick={onClick}>{btnLabel}</Button>
    </div>
  )
}

const S = {
  page: { minHeight: 'calc(100vh - 60px)', backgroundColor: 'var(--app-bg)', padding: 'var(--sp-xl, 32px) 20px' },
  container: { maxWidth: 960, margin: '0 auto' },
  pageTitle: { color: 'var(--text-primary)', fontSize: 'clamp(20px,4vw,26px)', fontWeight: 700, margin: '0 0 24px' },
  layout: { display: 'grid', gridTemplateColumns: '188px 1fr', gap: 20, alignItems: 'start' },
  sidebar: {
    backgroundColor: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', padding: 6, display: 'flex', flexDirection: 'column', gap: 2,
    position: 'sticky', top: 76,
  },
  sideItem: {
    display: 'flex', padding: '9px 12px', borderRadius: 7, border: 'none',
    backgroundColor: 'transparent', color: 'var(--text-secondary)',
    fontSize: 13, fontWeight: 500, cursor: 'pointer', textAlign: 'left', width: '100%',
  },
  sideItemActive: { backgroundColor: 'var(--primary-light)', color: 'var(--primary-text)', fontWeight: 600 },
  sideItemDanger: { color: 'var(--danger-text)', marginTop: 6 },
  panel: {
    backgroundColor: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '28px 32px', minHeight: 400,
  },
  sectionTitle: { color: 'var(--text-primary)', fontSize: 18, fontWeight: 700, margin: '0 0 4px' },
  fieldLabel: { display: 'block', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, marginBottom: 7 },
  input: {
    width: '100%', padding: '10px 13px', backgroundColor: 'var(--surface-muted)',
    border: '1.5px solid var(--border-strong)', borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  },
  inputDisabled: {
    width: '100%', padding: '10px 13px', backgroundColor: 'var(--surface-muted)',
    border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
    color: 'var(--text-muted)', fontSize: 14, boxSizing: 'border-box', opacity: 0.7, cursor: 'not-allowed',
  },
  chip: {
    padding: '7px 14px', borderRadius: 8, border: '1px solid var(--border-strong)',
    backgroundColor: 'transparent', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer',
  },
  chipActive: {
    backgroundColor: 'var(--primary-light)', borderColor: 'var(--primary)', color: 'var(--primary-text)',
  },
  modalText: { color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 22 },
}
