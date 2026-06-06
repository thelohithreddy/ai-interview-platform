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
import { showToast } from '../components/ui/Toast'

const TOPICS = ['All', 'JavaScript', 'React', 'Node.js', 'System Design', 'DSA', 'Behavioral', 'Frontend', 'Backend', 'Full Stack', 'HR']
const DIFFS = ['All', 'Easy', 'Medium', 'Hard']

export default function SavedQuestionsPage() {
  const navigate = useNavigate()
  const { savedQuestions, removeSavedQuestion } = useAppData()
  const [search, setSearch] = useState('')
  const [topic, setTopic] = useState('All')
  const [diff, setDiff] = useState('All')
  const [sort, setSort] = useState('newest')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const debouncedSearch = useDebouncedValue(search)

  const filtered = useMemo(() => savedQuestions
    .filter(q =>
      (topic === 'All' || q.topic === topic) &&
      (diff === 'All' || q.difficulty === diff) &&
      (!debouncedSearch || q.question.toLowerCase().includes(debouncedSearch.toLowerCase()))
    )
    .sort((a, b) => sort === 'newest'
      ? new Date(b.savedAt) - new Date(a.savedAt)
      : new Date(a.savedAt) - new Date(b.savedAt)
    ), [savedQuestions, topic, diff, debouncedSearch, sort])

  function doDelete() {
    removeSavedQuestion(deleteTarget)
    setDeleteTarget(null)
    showToast('Question removed')
  }

  return (
    <PageShell
      title="Saved questions"
      subtitle="Your personal question bank"
      action={<Button onClick={() => navigate('/interview')}>Start practice</Button>}
      maxWidth={960}
    >
      {savedQuestions.length === 0 ? (
        <Card>
          <EmptyState
            icon="🔖"
            title="No saved questions yet"
            desc="Save questions during interviews to build your personal question bank."
            action={{ label: 'Start interview', onClick: () => navigate('/interview') }}
          />
        </Card>
      ) : (
        <>
          <Card style={{ marginBottom: 20, padding: '16px 20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <input
                  style={{ ...searchStyle, flex: 1, minWidth: 200 }}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search questions..."
                />
                <select style={sortSelect} value={sort} onChange={e => setSort(e.target.value)}>
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
                <FilterBar label="Topic" options={TOPICS} value={topic} onChange={setTopic} />
                <FilterBar label="Difficulty" options={DIFFS} value={diff} onChange={setDiff} />
              </div>
            </div>
          </Card>

          {filtered.length === 0 ? (
            <Card>
              <EmptyState compact icon="🔍" title="No matching questions"
                action={{ label: 'Clear filters', onClick: () => { setSearch(''); setTopic('All'); setDiff('All') } }}
              />
            </Card>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 14 }}>
              {filtered.map(q => (
                <Card key={q.id} hover style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <Badge variant="brand">{q.topic}</Badge>
                      {q.difficulty && (
                        <Badge variant={q.difficulty === 'Hard' ? 'danger' : q.difficulty === 'Medium' ? 'warning' : 'success'}>
                          {q.difficulty}
                        </Badge>
                      )}
                    </div>
                    <span style={{ color: 'var(--text-faint)', fontSize: 11 }}>
                      {new Date(q.savedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-primary)', fontSize: 14, lineHeight: 1.65, margin: 0 }}>
                    {q.question}
                  </p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Button size="sm" onClick={() => navigate('/interview')}>Practice</Button>
                    <Button size="sm" variant="danger" style={{ marginLeft: 'auto' }} onClick={() => setDeleteTarget(q.id)}>
                      Remove
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remove question" danger>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
          Remove this question from your saved list?
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="danger" onClick={doDelete}>Yes, remove</Button>
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
        </div>
      </Modal>
    </PageShell>
  )
}

const searchStyle = {
  padding: '9px 14px', backgroundColor: 'var(--surface-muted)',
  border: '1.5px solid var(--border-strong)', borderRadius: 'var(--radius-sm)',
  color: 'var(--text-primary)', fontSize: 14, outline: 'none', fontFamily: 'inherit',
}
const sortSelect = {
  padding: '9px 12px', backgroundColor: 'var(--surface-muted)',
  border: '1.5px solid var(--border-strong)', borderRadius: 'var(--radius-sm)',
  color: 'var(--text-primary)', fontSize: 13, outline: 'none', cursor: 'pointer',
}
