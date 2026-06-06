import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import PageShell from '../components/layout/PageShell'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import FilterBar from '../components/ui/FilterBar'
import Modal from '../components/ui/Modal'

const TOPICS = ['All', 'JavaScript', 'React', 'Node.js', 'System Design', 'DSA', 'Behavioral', 'Frontend', 'Backend', 'Full Stack', 'HR']
const MODES = ['All', 'Frontend', 'Backend', 'Full Stack', 'DSA', 'Behavioral', 'System Design', 'HR', 'Rapid Fire']
const DIFFS = ['All', 'Easy', 'Medium', 'Hard']

export default function HistoryPage() {
  const navigate = useNavigate()
  const { interviews } = useAppData()
  const [topic, setTopic] = useState('All')
  const [mode, setMode] = useState('All')
  const [diff, setDiff] = useState('All')
  const [search, setSearch] = useState('')
  const [detailId, setDetailId] = useState(null)
  const debouncedSearch = useDebouncedValue(search)

  const filtered = useMemo(() => interviews.filter(iv =>
    (topic === 'All' || iv.topic === topic || iv.mode === topic) &&
    (mode === 'All' || iv.mode === mode) &&
    (diff === 'All' || iv.difficulty === diff) &&
    (!debouncedSearch || iv.topic?.toLowerCase().includes(debouncedSearch.toLowerCase()))
  ), [interviews, topic, mode, diff, debouncedSearch])

  const detail = interviews.find(iv => iv.id === detailId)

  return (
    <PageShell
      title="Interview history"
      subtitle="All your past mock interview sessions"
      action={<Button onClick={() => navigate('/interview')}>New interview</Button>}
      maxWidth={960}
    >
      {interviews.length > 0 && (
        <Card style={{ marginBottom: 20, padding: '16px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input
              style={searchStyle}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by topic..."
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              <FilterBar label="Topic" options={TOPICS} value={topic} onChange={setTopic} />
              <FilterBar label="Mode" options={MODES} value={mode} onChange={setMode} />
              <FilterBar label="Difficulty" options={DIFFS} value={diff} onChange={setDiff} />
            </div>
          </div>
        </Card>
      )}

      {interviews.length === 0 ? (
        <Card>
          <EmptyState
            icon="🎤"
            title="No interviews yet"
            desc="Complete your first AI mock interview to see your performance history here."
            action={{ label: 'Start interview', onClick: () => navigate('/interview') }}
          />
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState compact
            icon="🔍"
            title="No matching interviews"
            desc="Try adjusting your filters."
            action={{ label: 'Clear filters', onClick: () => { setTopic('All'); setMode('All'); setDiff('All'); setSearch('') } }}
          />
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(iv => (
            <Card key={iv.id} hover style={{ padding: '18px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 600 }}>{iv.topic}</span>
                    <Badge variant="default">{iv.mode}</Badge>
                    {iv.difficulty && (
                      <Badge variant={iv.difficulty === 'Hard' ? 'danger' : iv.difficulty === 'Medium' ? 'warning' : 'success'}>
                        {iv.difficulty}
                      </Badge>
                    )}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: 0 }}>
                    {new Date(iv.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {iv.duration ? ` · ${iv.duration} min` : ''}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Badge variant={iv.score >= 80 ? 'success' : iv.score >= 60 ? 'warning' : 'danger'} style={{ fontSize: 14, padding: '4px 14px' }}>
                    {iv.score}%
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => setDetailId(iv.id)}>View details</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!detail} onClose={() => setDetailId(null)} title="Session details">
        {detail && (
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 12 }}>
              {new Date(detail.date).toLocaleString()} · {detail.questionsAnswered ?? 0} questions
            </p>
            <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px' }}>{detail.score}%</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{detail.feedbackSummary}</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <Button onClick={() => { setDetailId(null); navigate('/results', { state: { interviewId: detail.id } }) }}>
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

const searchStyle = {
  width: '100%', padding: '9px 14px',
  backgroundColor: 'var(--surface-muted)', border: '1.5px solid var(--border-strong)',
  borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
  fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
}
