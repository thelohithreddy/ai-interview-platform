import { useNavigate }    from 'react-router-dom'
import { useAuth }        from '../context/AuthContext'
import { useTheme }       from '../context/ThemeContext'
import { useState }       from 'react'
import Card               from '../components/ui/Card'
import Button             from '../components/ui/Button'
import StatCard           from '../components/ui/StatCard'
import Badge              from '../components/ui/Badge'
import EmptyState         from '../components/ui/EmptyState'
import SectionHeader      from '../components/ui/SectionHeader'
import Heatmap            from '../components/ui/Heatmap'
import {
  EMPTY_USER_STATS, EMPTY_INTERVIEWS, EMPTY_ACTIVITY_LOG,
  ACHIEVEMENT_DEFINITIONS, INTERVIEW_MODES,
} from '../data/initialState'
import {
  calculateAverageScore, calculateBestScore, calculateReadinessScore,
  calculateCurrentStreak, getUnlockedAchievements, getModeStats,
  formatScore, formatCount,
} from '../utils/analytics'

// ── In Phase 2, replace these with API calls ──
const interviews   = EMPTY_INTERVIEWS
const activityLog  = EMPTY_ACTIVITY_LOG
const savedCount   = 0
const roadmap      = null

export default function DashboardPage() {
  const { user }   = useAuth()
  const { accent } = useTheme()
  const navigate   = useNavigate()

  const [aiQuery,   setAiQuery]   = useState('')
  const [aiAnswer,  setAiAnswer]  = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const firstName     = user?.name?.split(' ')[0] ?? 'there'
  const avgScore      = calculateAverageScore(interviews)
  const bestScore     = calculateBestScore(interviews)
  const readiness     = calculateReadinessScore(interviews)
  const streak        = calculateCurrentStreak(activityLog)
  const modeStats     = getModeStats(interviews)
  const achievements  = getUnlockedAchievements(
    { interviewsCompleted: interviews.length, currentStreak: streak, bestScore, topicsPracticed: 0 },
    ACHIEVEMENT_DEFINITIONS
  )

  const KPI = [
    { label: 'Interviews',      value: formatCount(interviews.length) },
    { label: 'Avg score',       value: formatScore(avgScore)          },
    { label: 'Best score',      value: formatScore(bestScore)         },
    { label: 'Questions saved', value: formatCount(savedCount)        },
    { label: 'Streak',          value: `${formatCount(streak)}d`      },
    { label: 'Resume score',    value: '—'                            },
  ]

  async function askCoach() {
    if (!aiQuery.trim() || aiLoading) return
    setAiLoading(true); setAiAnswer('')
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', max_tokens: 300,
          system: 'You are a concise AI career coach for software engineering interview prep. Give actionable advice in 2-3 sentences.',
          messages: [{ role: 'user', content: aiQuery }],
        }),
      })
      const data = await res.json()
      setAiAnswer(data.content?.map(b => b.text||'').join('') || 'No response')
    } catch { setAiAnswer('Could not reach AI. Check your connection.') }
    finally { setAiLoading(false) }
  }

  return (
    <div style={S.page} className="page-enter">
      <div style={S.container}>

        {/* ── Hero ── */}
        <Card style={{ marginBottom: 24, padding: '28px 32px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:20 }}>
            <div style={{ flex:1, minWidth:260 }}>
              <div style={{ marginBottom: 10 }}>
                {user?.targetRole
                  ? <Badge variant="brand">{user.targetRole}</Badge>
                  : <button style={{ ...S.textLink }} onClick={() => navigate('/settings')}>Set your target role →</button>
                }
              </div>
              <h1 style={S.heroTitle}>
                Welcome back, <span style={{ color:'var(--brand)' }}>{firstName}</span>
              </h1>
              <p style={S.heroSub}>
                {interviews.length < 3
                  ? 'Complete at least 3 interviews to unlock your readiness score.'
                  : `Interview readiness: ${readiness}%`
                }
              </p>
              <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginTop:20 }}>
                <Button onClick={() => navigate('/interview')}>Start interview</Button>
                <Button variant="secondary" onClick={() => navigate('/settings')}>Set goals</Button>
              </div>
            </div>
            {readiness != null && (
              <div style={S.ringWrap}>
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="8"/>
                  <circle cx="50" cy="50" r="40" fill="none"
                    stroke="var(--brand)" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${2*Math.PI*40*readiness/100} ${2*Math.PI*40*(1-readiness/100)}`}
                    strokeDashoffset={2*Math.PI*40*0.25}
                    style={{ transition:'stroke-dasharray 0.8s ease' }}
                  />
                  <text x="50" y="45" textAnchor="middle" fill="var(--text-primary)" fontSize="18" fontWeight="700">{readiness}%</text>
                  <text x="50" y="60" textAnchor="middle" fill="var(--text-muted)" fontSize="9">Readiness</text>
                </svg>
              </div>
            )}
          </div>
        </Card>

        {/* ── KPI ── */}
        <div style={{ ...S.kpiGrid, marginBottom:24 }} className="kpi-grid">
          {KPI.map((k,i) => <StatCard key={i} label={k.label} value={k.value} />)}
        </div>

        <div style={S.twoCol} className="two-col">

          {/* ── LEFT ── */}
          <div style={S.col}>

            {/* Practice modes */}
            <Card>
              <SectionHeader title="Practice by mode" />
              <div style={S.modesGrid} className="modes-grid">
                {INTERVIEW_MODES.map(m => {
                  const ms = modeStats[m.id] || { attempts:0, totalScore:0 }
                  const avg = ms.attempts > 0 ? Math.round(ms.totalScore/ms.attempts) : null
                  return (
                    <button key={m.id} style={S.modeCard}
                      onClick={() => navigate('/interview')}>
                      <p style={S.modeLabel}>{m.label}</p>
                      <p style={S.modeSub}>{m.sub}</p>
                      <p style={S.modeMeta}>
                        {ms.attempts} attempts · avg {avg != null ? `${avg}%` : '—'}
                      </p>
                    </button>
                  )
                })}
              </div>
            </Card>

            {/* Activity heatmap */}
            <Card>
              <SectionHeader title="Practice activity" desc="Last 52 weeks" />
              <Heatmap activityLog={activityLog} />
            </Card>

            {/* AI Career Coach */}
            <Card>
              <SectionHeader title="AI Career Coach" />
              <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:14 }}>
                {['What should I study next?','How interview-ready am I?','How do I improve at DSA?'].map((q,i) => (
                  <button key={i} style={S.chip} onClick={() => setAiQuery(q)}>{q}</button>
                ))}
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <input style={S.input} value={aiQuery}
                  onChange={e => setAiQuery(e.target.value)}
                  onKeyDown={e => e.key==='Enter' && askCoach()}
                  placeholder="Ask your AI coach..." />
                <Button onClick={askCoach} disabled={aiLoading || !aiQuery.trim()} size="sm">
                  {aiLoading ? '…' : '→'}
                </Button>
              </div>
              {aiLoading && <div style={S.coachAnswer}><div className="typing-dots"><span/><span/><span/></div></div>}
              {aiAnswer && !aiLoading && (
                <div style={S.coachAnswer}>
                  <p style={{ color:'var(--text-secondary)', fontSize:14, lineHeight:1.65, margin:0 }}>{aiAnswer}</p>
                </div>
              )}
            </Card>

          </div>

          {/* ── RIGHT ── */}
          <div style={S.col}>

            {/* Recommendations */}
            <Card>
              <SectionHeader title="AI Recommendations" />
              {interviews.length < 3
                ? <EmptyState compact
                    icon="💡"
                    title="Not enough data yet"
                    desc="Complete at least 3 interviews to unlock AI recommendations."
                    action={{ label: 'Start interview', onClick: () => navigate('/interview') }}
                  />
                : <p style={{ color:'var(--text-secondary)', fontSize:14 }}>Recommendations appear here after analysis.</p>
              }
            </Card>

            {/* Streak */}
            <Card>
              <SectionHeader title="Practice streak" />
              <div style={{ display:'flex', alignItems:'center', gap:24, marginBottom:20 }}>
                <div style={{ textAlign:'center' }}>
                  <span style={{ display:'block', color:'var(--brand)', fontSize:44, fontWeight:800, lineHeight:1, letterSpacing:'-0.03em' }}>
                    {streak}
                  </span>
                  <span style={{ color:'var(--text-muted)', fontSize:12, marginTop:4, display:'block' }}>day streak</span>
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ color:'var(--text-secondary)', fontSize:13, marginBottom:8 }}>
                    Goal: 14 days
                  </p>
                  <div style={{ height:6, backgroundColor:'var(--border)', borderRadius:3, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${Math.min(100,(streak/14)*100)}%`, backgroundColor:'var(--brand)', borderRadius:3 }} />
                  </div>
                </div>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d,i) => (
                  <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
                    <div style={{ width:28, height:28, borderRadius:'50%', backgroundColor:'var(--border)' }} />
                    <span style={{ color:'var(--text-faint)', fontSize:11 }}>{d}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Roadmap */}
            <Card>
              <SectionHeader title="Learning roadmap" />
              {roadmap
                ? <p style={{ color:'var(--text-secondary)', fontSize:14 }}>Roadmap loaded.</p>
                : <EmptyState compact
                    icon="🗺️"
                    title="No roadmap yet"
                    desc="Generate a personalized learning roadmap based on your target role."
                    action={{ label: 'Generate roadmap', onClick: () => navigate('/settings') }}
                  />
              }
            </Card>

            {/* Achievements */}
            <Card>
              <SectionHeader title="Achievements"
                action={{ label: 'View all', onClick: () => navigate('/profile') }} />
              <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
                {achievements.map((a,i) => (
                  <div key={i} style={{ ...S.achieveChip, opacity: a.earned ? 1 : 0.35 }}>
                    <span style={{ fontSize:18 }}>
                      {a.icon === 'award'     ? '🎯' :
                       a.icon === 'flame'     ? '🔥' :
                       a.icon === 'zap'       ? '⚡' :
                       a.icon === 'trophy'    ? '🏆' :
                       a.icon === 'book-open' ? '📚' : '🎤'}
                    </span>
                    <span style={{ color:'var(--text-secondary)', fontSize:12, fontWeight:500 }}>{a.label}</span>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        </div>

        {/* ── Recent interviews ── */}
        <Card style={{ marginTop: 0 }}>
          <SectionHeader title="Recent interviews"
            action={interviews.length > 0 ? { label:'View all', onClick:() => navigate('/history') } : undefined} />
          {interviews.length === 0
            ? <EmptyState
                icon="🎤"
                title="No interviews yet"
                desc="Complete your first AI mock interview to see your results here."
                action={{ label:'Start interview', onClick:() => navigate('/interview') }}
              />
            : interviews.slice(0,5).map((iv,i) => (
                <div key={i} style={S.ivRow}>
                  <div>
                    <p style={{ color:'var(--text-primary)', fontSize:14, fontWeight:600, margin:'0 0 2px' }}>{iv.topic} — {iv.mode}</p>
                    <p style={{ color:'var(--text-muted)', fontSize:12, margin:0 }}>{new Date(iv.date).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={iv.score >= 80 ? 'success' : iv.score >= 60 ? 'warning' : 'danger'}>
                    {iv.score}%
                  </Badge>
                </div>
              ))
          }
        </Card>

      </div>
    </div>
  )
}

const S = {
  page:      { minHeight:'calc(100vh - 64px)', backgroundColor:'var(--bg-app)', padding:'var(--sp-xl, 32px) 20px' },
  container: { maxWidth:1200, margin:'0 auto' },
  heroTitle: { color:'var(--text-primary)', fontSize:'clamp(22px,4vw,28px)', fontWeight:800, margin:'8px 0', letterSpacing:'-0.02em' },
  heroSub:   { color:'var(--text-secondary)', fontSize:15 },
  ringWrap:  { flexShrink:0 },
  kpiGrid:   { display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:14 },
  twoCol:    { display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 },
  col:       { display:'flex', flexDirection:'column', gap:20 },
  modesGrid: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 },
  modeCard: {
    backgroundColor:'var(--bg-surface)', border:'1px solid var(--border)',
    borderRadius:'var(--radius-sm)', padding:'12px 10px', textAlign:'center',
    cursor:'pointer', transition:'all 0.15s',
  },
  modeLabel: { color:'var(--text-primary)', fontSize:12, fontWeight:600, margin:'0 0 2px' },
  modeSub:   { color:'var(--text-muted)', fontSize:11, margin:'0 0 4px', lineHeight:1.4 },
  modeMeta:  { color:'var(--text-faint)', fontSize:10, margin:0 },
  input: {
    flex:1, padding:'9px 12px',
    backgroundColor:'var(--bg-surface)', border:'1.5px solid var(--border-strong)',
    borderRadius:'var(--radius-sm)', color:'var(--text-primary)',
    fontSize:14, outline:'none', fontFamily:'inherit',
  },
  chip: {
    backgroundColor:'var(--bg-surface)', border:'1px solid var(--border)',
    color:'var(--text-secondary)', padding:'5px 12px',
    borderRadius:100, fontSize:12, cursor:'pointer',
  },
  coachAnswer: {
    marginTop:12, padding:'12px 14px',
    backgroundColor:'var(--bg-surface)', border:'1px solid var(--border)',
    borderRadius:'var(--radius-sm)',
  },
  achieveChip: {
    display:'flex', alignItems:'center', gap:6,
    backgroundColor:'var(--bg-surface)', border:'1px solid var(--border)',
    borderRadius:8, padding:'8px 12px',
  },
  ivRow: {
    display:'flex', justifyContent:'space-between', alignItems:'center',
    padding:'12px 0', borderBottom:'1px solid var(--border)',
  },
  textLink: {
    background:'none', border:'none', color:'var(--brand)',
    fontSize:13, fontWeight:600, cursor:'pointer', padding:0,
  },
}