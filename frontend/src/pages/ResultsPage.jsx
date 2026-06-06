import { useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'
import PageShell from '../components/layout/PageShell'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import StatCard from '../components/ui/StatCard'
import EmptyState from '../components/ui/EmptyState'

export default function ResultsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { interviews, getInterviewById } = useAppData()

  const interview = useMemo(() => {
    const id = location.state?.interviewId
    if (id) return getInterviewById(id)
    return interviews[0] ?? null
  }, [location.state, interviews, getInterviewById])

  if (!interview) {
    return (
      <PageShell title="Interview results" subtitle="No session data found">
        <Card>
          <EmptyState
            icon="📋"
            title="No results to show"
            desc="Complete an interview to see your results here."
            action={{ label: 'Start interview', onClick: () => navigate('/interview') }}
          />
        </Card>
      </PageShell>
    )
  }

  const feedback = interview.feedback || []
  const durationLabel = interview.duration
    ? `${interview.duration} min`
    : '—'

  return (
    <PageShell
      title="Interview complete"
      subtitle="Here's how you performed in this session"
      action={<Button onClick={() => navigate('/interview')}>Start new interview</Button>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }} className="kpi-grid">
        <StatCard label="Overall score" value={`${interview.score}%`} />
        <StatCard label="Questions answered" value={interview.questionsAnswered ?? 0} />
        <StatCard label="Duration" value={durationLabel} />
      </div>

      <p style={{
        color: 'var(--text-muted)', fontSize: 13, marginBottom: 20,
        padding: '10px 14px', backgroundColor: 'var(--info-bg)',
        border: '1px solid var(--info-border)', borderRadius: 8,
      }}>
        Scores are calculated locally until the AI backend is connected. {interview.feedbackSummary}
      </p>

      {feedback.length > 0 ? (
        <>
          <h2 style={{ color: 'var(--text-primary)', fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
            Question-by-question feedback
          </h2>
          {feedback.map((item, i) => (
            <Card key={`${interview.id}-fb-${i}`} style={{ marginBottom: 14, padding: '20px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Badge variant="brand">{item.topic || interview.topic}</Badge>
                <Badge variant={item.score >= 80 ? 'success' : item.score >= 60 ? 'warning' : 'danger'}>
                  {item.score}%
                </Badge>
              </div>
              <p style={{ color: 'var(--text-primary)', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                Q{i + 1}: {item.question}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div>
                  <p style={labelStyle}>Strengths</p>
                  <p style={textStyle}>{item.strengths}</p>
                </div>
                <div>
                  <p style={labelStyle}>Gaps</p>
                  <p style={textStyle}>{item.gaps}</p>
                </div>
              </div>
            </Card>
          ))}
        </>
      ) : (
        <Card style={{ marginBottom: 20 }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>
            No per-question breakdown for this session.
          </p>
        </Card>
      )}

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>Back to dashboard</Button>
        <Button variant="ghost" onClick={() => navigate('/history')}>View all sessions</Button>
      </div>
    </PageShell>
  )
}

const labelStyle = {
  color: 'var(--text-muted)', fontSize: 12, fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 6px',
}
const textStyle = { color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6, margin: 0 }
