import { useState }  from 'react'
import { useNavigate } from 'react-router-dom'
import Card          from '../components/ui/Card'
import Button        from '../components/ui/Button'
import Badge         from '../components/ui/Badge'
import EmptyState    from '../components/ui/EmptyState'
import Modal         from '../components/Modal'
import { showToast } from '../components/Toast'
import { EMPTY_SAVED } from '../data/initialState'

const TOPICS = ['All','JavaScript','React','Node.js','System Design','DSA','Behavioral']
const DIFFS  = ['All','Easy','Medium','Hard']

export default function SavedQuestionsPage() {
  const navigate = useNavigate()
  const [saved, setSaved]         = useState(EMPTY_SAVED) // Replace with API
  const [search, setSearch]       = useState('')
  const [topic, setTopic]         = useState('All')
  const [diff, setDiff]           = useState('All')
  const [sort, setSort]           = useState('newest')
  const [deleteTarget, setTarget] = useState(null)

  const filtered = saved
    .filter(q =>
      (topic === 'All' || q.topic === topic) &&
      (diff  === 'All' || q.difficulty === diff) &&
      (!search || q.question.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a,b) => sort === 'newest'
      ? new Date(b.savedAt) - new Date(a.savedAt)
      : new Date(a.savedAt) - new Date(b.savedAt)
    )

  function doDelete() {
    setSaved(p => p.filter(q => q.id !== deleteTarget))
    setTarget(null)
    showToast('Question removed')
  }

  return (
    <div style={S.page} className="page-enter">
      <div style={S.container}>

        <div style={S.header}>
          <div>
            <h1 style={S.title}>Saved questions</h1>
            <p style={S.subtitle}>Your personal question bank</p>
          </div>
          <Button onClick={() => navigate('/interview')}>Start practice</Button>
        </div>

        {saved.length === 0 ? (
          <Card>
            <EmptyState
              icon="🔖"
              title="No saved questions yet"
              desc="Save questions during interviews to build your personal question bank. They'll appear here, organized by topic and difficulty."
              action={{ label:'Start interview', onClick:() => navigate('/interview') }}
            />
          </Card>
        ) : (
          <>
            <Card style={{ marginBottom:20, padding:'16px 20px' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <div style={{ display:'flex', gap:10 }}>
                  <input style={{ ...S.search, flex:1 }} value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search questions..." />
                  <select style={S.sortSelect} value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                  </select>
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:20 }}>
                  <Filter label="Topic"      options={TOPICS} value={topic} onChange={setTopic} />
                  <Filter label="Difficulty" options={DIFFS}  value={diff}  onChange={setDiff}  />
                </div>
              </div>
            </Card>

            {filtered.length === 0 ? (
              <Card>
                <EmptyState compact icon="🔍" title="No matching questions"
                  action={{ label:'Clear filters', onClick:() => { setSearch(''); setTopic('All'); setDiff('All') } }}
                />
              </Card>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:14 }}>
                {filtered.map(q => (
                  <Card key={q.id} hover style={{ display:'flex', flexDirection:'column', gap:12 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <div style={{ display:'flex', gap:6 }}>
                        <Badge variant="brand">{q.topic}</Badge>
                        <Badge variant={q.difficulty==='Hard'?'danger':q.difficulty==='Medium'?'warning':'success'}>
                          {q.difficulty}
                        </Badge>
                      </div>
                      <span style={{ color:'var(--text-faint)', fontSize:11 }}>
                        {new Date(q.savedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ color:'var(--text-primary)', fontSize:14, lineHeight:1.65, margin:0 }}>
                      {q.question}
                    </p>
                    <div style={{ display:'flex', gap:8 }}>
                      <Button size="sm" onClick={() => navigate('/interview')}>Practice</Button>
                      <Button size="sm" variant="ghost">View answer</Button>
                      <Button size="sm" variant="danger" style={{ marginLeft:'auto' }} onClick={() => setTarget(q.id)}>
                        Remove
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <Modal open={!!deleteTarget} onClose={() => setTarget(null)} title="Remove question" danger>
        <p style={{ color:'var(--text-secondary)', fontSize:14, lineHeight:1.6, marginBottom:20 }}>
          Remove this question from your saved list? You can always bookmark it again during an interview.
        </p>
        <div style={{ display:'flex', gap:10 }}>
          <Button variant="danger" onClick={doDelete}>Yes, remove</Button>
          <Button variant="secondary" onClick={() => setTarget(null)}>Cancel</Button>
        </div>
      </Modal>
    </div>
  )
}

function Filter({ label, options, value, onChange }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <span style={{ color:'var(--text-muted)', fontSize:12, fontWeight:600, whiteSpace:'nowrap' }}>{label}:</span>
      <div style={{ display:'flex', gap:4 }}>
        {options.map(o => (
          <button key={o} onClick={() => onChange(o)} style={{
            padding:'4px 10px', borderRadius:6, border:'1px solid',
            fontSize:12, cursor:'pointer', fontWeight:500,
            backgroundColor: value===o ? 'var(--brand-light)' : 'transparent',
            color:           value===o ? 'var(--brand-text)'  : 'var(--text-muted)',
            borderColor:     value===o ? 'var(--brand-light)' : 'var(--border)',
          }}>{o}</button>
        ))}
      </div>
    </div>
  )
}

const S = {
  page:      { minHeight:'calc(100vh - 64px)', backgroundColor:'var(--bg-app)', padding:'var(--sp-xl,32px) 20px' },
  container: { maxWidth:960, margin:'0 auto' },
  header:    { display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16, marginBottom:24 },
  title:     { color:'var(--text-primary)', fontSize:'clamp(20px,4vw,26px)', fontWeight:800, margin:'0 0 4px', letterSpacing:'-0.02em' },
  subtitle:  { color:'var(--text-muted)', fontSize:14, margin:0 },
  search:    { padding:'9px 14px', backgroundColor:'var(--bg-surface)', border:'1.5px solid var(--border-strong)', borderRadius:'var(--radius-sm)', color:'var(--text-primary)', fontSize:14, outline:'none', fontFamily:'inherit', boxSizing:'border-box' },
  sortSelect:{ padding:'9px 12px', backgroundColor:'var(--bg-surface)', border:'1.5px solid var(--border-strong)', borderRadius:'var(--radius-sm)', color:'var(--text-primary)', fontSize:13, outline:'none', cursor:'pointer' },
}