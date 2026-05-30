import { useState }       from 'react'
import { useNavigate }    from 'react-router-dom'
import { useAuth }        from '../context/AuthContext'
import Card               from '../components/ui/Card'
import Button             from '../components/ui/Button'
import Badge              from '../components/ui/Badge'
import EmptyState         from '../components/ui/EmptyState'
import StatCard           from '../components/ui/StatCard'
import SectionHeader      from '../components/ui/SectionHeader'
import Heatmap            from '../components/ui/Heatmap'
import Modal              from '../components/Modal'
import { showToast }      from '../components/Toast'
import { EMPTY_INTERVIEWS, EMPTY_ACTIVITY_LOG, ACHIEVEMENT_DEFINITIONS } from '../data/initialState'
import {
  calculateAverageScore, calculateBestScore, calculateCurrentStreak,
  calculateLongestStreak, getSkillMatrix, getUnlockedAchievements,
  getProfileCompletion, formatScore, formatCount,
} from '../utils/analytics'

const interviews  = EMPTY_INTERVIEWS
const activityLog = EMPTY_ACTIVITY_LOG

const LEVEL_BADGE = { Beginner:'warning', Intermediate:'info', Advanced:'success' }

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState({
    name:       user?.name       ?? '',
    bio:        user?.bio        ?? '',
    college:    user?.college    ?? '',
    degree:     user?.degree     ?? '',
    gradYear:   user?.gradYear   ?? '',
    targetRole: user?.targetRole ?? '',
    expLevel:   user?.expLevel   ?? 'Student',
    location:   user?.location   ?? '',
    github:     user?.github     ?? '',
    linkedin:   user?.linkedin   ?? '',
    portfolio:  user?.portfolio  ?? '',
  })

  const initials  = user?.name ? user.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) : '?'
  const joined    = user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-US',{month:'long',year:'numeric'}) : 'Recently'
  const { pct: completion, missing } = getProfileCompletion(user)

  const avgScore  = calculateAverageScore(interviews)
  const bestScore = calculateBestScore(interviews)
  const streak    = calculateCurrentStreak(activityLog)
  const longest   = calculateLongestStreak(activityLog)
  const skills    = getSkillMatrix(interviews)
  const achieves  = getUnlockedAchievements(
    { interviewsCompleted:interviews.length, currentStreak:streak, bestScore, topicsPracticed:skills.length },
    ACHIEVEMENT_DEFINITIONS
  )

  const STATS = [
    { label:'Total interviews',   value: formatCount(interviews.length) },
    { label:'Average score',      value: formatScore(avgScore)          },
    { label:'Best score',         value: formatScore(bestScore)         },
    { label:'Current streak',     value: `${formatCount(streak)}d`      },
    { label:'Longest streak',     value: `${formatCount(longest)}d`     },
    { label:'Topics practiced',   value: formatCount(skills.length)     },
  ]

  function saveEdit() {
    if (form.name.trim().length < 2) { showToast('Name too short','error'); return }
    updateUser(form)
    setEditOpen(false)
    showToast('Profile updated')
  }

  return (
    <div style={S.page} className="page-enter">
      <div style={S.container}>

        {/* Completion banner */}
        {completion < 100 && (
          <Card style={{ marginBottom:20, padding:'16px 20px', borderColor:'var(--brand-light)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:14 }}>
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ backgroundColor:'var(--brand-light)', color:'var(--brand-text)', fontSize:13, fontWeight:700, padding:'7px 14px', borderRadius:8 }}>
                  {completion}%
                </div>
                <div>
                  <p style={{ color:'var(--text-primary)', fontSize:14, fontWeight:600, margin:'0 0 2px' }}>Complete your profile</p>
                  <p style={{ color:'var(--text-muted)', fontSize:12, margin:0 }}>
                    Add {missing.slice(0,3).join(', ')} to improve AI recommendations
                  </p>
                </div>
              </div>
              <Button size="sm" variant="secondary" onClick={() => setEditOpen(true)}>
                Complete profile
              </Button>
            </div>
            <div style={{ height:4, backgroundColor:'var(--border)', borderRadius:2, overflow:'hidden', marginTop:14 }}>
              <div style={{ height:'100%', width:`${completion}%`, backgroundColor:'var(--brand)', borderRadius:2, transition:'width 0.5s' }} />
            </div>
          </Card>
        )}

        {/* Header */}
        <Card style={{ marginBottom:20, padding:'28px 32px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:20 }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:20, flex:1 }}>
              <div style={{ position:'relative', flexShrink:0 }}>
                <div style={S.avatar}>{initials}</div>
                <div style={S.verifiedDot}>✓</div>
              </div>
              <div>
                <h1 style={{ color:'var(--text-primary)', fontSize:22, fontWeight:800, margin:'0 0 3px', letterSpacing:'-0.02em' }}>
                  {user?.name}
                </h1>
                <p style={{ color:'var(--text-muted)', fontSize:13, margin:'0 0 8px' }}>{user?.email}</p>
                {user?.targetRole
                  ? <Badge variant="brand" style={{ marginBottom:10 }}>{user.targetRole}</Badge>
                  : <button style={S.missingLink} onClick={() => setEditOpen(true)}>+ Set target role</button>
                }
                <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:10 }}>
                  <span style={S.metaChip}>Member since {joined}</span>
                  {user?.college  && <span style={S.metaChip}>{user.college}</span>}
                  {user?.location && <span style={S.metaChip}>{user.location}</span>}
                </div>
                <div style={{ display:'flex', gap:8, marginTop:10 }}>
                  {user?.github    && <a href={user.github}    target="_blank" rel="noreferrer" style={S.socialLink}>GitHub</a>}
                  {user?.linkedin  && <a href={user.linkedin}  target="_blank" rel="noreferrer" style={S.socialLink}>LinkedIn</a>}
                  {user?.portfolio && <a href={user.portfolio} target="_blank" rel="noreferrer" style={S.socialLink}>Portfolio</a>}
                </div>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>Edit profile</Button>
          </div>
        </Card>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:12, marginBottom:20 }} className="kpi-grid">
          {STATS.map((s,i) => <StatCard key={i} label={s.label} value={s.value} />)}
        </div>

        {/* Heatmap */}
        <Card style={{ marginBottom:20 }}>
          <SectionHeader title="Practice activity" desc="Last 52 weeks — all activity types" />
          <Heatmap activityLog={activityLog} />
        </Card>

        {/* Details + preferences */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }} className="two-col">
          <Card>
            <SectionHeader title="Profile details" />
            {[
              ['Full name',   user?.name],
              ['Email',       user?.email],
              ['College',     user?.college],
              ['Degree',      user?.degree],
              ['Grad year',   user?.gradYear],
              ['Experience',  user?.expLevel || 'Student'],
              ['Location',    user?.location],
            ].map(([label, value],i) => (
              <div key={i} style={S.infoRow}>
                <span style={{ color:'var(--text-muted)', fontSize:13 }}>{label}</span>
                <span style={{ color: value ? 'var(--text-primary)' : 'var(--text-faint)', fontSize:13, fontWeight:500 }}>
                  {value || 'Not added'}
                </span>
              </div>
            ))}
          </Card>
          <Card>
            <SectionHeader title="Career preferences" />
            {[
              ['Target role',  user?.targetRole],
              ['Goal',         'Placement preparation'],
              ['Difficulty',   'Medium'],
              ['Job type',     'Internship'],
            ].map(([label, value],i) => (
              <div key={i} style={S.infoRow}>
                <span style={{ color:'var(--text-muted)', fontSize:13 }}>{label}</span>
                <span style={{ color: value ? 'var(--text-primary)' : 'var(--text-faint)', fontSize:13, fontWeight:500 }}>
                  {value || 'Not set'}
                </span>
              </div>
            ))}
            <div style={{ marginTop:16 }}>
              <p style={{ color:'var(--text-muted)', fontSize:12, fontWeight:600, marginBottom:8, textTransform:'uppercase', letterSpacing:'0.04em' }}>
                Preferred topics
              </p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {['React','Node.js','DSA'].map(t => <Badge key={t} variant="brand">{t}</Badge>)}
              </div>
            </div>
          </Card>
        </div>

        {/* Skill matrix */}
        <Card style={{ marginBottom:20 }}>
          <SectionHeader title="Skill matrix" desc="Calculated from your interview performance" />
          {skills.length === 0
            ? <EmptyState compact
                icon="📊"
                title="No skill data yet"
                desc="Complete interviews to build your skill matrix."
                action={{ label:'Start interview', onClick:() => navigate('/interview') }}
              />
            : <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:12 }} className="skill-grid">
                {skills.map((sk,i) => (
                  <div key={i} style={S.skillCard}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                      <span style={{ color:'var(--text-primary)', fontSize:14, fontWeight:600 }}>{sk.skill}</span>
                      <Badge variant={LEVEL_BADGE[sk.level]}>{sk.level}</Badge>
                    </div>
                    <div style={{ display:'flex', gap:14, marginBottom:10 }}>
                      <span style={{ color:'var(--text-muted)', fontSize:12 }}>{sk.attempts} attempts</span>
                      <span style={{ color:'var(--text-muted)', fontSize:12 }}>avg {sk.avgScore}%</span>
                    </div>
                    <div style={{ height:4, backgroundColor:'var(--border)', borderRadius:2, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${sk.avgScore}%`, backgroundColor:'var(--brand)', borderRadius:2 }} />
                    </div>
                  </div>
                ))}
              </div>
          }
        </Card>

        {/* Achievements */}
        <Card style={{ marginBottom:20 }}>
          <SectionHeader title="Achievements" />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:12 }}>
            {achieves.map((a,i) => (
              <div key={i} style={{ ...S.achieveCard, opacity: a.earned ? 1 : 0.35 }}>
                <span style={{ fontSize:26, marginBottom:8, display:'block' }}>
                  {a.icon==='award'?'🎯':a.icon==='flame'?'🔥':a.icon==='zap'?'⚡':a.icon==='trophy'?'🏆':a.icon==='book-open'?'📚':'🎤'}
                </span>
                <p style={{ color:'var(--text-primary)', fontSize:13, fontWeight:600, margin:'0 0 4px' }}>{a.label}</p>
                <p style={{ color:'var(--text-muted)', fontSize:11, lineHeight:1.4, margin:0 }}>{a.desc}</p>
                {a.earned && <Badge variant="success" style={{ marginTop:8 }}>Earned</Badge>}
              </div>
            ))}
          </div>
        </Card>

        {/* Activity timeline */}
        <Card>
          <SectionHeader title="Activity timeline" />
          <EmptyState compact
            icon="📋"
            title="No activity yet"
            desc="Complete interviews, save questions, or upload a resume to build your timeline."
            action={{ label:'Start interview', onClick:() => navigate('/interview') }}
          />
        </Card>

      </div>

      {/* Edit modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit profile">
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {[
            ['Full name',   'name',       'text',  'Lohith Reddy'],
            ['Target role', 'targetRole', 'text',  'Full Stack Developer Intern'],
            ['College',     'college',    'text',  'IIIT Nagpur'],
            ['Degree',      'degree',     'text',  'B.Tech CSE'],
            ['Grad year',   'gradYear',   'text',  '2026'],
            ['Location',    'location',   'text',  'Hyderabad, India'],
            ['GitHub URL',  'github',     'url',   'https://github.com/...'],
            ['LinkedIn',    'linkedin',   'url',   'https://linkedin.com/in/...'],
            ['Portfolio',   'portfolio',  'url',   'https://myportfolio.com'],
          ].map(([label, key, type, placeholder]) => (
            <div key={key}>
              <label style={S.modalLabel}>{label}</label>
              <input style={S.modalInput} type={type} placeholder={placeholder}
                value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
            </div>
          ))}
          <div>
            <label style={S.modalLabel}>Bio</label>
            <textarea style={{ ...S.modalInput, resize:'vertical', minHeight:70, lineHeight:1.5 }}
              value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
              placeholder="Short bio..." rows={3} />
          </div>
          <div style={{ display:'flex', gap:10, marginTop:4 }}>
            <Button onClick={saveEdit}>Save changes</Button>
            <Button variant="secondary" onClick={() => setEditOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

const S = {
  page:      { minHeight:'calc(100vh - 64px)', backgroundColor:'var(--bg-app)', padding:'var(--sp-xl,32px) 20px' },
  container: { maxWidth:1100, margin:'0 auto' },
  avatar: {
    width:72, height:72, borderRadius:'50%',
    backgroundColor:'var(--brand-light)', border:'2px solid var(--brand)',
    color:'var(--brand-text)', fontSize:24, fontWeight:800,
    display:'flex', alignItems:'center', justifyContent:'center',
  },
  verifiedDot: {
    position:'absolute', bottom:2, right:2,
    width:20, height:20, borderRadius:'50%',
    backgroundColor:'var(--success)', color:'#fff',
    fontSize:10, fontWeight:700,
    display:'flex', alignItems:'center', justifyContent:'center',
    border:'2px solid var(--bg-card)',
  },
  missingLink: { background:'none', border:'none', color:'var(--brand)', fontSize:13, fontWeight:600, cursor:'pointer', padding:0 },
  metaChip: {
    backgroundColor:'var(--bg-surface)', color:'var(--text-secondary)',
    fontSize:12, padding:'3px 10px', borderRadius:100, border:'1px solid var(--border)',
  },
  socialLink: {
    color:'var(--brand-text)', fontSize:12, fontWeight:600,
    padding:'4px 10px', borderRadius:6,
    backgroundColor:'var(--brand-light)', border:'1px solid var(--brand-light)',
  },
  infoRow: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid var(--border)' },
  skillCard: {
    backgroundColor:'var(--bg-surface)', border:'1px solid var(--border)',
    borderRadius:'var(--radius-sm)', padding:'14px 16px',
  },
  achieveCard: {
    backgroundColor:'var(--bg-surface)', border:'1px solid var(--border)',
    borderRadius:'var(--radius-md)', padding:'18px 14px', textAlign:'center',
  },
  modalLabel: { display:'block', color:'var(--text-secondary)', fontSize:12, fontWeight:600, marginBottom:5 },
  modalInput: {
    width:'100%', padding:'9px 12px',
    backgroundColor:'var(--bg-surface)', border:'1.5px solid var(--border-strong)',
    borderRadius:'var(--radius-sm)', color:'var(--text-primary)',
    fontSize:14, outline:'none', boxSizing:'border-box', fontFamily:'inherit',
  },
}