import { useNavigate } from 'react-router-dom'
import { useAuth }     from '../context/AuthContext'

const FEATURES = [
  {
    icon: '🤖',
    title: 'AI-powered questions',
    desc: 'Get real interview questions tailored to your role, experience level, and tech stack.',
  },
  {
    icon: '💬',
    title: 'Instant feedback',
    desc: 'Receive detailed, actionable feedback on every answer immediately after each session.',
  },
  {
    icon: '📈',
    title: 'Track your progress',
    desc: 'Visualize improvement over time with analytics, skill matrix, and session history.',
  },
]

const STEPS = [
  { n: '01', label: 'Create your account', desc: 'Free to get started — no card required.' },
  { n: '02', label: 'Choose your role',    desc: 'Frontend, backend, DSA, system design, and more.' },
  { n: '03', label: 'Practice & improve',  desc: 'Get AI feedback and iterate until you are confident.' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div style={{ backgroundColor: 'var(--app-bg)', minHeight: 'calc(100vh - 60px)' }}>

      {/* ── Hero ── */}
      <section style={S.hero}>
        <div style={S.heroBadge}>
          AI-powered interview prep
        </div>
        <h1 style={S.heroTitle}>
          Ace your next<br />
          <span style={{ color: 'var(--primary)' }}>technical interview</span>
        </h1>
        <p style={S.heroSub}>
          Practice with AI. Get real feedback. Land the job.
        </p>
        <div style={S.heroBtns}>
          <button style={S.primaryBtn}
            onClick={() => navigate(user ? '/dashboard' : '/signup')}>
            {user ? 'Go to dashboard →' : 'Start for free →'}
          </button>
          {!user && (
            <button style={S.secondaryBtn} onClick={() => navigate('/login')}>
              Sign in
            </button>
          )}
        </div>
        <p style={S.heroNote}>No credit card required · 100% free to start</p>
      </section>

      {/* ── Features ── */}
      <section style={S.section}>
        <p style={S.eyebrow}>What you get</p>
        <h2 style={S.sectionTitle}>Everything you need to prepare</h2>
        <div style={S.featureGrid}>
          {FEATURES.map((f, i) => (
            <div key={i} style={S.featureCard}>
              <div style={S.featureIconWrap}>{f.icon}</div>
              <h3 style={S.featureName}>{f.title}</h3>
              <p style={S.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ ...S.section, backgroundColor: 'var(--surface-muted)' }}>
        <div style={{ maxWidth: 'var(--page-width)', margin: '0 auto', padding: '60px 24px' }}>
          <p style={S.eyebrow}>How it works</p>
          <h2 style={S.sectionTitle}>Three steps to your dream job</h2>
          <div style={S.stepsGrid}>
            {STEPS.map((step, i) => (
              <div key={i} style={S.stepCard}>
                <span style={S.stepNum}>{step.n}</span>
                <h3 style={S.stepLabel}>{step.label}</h3>
                <p style={S.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={S.ctaSection}>
        <h2 style={S.ctaTitle}>Ready to get started?</h2>
        <p style={S.ctaSub}>
          Join thousands of developers who have improved their interview skills.
        </p>
        <button style={S.primaryBtn}
          onClick={() => navigate(user ? '/interview' : '/signup')}>
          {user ? 'Start an interview →' : 'Create free account →'}
        </button>
      </section>

    </div>
  )
}

const S = {
  hero: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', textAlign: 'center',
    padding: 'clamp(64px,10vw,120px) 24px 80px',
  },
  heroBadge: {
    display: 'inline-block',
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary-text)',
    fontSize: 13, fontWeight: 600,
    padding: '6px 16px', borderRadius: 100,
    border: '1px solid var(--primary-light)',
    marginBottom: 28, letterSpacing: '0.01em',
  },
  heroTitle: {
    fontSize: 'clamp(36px,7vw,64px)',
    fontWeight: 800, lineHeight: 1.1,
    color: 'var(--text-primary)',
    margin: '0 0 20px',
    letterSpacing: '-0.03em',
  },
  heroSub: {
    fontSize: 'clamp(16px,2.5vw,19px)',
    color: 'var(--text-secondary)',
    marginBottom: 36, maxWidth: 480,
  },
  heroBtns: {
    display: 'flex', gap: 12,
    flexWrap: 'wrap', justifyContent: 'center',
  },
  heroNote: {
    color: 'var(--text-faint)', fontSize: 13, marginTop: 16,
  },
  primaryBtn: {
    backgroundColor: 'var(--primary)', color: '#fff',
    border: '1px solid var(--primary)',
    padding: '12px 28px', borderRadius: 10,
    fontSize: 15, fontWeight: 600, cursor: 'pointer',
    transition: 'background-color 0.15s',
  },
  secondaryBtn: {
    backgroundColor: 'var(--surface)', color: 'var(--text-primary)',
    border: '1px solid var(--border-strong)',
    padding: '12px 24px', borderRadius: 10,
    fontSize: 15, fontWeight: 600, cursor: 'pointer',
  },
  section: {
    backgroundColor: 'var(--app-bg)',
  },
  eyebrow: {
    textAlign: 'center', color: 'var(--primary)',
    fontSize: 12, fontWeight: 700,
    letterSpacing: '0.1em', textTransform: 'uppercase',
    marginBottom: 12,
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: 'clamp(22px,3vw,30px)',
    fontWeight: 700, color: 'var(--text-primary)',
    marginBottom: 48, letterSpacing: '-0.02em',
  },
  featureGrid: {
    maxWidth: 'var(--page-width)',
    margin: '0 auto',
    padding: '60px 24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 20,
  },
  featureCard: {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '28px 24px',
    boxShadow: 'var(--shadow-sm)',
  },
  featureIconWrap: { fontSize: 28, marginBottom: 16 },
  featureName: {
    color: 'var(--text-primary)', fontSize: 17,
    fontWeight: 600, marginBottom: 10,
  },
  featureDesc: { color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.65 },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 20,
  },
  stepCard: {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '28px 24px',
    boxShadow: 'var(--shadow-sm)',
  },
  stepNum: {
    display: 'block', color: 'var(--primary)',
    fontSize: 26, fontWeight: 800,
    marginBottom: 12, letterSpacing: '-0.02em',
  },
  stepLabel: { color: 'var(--text-primary)', fontSize: 16, fontWeight: 600, marginBottom: 8 },
  stepDesc:  { color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 },
  ctaSection: {
    textAlign: 'center',
    padding: 'clamp(60px,8vw,100px) 24px',
    borderTop: '1px solid var(--border)',
  },
  ctaTitle: {
    fontSize: 'clamp(24px,4vw,38px)',
    fontWeight: 700, color: 'var(--text-primary)',
    marginBottom: 14, letterSpacing: '-0.02em',
  },
  ctaSub: {
    color: 'var(--text-secondary)', fontSize: 16,
    marginBottom: 32,
  },
}