// Shows after an interview session ends
// For now uses dummy data — Phase 5 will populate from real AI scoring

import { useNavigate } from 'react-router-dom'
import StatCard from '../components/StatCard'

const DUMMY_FEEDBACK = [
  {
    question: 'Explain the difference between var, let, and const in JavaScript.',
    score: 85,
    strengths: 'Good explanation of scoping. Mentioned hoisting correctly.',
    gaps: 'Missed temporal dead zone for let/const.',
    topic: 'JavaScript',
  },
  {
    question: 'What is the virtual DOM and why does React use it?',
    score: 70,
    strengths: 'Understood the concept of diffing.',
    gaps: 'Did not explain reconciliation or Fiber.',
    topic: 'React',
  },
]

export default function ResultsPage() {
  const navigate = useNavigate()

  const avgScore = Math.round(
    DUMMY_FEEDBACK.reduce((sum, f) => sum + f.score, 0) / DUMMY_FEEDBACK.length
  )

  return (
    <div style={S.page}>
      <div style={S.container}>

        <div style={S.header}>
          <div>
            <h1 style={S.title}>Interview complete 🎉</h1>
            <p style={S.subtitle}>Here's how you performed today</p>
          </div>
          <button style={S.newBtn} onClick={() => navigate('/interview')}>
            Start new interview
          </button>
        </div>

        {/* Summary stats */}
        <div style={S.statsGrid}>
          <StatCard number={`${avgScore}%`} label="Overall score"    icon="📊" />
          <StatCard number={DUMMY_FEEDBACK.length} label="Questions answered" icon="❓" />
          <StatCard number="12:34" label="Time taken"       icon="⏱" />
        </div>

        {/* Per-question feedback */}
        <h2 style={S.sectionTitle}>Question-by-question feedback</h2>

        {DUMMY_FEEDBACK.map((item, i) => (
          <div key={i} style={S.feedbackCard}>
            <div style={S.feedbackTop}>
              <span style={S.badge}>{item.topic}</span>
              <span style={{
                ...S.scorePill,
                backgroundColor: item.score >= 80 ? '#0d2818' : '#2a1a0d',
                color: item.score >= 80 ? '#4ade80' : '#f59e0b',
                borderColor: item.score >= 80 ? '#1a5c38' : '#5c3d0d',
              }}>
                {item.score}%
              </span>
            </div>

            <p style={S.question}>Q{i + 1}: {item.question}</p>

            <div style={S.feedbackRow}>
              <div style={S.feedbackSection}>
                <p style={S.feedbackLabel}>✅ Strengths</p>
                <p style={S.feedbackText}>{item.strengths}</p>
              </div>
              <div style={S.feedbackSection}>
                <p style={S.feedbackLabel}>⚠ Gaps</p>
                <p style={S.feedbackText}>{item.gaps}</p>
              </div>
            </div>
          </div>
        ))}

        <div style={S.actions}>
          <button style={S.ghostBtn} onClick={() => navigate('/dashboard')}>
            Back to dashboard
          </button>
          <button style={S.ghostBtn} onClick={() => navigate('/history')}>
            View all sessions
          </button>
        </div>

      </div>
    </div>
  )
}

const S = {
  page: {
    minHeight: 'calc(100vh - 64px)',
    backgroundColor: '#0d0d1f',
    padding: 'clamp(28px,4vw,48px) 20px',
  },
  container: { maxWidth: 860, margin: '0 auto' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  title: {
    color: '#f0f0f8',
    fontSize: 'clamp(22px,4vw,30px)',
    fontWeight: 700,
    margin: '0 0 6px',
    letterSpacing: '-0.02em',
  },
  subtitle: { color: '#5a5a7a', fontSize: 14, margin: 0 },
  newBtn: {
    backgroundColor: '#5b5bf0',
    color: '#fff',
    border: 'none',
    padding: '11px 22px',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 14,
    marginBottom: 36,
  },
  sectionTitle: {
    color: '#f0f0f8',
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 16,
  },
  feedbackCard: {
    backgroundColor: '#12122a',
    border: '1px solid #1e1e38',
    borderRadius: 14,
    padding: '20px 22px',
    marginBottom: 14,
  },
  feedbackTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#1e1e50',
    color: '#8080e0',
    fontSize: 12,
    fontWeight: 600,
    padding: '3px 10px',
    borderRadius: 100,
    border: '1px solid #2e2e6a',
  },
  scorePill: {
    fontSize: 13,
    fontWeight: 700,
    padding: '4px 12px',
    borderRadius: 100,
    border: '1px solid',
  },
  question: {
    color: '#c8c8e8',
    fontSize: 14,
    lineHeight: 1.6,
    marginBottom: 16,
  },
  feedbackRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16,
  },
  feedbackSection: {},
  feedbackLabel: {
    color: '#8b8fa8',
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    margin: '0 0 6px',
  },
  feedbackText: {
    color: '#9090b0',
    fontSize: 13,
    lineHeight: 1.6,
    margin: 0,
  },
  actions: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    marginTop: 28,
  },
  ghostBtn: {
    backgroundColor: 'transparent',
    color: '#c0c0e8',
    border: '1px solid #252545',
    padding: '11px 22px',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
}