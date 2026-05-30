import { useState }  from 'react'
import { useNavigate } from 'react-router-dom'
import Card          from '../components/ui/Card'
import Button        from '../components/ui/Button'
import Badge         from '../components/ui/Badge'
import EmptyState    from '../components/ui/EmptyState'
import SectionHeader from '../components/ui/SectionHeader'
import { EMPTY_INTERVIEWS } from '../data/initialState'

const interviews = EMPTY_INTERVIEWS // Replace with API call

const TOPICS = ['All','JavaScript','React','Node.js','System Design','DSA','Behavioral']
const MODES  = ['All','Frontend','Backend','Full Stack','DSA','Behavioral','System Design','HR','Rapid Fire']
const DIFFS  = ['All','Easy','Medium','Hard']

export default function HistoryPage() {
  const navigate = useNavigate()
  const [topic,  setTopic]  = useState('All')
  const [mode,   setMode]   = useState('All')
  const [diff,   setDiff]   = useState('All')
  const [search, setSearch] = useState('')

  const filtered = interviews.filter(iv =>
    (topic === 'All' || iv.topic === topic) &&
    (mode  === 'All' || iv.mode  === mode)  &&
    (diff  === 'All' || iv.difficulty === diff) &&
    (!search || iv.topic?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div style={S.page} className="page-enter">
      <div style={S.container}>

        <div style={S.header}>
          <div>
            <h1 style={S.title}>Interview history</h1>
            <p style={S.subtitle}>All your past mock interview sessions</p>
          </div>
          <Button onClick={() => navigate('/interview')}>New interview</Button>
        </div>

        {interviews.length > 0 && (
          <Card style={{ marginBottom:20, padding:'16px 20px' }}>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <input style={S.search} value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by topic..." />
              <div style={{ display:'flex', flexWrap:'wrap', gap:20 }}>
                <Filter label="Topic"      options={TOPICS} value={topic} onChange={setTopic} />
                <Filter label="Mode"       options={MODES}  value={mode}  onChange={setMode}  />
                <Filter label="Difficulty" options={DIFFS}  value={diff}  onChange={setDiff}  />
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
              action={{ label:'Start interview', onClick:() => navigate('/interview') }}
            />
          </Card>
        ) : filtered.length === 0 ? (
          <Card>
            <EmptyState compact
              icon="🔍"
              title="No matching interviews"
              desc="Try adjusting your filters."
              action={{ label:'Clear filters', onClick:() => { setTopic('All'); setMode('All'); setDiff('All'); setSearch('') } }}
            />
          </Card>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {filtered.map((iv,i) => (
              <Card key={i} hover style={{ padding:'18px 22px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                      <span style={{ color:'var(--text-primary)', fontSize:15, fontWeight:600 }}>{iv.topic}</span>
                      <Badge variant="default">{iv.mode}</Badge>
                      <Badge variant={iv.difficulty==='Hard'?'danger':iv.difficulty==='Medium'?'warning':'success'}>
                        {iv.difficulty}
                      </Badge>
                    </div>
                    <p style={{ color:'var(--text-muted)', fontSize:12, margin:0 }}>
                      {new Date(iv.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                      {iv.duration && ` · ${iv.duration} min`}
                    </p>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <Badge variant={iv.score >= 80 ? 'success' : iv.score >= 60 ? 'warning' : 'danger'} style={{ fontSize:14, padding:'4px 14px' }}>
                      {iv.score}%
                    </Badge>
                    <Button variant="ghost" size="sm">View details</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
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
  page:     { minHeight:'calc(100vh - 64px)', backgroundColor:'var(--bg-app)', padding:'var(--sp-xl,32px) 20px' },
  container:{ maxWidth:960, margin:'0 auto' },
  header:   { display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16, marginBottom:24 },
  title:    { color:'var(--text-primary)', fontSize:'clamp(20px,4vw,26px)', fontWeight:800, margin:'0 0 4px', letterSpacing:'-0.02em' },
  subtitle: { color:'var(--text-muted)', fontSize:14, margin:0 },
  search:   { width:'100%', padding:'9px 14px', backgroundColor:'var(--bg-surface)', border:'1.5px solid var(--border-strong)', borderRadius:'var(--radius-sm)', color:'var(--text-primary)', fontSize:14, outline:'none', fontFamily:'inherit', boxSizing:'border-box' },
}