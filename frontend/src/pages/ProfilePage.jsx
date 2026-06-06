import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useAppData } from '../context/AppDataContext'
import PageShell from '../components/layout/PageShell'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import StatCard from '../components/ui/StatCard'
import SectionHeader from '../components/ui/SectionHeader'
import Heatmap from '../components/ui/Heatmap'
import Modal from '../components/ui/Modal'
import { showToast } from '../components/ui/Toast'
import { ACHIEVEMENT_DEFINITIONS } from '../data/initialState'
import { getAchievementIcon } from '../utils/achievements'
import { fieldLabel, displayValue } from '../utils/labels'
import { getInitials } from '../hooks/useInitials'
import {
  calculateAverageScore, calculateBestScore, calculateCurrentStreak,
  calculateLongestStreak, getSkillMatrix, getUnlockedAchievements,
  getProfileCompletion, formatScore,
} from '../utils/analytics'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const { settings } = useTheme()
  const { interviews, activityLog } = useAppData()
  const navigate = useNavigate()
  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState({
    name: user?.name ?? '',
    bio: user?.bio ?? '',
    college: user?.college ?? '',
    degree: user?.degree ?? '',
    gradYear: user?.gradYear ?? '',
    targetRole: user?.targetRole ?? '',
    expLevel: user?.expLevel ?? '',
    location: user?.location ?? '',
    github: user?.github ?? '',
    linkedin: user?.linkedin ?? '',
    portfolio: user?.portfolio ?? '',
  })

  const initials = getInitials(user?.name)
  const joined = user?.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently'
  const { pct: completion, missing } = useMemo(() => getProfileCompletion(user), [user])

  const avgScore = useMemo(() => calculateAverageScore(interviews), [interviews])
  const bestScore = useMemo(() => calculateBestScore(interviews), [interviews])
  const streak = useMemo(() => calculateCurrentStreak(activityLog), [activityLog])
  const longest = useMemo(() => calculateLongestStreak(activityLog), [activityLog])
  const skills = useMemo(() => getSkillMatrix(interviews), [interviews])
  const achieves = useMemo(() => getUnlockedAchievements(
    { interviewsCompleted: interviews.length, currentStreak: streak, bestScore, topicsPracticed: skills.length },
    ACHIEVEMENT_DEFINITIONS
  ), [interviews.length, streak, bestScore, skills.length])

  const preferredTopics = settings.preferredTopics?.length
    ? settings.preferredTopics
    : null

  const STATS = [
    { label: 'Total interviews', value: String(interviews.length) },
    { label: 'Average score', value: formatScore(avgScore) },
    { label: 'Best score', value: formatScore(bestScore) },
    { label: 'Current streak', value: String(streak) },
    { label: 'Longest streak', value: String(longest) },
    { label: 'Topics practiced', value: String(skills.length) },
  ]

  function saveEdit() {
    if (form.name.trim().length < 2) { showToast('Name too short', 'error'); return }
    updateUser(form)
    setEditOpen(false)
    showToast('Profile updated')
  }

  const timeline = activityLog.slice(0, 10)

  return (
    <PageShell maxWidth={1100}>
      {completion < 100 && (
        <Card style={{ marginBottom: 20, padding: '16px 20px', borderColor: 'var(--primary-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-text)', fontSize: 13, fontWeight: 700, padding: '7px 14px', borderRadius: 8 }}>
                {completion}%
              </div>
              <div>
                <p style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, margin: '0 0 2px' }}>Complete your profile</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: 0 }}>
                  Add {missing.slice(0, 3).map(fieldLabel).join(', ')} to improve recommendations
                </p>
              </div>
            </div>
            <Button size="sm" variant="secondary" onClick={() => setEditOpen(true)}>Complete profile</Button>
          </div>
          <div style={{ height: 4, backgroundColor: 'var(--border)', borderRadius: 2, overflow: 'hidden', marginTop: 14 }}>
            <div style={{ height: '100%', width: `${completion}%`, backgroundColor: 'var(--primary)', borderRadius: 2 }} />
          </div>
        </Card>
      )}

      <Card style={{ marginBottom: 20, padding: '28px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flex: 1 }}>
            <div style={avatarStyle}>{initials}</div>
            <div>
              <h1 style={{ color: 'var(--text-primary)', fontSize: 22, fontWeight: 800, margin: '0 0 3px' }}>{user?.name}</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '0 0 8px' }}>{user?.email}</p>
              {user?.targetRole
                ? <Badge variant="brand" style={{ marginBottom: 10 }}>{user.targetRole}</Badge>
                : <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>+ Set target role</Button>
              }
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                <span style={metaChip}>Member since {joined}</span>
                {user?.college && <span style={metaChip}>{user.college}</span>}
                {user?.location && <span style={metaChip}>{user.location}</span>}
              </div>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>Edit profile</Button>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }} className="kpi-grid">
        {STATS.map(s => <StatCard key={s.label} label={s.label} value={s.value} />)}
      </div>

      <Card style={{ marginBottom: 20 }}>
        <SectionHeader title="Practice activity" desc="Last 52 weeks" />
        <Heatmap activityLog={activityLog} emptyMessage="Activity appears here after you complete interviews." />
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }} className="two-col">
        <Card>
          <SectionHeader title="Profile details" />
          {[
            ['name', user?.name],
            ['email', user?.email],
            ['college', user?.college],
            ['degree', user?.degree],
            ['gradYear', user?.gradYear],
            ['expLevel', user?.expLevel],
            ['location', user?.location],
          ].map(([key, value]) => (
            <div key={key} style={infoRow}>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{fieldLabel(key)}</span>
              <span style={{ color: value ? 'var(--text-primary)' : 'var(--text-faint)', fontSize: 13, fontWeight: 500 }}>
                {displayValue(value, 'Not added')}
              </span>
            </div>
          ))}
        </Card>
        <Card>
          <SectionHeader title="Career preferences" />
          {[
            ['targetRole', user?.targetRole],
            ['careerGoal', settings.careerGoal],
            ['difficulty', settings.difficulty],
            ['jobType', settings.jobType],
          ].map(([key, value]) => (
            <div key={key} style={infoRow}>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{fieldLabel(key)}</span>
              <span style={{ color: value ? 'var(--text-primary)' : 'var(--text-faint)', fontSize: 13, fontWeight: 500 }}>
                {displayValue(value, 'Not set')}
              </span>
            </div>
          ))}
          <div style={{ marginTop: 16 }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>
              Preferred topics
            </p>
            {preferredTopics ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {preferredTopics.map(t => <Badge key={t} variant="brand">{t}</Badge>)}
              </div>
            ) : (
              <p style={{ color: 'var(--text-faint)', fontSize: 13, margin: 0 }}>No topics selected</p>
            )}
          </div>
        </Card>
      </div>

      <Card style={{ marginBottom: 20 }}>
        <SectionHeader title="Skill matrix" />
        {skills.length === 0 ? (
          <EmptyState compact icon="📊" title="No skill data yet"
            action={{ label: 'Start interview', onClick: () => navigate('/interview') }}
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }} className="skill-grid">
            {skills.map(sk => (
              <div key={sk.skill} style={skillCard}>
                <span style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 600 }}>{sk.skill}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>avg {sk.avgScore}% · {sk.attempts} attempts</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card style={{ marginBottom: 20 }}>
        <SectionHeader title="Achievements" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }} className="achieve-grid">
          {achieves.map(a => (
            <div key={a.id} style={{ ...achieveCard, opacity: a.earned ? 1 : 0.5 }}>
              <span style={{ fontSize: 24 }}>{getAchievementIcon(a.icon)}</span>
              {!a.earned && <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>🔒 Locked</span>}
              <p style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, margin: '8px 0 4px' }}>{a.label}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 11, margin: 0 }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeader title="Activity timeline" />
        {timeline.length === 0 ? (
          <EmptyState compact icon="📋" title="No activity yet"
            desc="Complete interviews or save questions to build your timeline."
            action={{ label: 'Start interview', onClick: () => navigate('/interview') }}
          />
        ) : (
          timeline.map(a => (
            <div key={a.id} style={infoRow}>
              <span style={{ color: 'var(--text-primary)', fontSize: 13 }}>{a.label}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                {new Date(a.date).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </Card>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit profile">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            ['Full name', 'name', 'text'],
            ['Target role', 'targetRole', 'text'],
            ['College', 'college', 'text'],
            ['Degree', 'degree', 'text'],
            ['Graduation year', 'gradYear', 'text'],
            ['Location', 'location', 'text'],
            ['GitHub URL', 'github', 'url'],
            ['LinkedIn', 'linkedin', 'url'],
            ['Portfolio', 'portfolio', 'url'],
          ].map(([label, key, type]) => (
            <div key={key}>
              <label style={modalLabel}>{label}</label>
              <input style={modalInput} type={type} value={form[key]}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
            </div>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <Button onClick={saveEdit}>Save changes</Button>
            <Button variant="secondary" onClick={() => setEditOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </PageShell>
  )
}

const avatarStyle = {
  width: 72, height: 72, borderRadius: '50%',
  backgroundColor: 'var(--primary-light)', border: '2px solid var(--primary)',
  color: 'var(--primary-text)', fontSize: 24, fontWeight: 800,
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
}
const metaChip = {
  backgroundColor: 'var(--surface-muted)', color: 'var(--text-secondary)',
  fontSize: 12, padding: '3px 10px', borderRadius: 100, border: '1px solid var(--border)',
}
const infoRow = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '10px 0', borderBottom: '1px solid var(--border)',
}
const skillCard = {
  backgroundColor: 'var(--surface-muted)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)', padding: '14px 16px',
  display: 'flex', flexDirection: 'column', gap: 4,
}
const achieveCard = {
  backgroundColor: 'var(--surface-muted)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)', padding: '18px 14px', textAlign: 'center',
}
const modalLabel = { display: 'block', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, marginBottom: 5 }
const modalInput = {
  width: '100%', padding: '9px 12px', backgroundColor: 'var(--surface-muted)',
  border: '1.5px solid var(--border-strong)', borderRadius: 'var(--radius-sm)',
  color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
}
