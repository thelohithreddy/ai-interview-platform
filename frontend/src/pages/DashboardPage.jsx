import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAppData } from '../context/AppDataContext'
import PageShell from '../components/layout/PageShell'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import StatCard from '../components/ui/StatCard'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import SectionHeader from '../components/ui/SectionHeader'
import Heatmap from '../components/ui/Heatmap'
import Modal from '../components/ui/Modal'
import { INTERVIEW_MODES } from '../data/initialState'
import {
  calculateAverageScore, calculateBestScore, calculateReadinessScore,
  calculateCurrentStreak, formatScore,
} from '../utils/analytics'

export default function DashboardPage() {
  const { user } = useAuth()
  const { interviews, activityLog, savedQuestions, roadmap, resumeAnalysis } = useAppData()
  const navigate = useNavigate()
  const [detailId, setDetailId] = useState(null)

  const firstName = user?.name?.split(' ')[0] ?? 'there'
  const avgScore = useMemo(() => calculateAverageScore(interviews), [interviews])
  const bestScore = useMemo(() => calculateBestScore(interviews), [interviews])
  const readiness = useMemo(() => calculateReadinessScore(interviews), [interviews])
  const streak = useMemo(() => calculateCurrentStreak(activityLog), [activityLog])
  const hasEnoughData = interviews.length >= 3
  const detailInterview = interviews.find(iv => iv.id === detailId)

  const KPI = [
    { label: 'Interviews', value: String(interviews.length) },
    { label: 'Avg score', value: formatScore(avgScore) },
    { label: 'Best score', value: formatScore(bestScore) },
    { label: 'Saved questions', value: String(savedQuestions.length) },
    { label: 'Day streak', value: String(streak) },
    { label: 'Resume score', value: resumeAnalysis.score != null ? `${resumeAnalysis.score}%` : '—' },
  ]

  return (
    <PageShell maxWidth={1200}>
      <Card style={{ marginBottom: 24, padding: '28px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ marginBottom: 10 }}>
              {user?.targetRole
                ? <Badge variant="brand">{user.targetRole}</Badge>
                : <Button variant="link" size="sm" onClick={() => navigate('/settings')}>Set your target role →</Button>
              }
            </div>
            <h1 style={heroTitle}>
              Welcome back, <span style={{ color: 'var(--primary)' }}>{firstName}</span>
            </h1>
            <p style={heroSub}>
              {interviews.length === 0
                ? 'Start your first mock interview to begin tracking progress.'
                : interviews.length < 3
                  ? `Complete ${3 - interviews.length} more interview(s) to unlock your readiness score.`
                  : `Interview readiness: ${readiness}%`
              }
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 20 }}>
              <Button onClick={() => navigate('/interview')}>
                {interviews.length === 0 ? 'Start your first interview' : 'Start interview'}
              </Button>
              <Button variant="secondary" onClick={() => navigate('/resume')}>Upload resume</Button>
            </div>
          </div>
          {readiness != null && (
            <div style={{ flexShrink: 0 }}>
              <svg width="100" height="100" viewBox="0 0 100 100" aria-label={`Readiness ${readiness}%`}>
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--primary)" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40 * readiness / 100} ${2 * Math.PI * 40 * (1 - readiness / 100)}`}
                  strokeDashoffset={2 * Math.PI * 40 * 0.25}
                />
                <text x="50" y="45" textAnchor="middle" fill="var(--text-primary)" fontSize="18" fontWeight="700">{readiness}%</text>
                <text x="50" y="60" textAnchor="middle" fill="var(--text-muted)" fontSize="9">Readiness</text>
              </svg>
            </div>
          )}
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }} className="kpi-grid">
        {KPI.map(k => <StatCard key={k.label} label={k.label} value={k.value} />)}
      </div>

      {!hasEnoughData && (
        <Card style={{ marginBottom: 24, padding: '20px 24px', borderColor: 'var(--info-border)' }}>
          <SectionHeader title="Unlock with practice" desc="Complete interviews to unlock these features" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {['AI recommendations', 'Readiness score', 'AI Career Coach'].map(f => (
              <div key={f} style={{
                padding: '12px 14px', backgroundColor: 'var(--surface-muted)',
                border: '1px solid var(--border)', borderRadius: 8,
                color: 'var(--text-muted)', fontSize: 13,
              }}>
                🔒 {f} — needs 3+ interviews
              </div>
            ))}
          </div>
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }} className="two-col">
        <Card>
          <SectionHeader title="Practice by mode" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }} className="modes-grid">
            {INTERVIEW_MODES.map(m => (
              <button
                key={m.id}
                type="button"
                className="card-hover"
                style={modeCardStyle}
                onClick={() => navigate(`/interview?mode=${m.id}`)}
              >
                <p style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, margin: '0 0 4px' }}>{m.label}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: 0, lineHeight: 1.4 }}>{m.sub}</p>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader title="Resume" action={{ label: 'Open', onClick: () => navigate('/resume') }} />
          {resumeAnalysis.uploaded ? (
            <div>
              <p style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 500, margin: '0 0 4px' }}>
                {resumeAnalysis.fileName}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: 0 }}>
                Score: {resumeAnalysis.score != null ? `${resumeAnalysis.score}%` : '— (analysis pending)'}
              </p>
            </div>
          ) : (
            <EmptyState compact
              icon="📄"
              title="No resume uploaded"
              desc="Upload your resume to track resume score and get tailored prep."
              action={{ label: 'Upload resume', onClick: () => navigate('/resume') }}
            />
          )}
        </Card>
      </div>

      <Card style={{ marginBottom: 20 }}>
        <SectionHeader title="Practice activity" desc="Last 52 weeks" />
        <Heatmap
          activityLog={activityLog}
          emptyMessage="Activity appears here after you complete interviews."
        />
      </Card>

      <Card>
        <SectionHeader
          title="Recent interviews"
          action={interviews.length > 0 ? { label: 'View all', onClick: () => navigate('/history') } : undefined}
        />
        {interviews.length === 0 ? (
          <EmptyState
            icon="🎤"
            title="No interviews yet"
            desc="Complete your first AI mock interview to see your results here."
            action={{ label: 'Start interview', onClick: () => navigate('/interview') }}
          />
        ) : (
          interviews.slice(0, 5).map(iv => (
            <div key={iv.id} style={ivRow}>
              <div>
                <p style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, margin: '0 0 2px' }}>
                  {iv.topic} — {iv.mode}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: 0 }}>
                  {new Date(iv.date).toLocaleDateString()}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Badge variant={iv.score >= 80 ? 'success' : iv.score >= 60 ? 'warning' : 'danger'}>
                  {iv.score}%
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => setDetailId(iv.id)}>View</Button>
              </div>
            </div>
          ))
        )}
      </Card>

      {roadmap && (
        <Card style={{ marginTop: 20 }}>
          <SectionHeader title="Learning roadmap" action={{ label: 'Open roadmap', onClick: () => navigate('/roadmap') }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>
            Roadmap created {new Date(roadmap.createdAt).toLocaleDateString()} · {roadmap.progress ?? 0}% complete
          </p>
        </Card>
      )}

      <Modal open={!!detailInterview} onClose={() => setDetailId(null)} title="Interview details">
        {detailInterview && (
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 12 }}>
              {detailInterview.topic} · {detailInterview.mode} · {detailInterview.difficulty}
            </p>
            <p style={{ color: 'var(--text-primary)', fontSize: 22, fontWeight: 700, margin: '0 0 8px' }}>
              {detailInterview.score}%
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{detailInterview.feedbackSummary}</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <Button onClick={() => { setDetailId(null); navigate('/results', { state: { interviewId: detailInterview.id } }) }}>
                Full results
              </Button>
              <Button variant="secondary" onClick={() => setDetailId(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </PageShell>
  )
}

const heroTitle = {
  color: 'var(--text-primary)', fontSize: 'clamp(22px,4vw,28px)',
  fontWeight: 800, margin: '8px 0', letterSpacing: '-0.02em',
}
const heroSub = { color: 'var(--text-secondary)', fontSize: 15 }
const modeCardStyle = {
  backgroundColor: 'var(--surface-muted)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)', padding: '14px 12px', textAlign: 'left',
  cursor: 'pointer', width: '100%',
}
const ivRow = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '12px 0', borderBottom: '1px solid var(--border)',
}
