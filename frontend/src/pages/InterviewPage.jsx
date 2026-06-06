import { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useAppData } from '../context/AppDataContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { sendInterviewMessage } from '../services/ai'
import { scoreInterviewSession } from '../utils/interviewScoring'
import { getInitials } from '../hooks/useInitials'
import { useElapsedSeconds } from '../components/interview/InterviewTimer'
import { showToast } from '../components/ui/Toast'
import ChipGroup from '../components/ui/ChipGroup'
import Button from '../components/ui/Button'
import { INTERVIEW_MODES } from '../data/initialState'

const ROLES = ['Frontend Engineer', 'Backend Engineer', 'Full Stack', 'System Design', 'Behavioral', 'DSA', 'HR']
const LEVELS = ['Junior', 'Mid-level', 'Senior', 'Staff / Lead']

const SYSTEM_PROMPT = `You are a senior technical interviewer. Ask ONE question at a time. Give structured feedback. Keep responses concise.`

const MODE_TO_TOPIC = {
  frontend: 'Frontend',
  backend: 'Backend',
  fullstack: 'Full Stack',
  dsa: 'DSA',
  behavioral: 'Behavioral',
  system_design: 'System Design',
  hr: 'HR',
  rapid_fire: 'Rapid Fire',
}

export default function InterviewPage() {
  const { user } = useAuth()
  const { settings } = useTheme()
  const { addInterview, addActivity, saveQuestion } = useAppData()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const initialMode = searchParams.get('mode') || ''
  const modeConfig = INTERVIEW_MODES.find(m => m.id === initialMode)

  const [phase, setPhase] = useState('setup')
  const [selectedRole, setSelectedRole] = useState(modeConfig ? MODE_TO_TOPIC[modeConfig.id] || ROLES[0] : ROLES[0])
  const [selectedLevel, setSelectedLevel] = useState(LEVELS[1])
  const [modeId, setModeId] = useState(initialMode || 'frontend')
  const [customMode, setCustomMode] = useState('')
  const [customRole, setCustomRole] = useState('')
  const [customLevel, setCustomLevel] = useState('')
  /** Frozen when interview starts — chips + custom inputs resolved once */
  const [sessionConfig, setSessionConfig] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sessionId] = useState(() => crypto.randomUUID())
  const bottomRef = useRef(null)

  const elapsed = useElapsedSeconds(phase === 'interview')
  const initials = getInitials(user?.name, 'U')
  const difficulty = settings.difficulty || 'Medium'

  const presetMode = MODE_TO_TOPIC[modeId]
    || INTERVIEW_MODES.find(m => m.id === modeId)?.label
    || 'General'
  const effectiveMode = customMode.trim() || presetMode
  const effectiveRole = customRole.trim() || selectedRole
  const effectiveLevel = customLevel.trim() || selectedLevel

  const role = sessionConfig?.role ?? effectiveRole
  const level = sessionConfig?.level ?? effectiveLevel
  const interviewMode = sessionConfig?.mode ?? effectiveMode

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendToAI = useCallback(async (firstPrompt, history) => {
    setLoading(true)
    setError('')
    try {
      const msgs = firstPrompt
        ? [{ role: 'user', content: firstPrompt }]
        : history.map(m => ({ role: m.role, content: m.content }))

      const data = await sendInterviewMessage({
        messages: msgs,
        systemPrompt: SYSTEM_PROMPT,
        role,
        level,
      })

      const text = typeof data === 'string'
        ? data
        : (data.content || data.message || '(no response)')

      setMessages(prev => {
        const base = firstPrompt ? [] : prev
        const withUser = firstPrompt ? [{ role: 'user', content: firstPrompt, id: crypto.randomUUID() }] : []
        return [
          ...base,
          ...withUser,
          { role: 'assistant', content: text, id: crypto.randomUUID() },
        ]
      })
    } catch (err) {
      console.error(err)
      setError('Could not reach the server. Your answers are still saved locally.')
    } finally {
      setLoading(false)
    }
  }, [role, level])

  async function startInterview() {
    if (!effectiveRole.trim()) {
      showToast('Enter a target role or pick a preset', 'error')
      return
    }
    if (!effectiveLevel.trim()) {
      showToast('Enter an experience level or pick a preset', 'error')
      return
    }

    const config = {
      role: effectiveRole.trim(),
      level: effectiveLevel.trim(),
      mode: effectiveMode.trim(),
    }
    setSessionConfig(config)
    setPhase('interview')
    setMessages([])
    setError('')
    await sendToAI(
      `Start a ${config.level} ${config.role} interview (${config.mode} focus). Introduce yourself briefly and ask your first question.`,
      []
    )
  }

  async function sendMessage() {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', content: input.trim(), id: crypto.randomUUID() }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    await sendToAI(null, next)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function handleSaveQuestion() {
    const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant')
    if (!lastAssistant) {
      showToast('No question to save yet', 'error')
      return
    }
    saveQuestion({
      question: lastAssistant.content.slice(0, 500),
      topic: role,
      difficulty,
      sourceInterviewId: sessionId,
    })
    addActivity({ type: 'save', label: 'Saved a question', count: 1 })
    showToast('Question saved')
  }

  function finishInterview() {
    const scoring = scoreInterviewSession({
      messages,
      role,
      durationSeconds: elapsed,
    })

    const interview = addInterview({
      id: sessionId,
      mode: interviewMode,
      topic: role,
      difficulty,
      score: scoring.score,
      duration: Math.ceil(elapsed / 60),
      questionsAnswered: scoring.questionsAnswered,
      feedbackSummary: scoring.feedbackSummary,
      strengths: scoring.strengths,
      weaknesses: scoring.weaknesses,
      feedback: scoring.feedback,
    })

    addActivity({
      type: 'interview',
      label: `Completed ${role} interview`,
      count: 1,
    })

    navigate('/results', { state: { interviewId: interview.id }, replace: false })
  }

  if (phase === 'setup') {
    return (
      <div style={S.page}>
        <div style={S.setupCard}>
          <div style={S.setupHeader}>
            <h1 style={S.setupTitle}>Configure your interview</h1>
            <p style={S.setupSub}>Pick a preset or type your own under each section</p>
          </div>

          <SetupField
            label="Practice mode"
            hint="Pick a preset or type any mode (e.g. ML, DevOps, Product Manager)"
            inputValue={customMode}
            onInputChange={setCustomMode}
            inputPlaceholder="Or type custom practice mode…"
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {INTERVIEW_MODES.map(m => (
                <button
                  key={m.id}
                  type="button"
                  style={{ ...S.chip, ...(modeId === m.id && !customMode.trim() ? S.chipActive : {}) }}
                  onClick={() => {
                    setModeId(m.id)
                    setCustomMode('')
                    if (!customRole.trim()) {
                      setSelectedRole(MODE_TO_TOPIC[m.id] || m.label)
                    }
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </SetupField>

          <SetupField
            label="Target role"
            hint="Pick a preset or type any role title"
            inputValue={customRole}
            onInputChange={setCustomRole}
            inputPlaceholder="Or type custom target role…"
          >
            <ChipGroup
              options={ROLES}
              value={customRole.trim() ? '' : selectedRole}
              onChange={v => { setSelectedRole(v); setCustomRole('') }}
            />
          </SetupField>

          <SetupField
            label="Experience level"
            hint="Pick a preset or type any level (e.g. Fresher, 2 years, Lead)"
            inputValue={customLevel}
            onInputChange={setCustomLevel}
            inputPlaceholder="Or type custom experience level…"
          >
            <ChipGroup
              options={LEVELS}
              value={customLevel.trim() ? '' : selectedLevel}
              onChange={v => { setSelectedLevel(v); setCustomLevel('') }}
            />
          </SetupField>

          <div style={S.summaryBox}>
            <p style={S.summaryText}>
              You will be interviewed as a{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{effectiveLevel} {effectiveRole}</strong>
              {' '}· Mode: {effectiveMode} · Difficulty: {difficulty}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <Button onClick={startInterview} style={{ flex: 1 }}>Start interview →</Button>
            <Button variant="secondary" onClick={() => navigate('/dashboard')}>Cancel</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={S.page}>
      <div style={S.chatWrap}>
        <div style={S.chatHeader}>
          <div>
            <h2 style={S.chatTitle}>AI Interviewer</h2>
            <p style={S.chatMeta}>{level} · {role} · {interviewMode} · {Math.floor(elapsed / 60)}m {elapsed % 60}s</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" size="sm" onClick={handleSaveQuestion}>Save question</Button>
            <Button variant="secondary" size="sm" onClick={finishInterview}>End &amp; see results</Button>
          </div>
        </div>

        <div style={S.messages}>
          {messages.map(msg => (
            <div key={msg.id} style={msg.role === 'user' ? S.userRow : S.asstRow}>
              {msg.role === 'assistant' && <div style={S.asstAvatar}>AI</div>}
              <div style={msg.role === 'user' ? S.userBubble : S.asstBubble}>
                {msg.content.split('\n').map((line, j, arr) => (
                  <span key={`${msg.id}-${j}`}>
                    {line}
                    {j < arr.length - 1 && <br />}
                  </span>
                ))}
              </div>
              {msg.role === 'user' && <div style={S.userAvatar}>{initials}</div>}
            </div>
          ))}

          {loading && (
            <div style={S.asstRow}>
              <div style={S.asstAvatar}>AI</div>
              <div style={S.asstBubble}>
                <div className="typing-dots"><span /><span /><span /></div>
              </div>
            </div>
          )}

          {error && (
            <div style={S.errorBanner} role="alert">{error}</div>
          )}

          <div ref={bottomRef} />
        </div>

        <div style={S.inputArea}>
          <textarea
            style={S.textarea}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer… (Enter to send · Shift+Enter for new line)"
            rows={3}
            disabled={loading}
          />
          <Button onClick={sendMessage} disabled={loading || !input.trim()} style={{ alignSelf: 'flex-end' }}>
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}

function SetupField({ label, hint, children, inputValue, onInputChange, inputPlaceholder }) {
  return (
    <div style={S.setupSection}>
      <label style={S.setupLabel}>{label}</label>
      {children}
      <input
        type="text"
        style={S.customInput}
        value={inputValue}
        onChange={e => onInputChange(e.target.value)}
        placeholder={inputPlaceholder}
        aria-label={`Custom ${label.toLowerCase()}`}
      />
      {hint && <p style={S.setupHint}>{hint}</p>}
    </div>
  )
}

const S = {
  page: {
    minHeight: 'calc(100vh - 60px)',
    backgroundColor: 'var(--app-bg)',
    padding: '24px 20px',
    display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
  },
  setupCard: {
    width: '100%', maxWidth: 560,
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 18, padding: 'clamp(24px, 5vw, 40px)',
    boxShadow: 'var(--shadow-md)',
  },
  setupHeader: { marginBottom: 28, textAlign: 'center' },
  setupTitle: { color: 'var(--text-primary)', fontSize: 22, fontWeight: 700, margin: '0 0 6px' },
  setupSub: { color: 'var(--text-muted)', fontSize: 14, margin: 0 },
  setupSection: { marginBottom: 24 },
  setupLabel: {
    display: 'block', color: 'var(--text-secondary)',
    fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.08em', marginBottom: 10,
  },
  setupHint: {
    color: 'var(--text-faint)', fontSize: 12, margin: '8px 0 0', lineHeight: 1.4,
  },
  customInput: {
    width: '100%', marginTop: 10, padding: '10px 13px',
    backgroundColor: 'var(--surface-muted)',
    border: '1.5px solid var(--border-strong)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)', fontSize: 14,
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  },
  chip: {
    backgroundColor: 'var(--surface-muted)',
    border: '1.5px solid var(--border-strong)',
    color: 'var(--text-secondary)',
    padding: '8px 16px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
  },
  chipActive: {
    backgroundColor: 'var(--primary-light)',
    border: '1.5px solid var(--primary)',
    color: 'var(--primary-text)', fontWeight: 600,
  },
  summaryBox: {
    backgroundColor: 'var(--surface-muted)',
    border: '1px solid var(--border)',
    borderRadius: 10, padding: '12px 16px', marginBottom: 24,
  },
  summaryText: { color: 'var(--text-secondary)', fontSize: 14, margin: 0 },
  chatWrap: {
    width: '100%', maxWidth: 800,
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 18,
    display: 'flex', flexDirection: 'column',
    minHeight: 'calc(100vh - 108px)',
    boxShadow: 'var(--shadow-md)',
  },
  chatHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 24px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: 12,
  },
  chatTitle: { color: 'var(--text-primary)', fontSize: 15, fontWeight: 600, margin: 0 },
  chatMeta: { color: 'var(--text-muted)', fontSize: 13, margin: '2px 0 0' },
  messages: {
    flex: 1, overflowY: 'auto', padding: '24px 24px 12px',
    display: 'flex', flexDirection: 'column', gap: 16,
  },
  asstRow: { display: 'flex', alignItems: 'flex-start', gap: 12 },
  userRow: { display: 'flex', alignItems: 'flex-start', gap: 12, justifyContent: 'flex-end' },
  asstAvatar: {
    width: 32, height: 32, borderRadius: '50%',
    backgroundColor: 'var(--primary-light)', border: '1.5px solid var(--primary)',
    color: 'var(--primary-text)', fontSize: 11, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  userAvatar: {
    width: 32, height: 32, borderRadius: '50%',
    backgroundColor: 'var(--surface-muted)', border: '1.5px solid var(--border-strong)',
    color: 'var(--text-secondary)', fontSize: 12, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  asstBubble: {
    backgroundColor: 'var(--surface-muted)', border: '1px solid var(--border)',
    borderRadius: '4px 14px 14px 14px', padding: '12px 16px',
    color: 'var(--text-primary)', fontSize: 14, lineHeight: 1.65,
    maxWidth: '85%', whiteSpace: 'pre-wrap',
  },
  userBubble: {
    backgroundColor: 'var(--primary)', border: '1px solid var(--primary)',
    borderRadius: '14px 4px 14px 14px', padding: '12px 16px',
    color: '#fff', fontSize: 14, lineHeight: 1.65, maxWidth: '85%', whiteSpace: 'pre-wrap',
  },
  errorBanner: {
    backgroundColor: 'var(--danger-bg)', border: '1px solid var(--danger-border)',
    color: 'var(--danger-text)', padding: '10px 14px', borderRadius: 8, fontSize: 14,
  },
  inputArea: {
    display: 'flex', gap: 10, padding: '16px 24px 20px',
    borderTop: '1px solid var(--border)', alignItems: 'flex-end',
  },
  textarea: {
    flex: 1, backgroundColor: 'var(--surface-muted)',
    border: '1.5px solid var(--border-strong)', borderRadius: 10,
    color: 'var(--text-primary)', fontSize: 14, padding: '10px 14px',
    resize: 'none', fontFamily: 'inherit', lineHeight: 1.5, outline: 'none',
  },
}
