import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'

const FEATURES = [
  { title: 'AI-powered questions', desc: 'Interview questions tailored to your role, level, and stack.' },
  { title: 'Instant feedback', desc: 'Structured feedback after each session to help you improve faster.' },
  { title: 'Track your progress', desc: 'Analytics, history, and skill tracking as you practice.' },
]

const STEPS = [
  { n: '01', label: 'Create your account', desc: 'Free to get started — no card required.' },
  { n: '02', label: 'Choose your role', desc: 'Frontend, backend, DSA, system design, and more.' },
  { n: '03', label: 'Practice & improve', desc: 'Get feedback and iterate until you are confident.' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div style={{ backgroundColor: 'var(--app-bg)', minHeight: 'calc(100vh - 60px)' }}>
      <section style={S.hero}>
        <div style={S.heroBadge}>AI-powered interview prep</div>
        <h1 style={S.heroTitle}>
          Ace your next<br />
          <span style={{ color: 'var(--primary)' }}>technical interview</span>
        </h1>
        <p style={S.heroSub}>Practice with AI. Get real feedback. Build interview confidence.</p>
        <div style={S.heroBtns}>
          <Button size="lg" onClick={() => navigate(user ? '/dashboard' : '/signup')}>
            {user ? 'Go to dashboard →' : 'Start for free →'}
          </Button>
          {!user && (
            <Button variant="secondary" size="lg" onClick={() => navigate('/login')}>Sign in</Button>
          )}
        </div>
        <p style={S.heroNote}>No credit card required · Free to start</p>
      </section>

      <section style={S.section}>
        <p style={S.eyebrow}>What you get</p>
        <h2 style={S.sectionTitle}>Everything you need to prepare</h2>
        <div style={S.featureGrid}>
          {FEATURES.map(f => (
            <div key={f.title} style={S.featureCard}>
              <div style={S.featureIconWrap} aria-hidden="true">
                <span style={S.featureIconDot} />
              </div>
              <h3 style={S.featureName}>{f.title}</h3>
              <p style={S.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ backgroundColor: 'var(--surface-muted)' }}>
        <div style={{ maxWidth: 'var(--page-width)', margin: '0 auto', padding: '60px 24px' }}>
          <p style={S.eyebrow}>How it works</p>
          <h2 style={S.sectionTitle}>Three steps to interview readiness</h2>
          <div style={S.stepsGrid}>
            {STEPS.map(step => (
              <div key={step.n} style={S.stepCard}>
                <span style={S.stepNum}>{step.n}</span>
                <h3 style={S.stepLabel}>{step.label}</h3>
                <p style={S.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={S.ctaSection}>
        <h2 style={S.ctaTitle}>Ready to get started?</h2>
        <p style={S.ctaSub}>Create a free account and start your first mock interview today.</p>
        <Button size="lg" onClick={() => navigate(user ? '/interview' : '/signup')}>
          {user ? 'Start an interview →' : 'Create free account →'}
        </Button>
      </section>

      <footer style={S.footer}>
        <div style={S.footerInner}>
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>© {new Date().getFullYear()} AI Interviewer</span>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <a href="#" style={S.footerLink} onClick={e => e.preventDefault()}>Privacy Policy</a>
            <a href="#" style={S.footerLink} onClick={e => e.preventDefault()}>Terms</a>
            <a href="mailto:lohith.gaddamapally@gmail.com" style={S.footerLink}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

const S = {
  hero: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
    padding: 'clamp(64px,10vw,120px) 24px 80px',
  },
  heroBadge: {
    display: 'inline-block', backgroundColor: 'var(--primary-light)',
    color: 'var(--primary-text)', fontSize: 13, fontWeight: 600,
    padding: '6px 16px', borderRadius: 100, marginBottom: 28,
  },
  heroTitle: {
    fontSize: 'clamp(36px,7vw,64px)', fontWeight: 800, lineHeight: 1.1,
    color: 'var(--text-primary)', margin: '0 0 20px', letterSpacing: '-0.03em',
  },
  heroSub: { fontSize: 'clamp(16px,2.5vw,19px)', color: 'var(--text-secondary)', marginBottom: 36, maxWidth: 480 },
  heroBtns: { display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' },
  heroNote: { color: 'var(--text-faint)', fontSize: 13, marginTop: 16 },
  section: { backgroundColor: 'var(--app-bg)' },
  eyebrow: {
    textAlign: 'center', color: 'var(--primary)', fontSize: 12, fontWeight: 700,
    letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12,
  },
  sectionTitle: {
    textAlign: 'center', fontSize: 'clamp(22px,3vw,30px)', fontWeight: 700,
    color: 'var(--text-primary)', marginBottom: 48,
  },
  featureGrid: {
    maxWidth: 'var(--page-width)', margin: '0 auto', padding: '60px 24px',
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20,
  },
  featureCard: {
    backgroundColor: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '28px 24px', boxShadow: 'var(--shadow-sm)',
  },
  featureIconWrap: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: 'var(--primary-light)', border: '1px solid var(--primary-light)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  featureIconDot: {
    width: 12, height: 12, borderRadius: '50%', backgroundColor: 'var(--primary)',
  },
  featureName: { color: 'var(--text-primary)', fontSize: 17, fontWeight: 600, marginBottom: 10 },
  featureDesc: { color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.65 },
  stepsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20,
  },
  stepCard: {
    backgroundColor: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '28px 24px', boxShadow: 'var(--shadow-sm)',
  },
  stepNum: { display: 'block', color: 'var(--primary)', fontSize: 26, fontWeight: 800, marginBottom: 12 },
  stepLabel: { color: 'var(--text-primary)', fontSize: 16, fontWeight: 600, marginBottom: 8 },
  stepDesc: { color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 },
  ctaSection: { textAlign: 'center', padding: 'clamp(60px,8vw,100px) 24px', borderTop: '1px solid var(--border)' },
  ctaTitle: { fontSize: 'clamp(24px,4vw,38px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 },
  ctaSub: { color: 'var(--text-secondary)', fontSize: 16, marginBottom: 32 },
  footer: { borderTop: '1px solid var(--border)', padding: '24px 20px', backgroundColor: 'var(--surface)' },
  footerInner: {
    maxWidth: 'var(--page-width)', margin: '0 auto',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
  },
  footerLink: { color: 'var(--text-muted)', fontSize: 13, textDecoration: 'none' },
}
