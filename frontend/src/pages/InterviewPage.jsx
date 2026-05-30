import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const ROLES = ['Frontend Engineer', 'Backend Engineer', 'Full Stack', 'System Design', 'Behavioral']
const LEVELS = ['Junior', 'Mid-level', 'Senior', 'Staff / Lead']

const SYSTEM_PROMPT = `You are a senior technical interviewer at a top tech company.
Your job is to conduct realistic technical interviews. 
- Ask ONE clear interview question at a time
- After the candidate answers, give SPECIFIC feedback (what was good, what was missing, a model answer outline)
- Then ask a follow-up or next question
- Maintain a professional but encouraging tone
- When the user says "next question" or similar, move to the next question
- Keep responses concise and well-structured
- Format feedback with clear sections: ✅ Strengths | ⚠️ Gaps | 💡 Key points to cover`

export default function InterviewPage() {
  const { user } = useAuth()
  const [phase, setPhase]     = useState('setup')   // setup | interview
  const [role, setRole]       = useState(ROLES[0])
  const [level, setLevel]     = useState(LEVELS[1])
  const [messages, setMessages] = useState([])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function startInterview() {
    setPhase('interview')
    setMessages([])
    setError('')
    await sendToAI(
      `Start a ${level} ${role} interview for me. Introduce yourself briefly and ask your first question.`,
      []
    )
  }

  async function sendMessage() {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', content: input.trim() }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    await sendToAI(null, next)
  }

  async function sendToAI(firstPrompt, history) {
    setLoading(true)
    setError('')
    try {
      const msgs = firstPrompt
        ? [{ role: 'user', content: firstPrompt }]
        : history

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: msgs,
        }),
      })

      if (!res.ok) throw new Error(`API error ${res.status}`)
      const data = await res.json()
      const text = data.content?.map((b) => b.text || '').join('') || '(no response)'

      setMessages((prev) => [...(firstPrompt ? [] : prev), ...(firstPrompt ? msgs : []), { role: 'assistant', content: text }])
    } catch (err) {
      console.error(err)
      setError('Failed to reach AI. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function resetInterview() {
    setPhase('setup')
    setMessages([])
    setInput('')
    setError('')
  }

  if (phase === 'setup') {
    return (
      <div style={S.page}>
        <div style={S.setupCard}>
          <span style={S.logoMark}>🎯</span>
          <h1 style={S.setupTitle}>Configure your interview</h1>
          <p style={S.setupSub}>Choose your role and level to get relevant questions</p>

          <label style={S.fieldLabel}>Target role</label>
          <div style={S.chipGroup}>
            {ROLES.map((r) => (
              <button
                key={r}
                style={{ ...S.chip, ...(role === r ? S.chipActive : {}) }}
                onClick={() => setRole(r)}
              >
                {r}
              </button>
            ))}
          </div>

          <label style={S.fieldLabel}>Experience level</label>
          <div style={S.chipGroup}>
            {LEVELS.map((l) => (
              <button
                key={l}
                style={{ ...S.chip, ...(level === l ? S.chipActive : {}) }}
                onClick={() => setLevel(l)}
              >
                {l}
              </button>
            ))}
          </div>

          <div style={S.summaryBox}>
            <span style={S.summaryText}>
              🤖 You'll be interviewed as a <strong style={{ color: '#f0f0f8' }}>{level} {role}</strong>
            </span>
          </div>

          <button style={S.startBtn} onClick={startInterview}>
            Start interview →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={S.page}>
      <div style={S.chatWrap}>
        {/* Chat header */}
        <div style={S.chatHeader}>
          <div>
            <h2 style={S.chatTitle}>AI Interviewer</h2>
            <p style={S.chatMeta}>{level} · {role}</p>
          </div>
          <button style={S.resetBtn} onClick={resetInterview}>✕ End session</button>
        </div>

        {/* Messages */}
        <div style={S.messages}>
          {messages.map((msg, i) => (
            <div key={i} style={msg.role === 'user' ? S.userMsgWrap : S.asstMsgWrap}>
              {msg.role === 'assistant' && (
                <div style={S.asstAvatar}>🤖</div>
              )}
              <div style={msg.role === 'user' ? S.userBubble : S.asstBubble}>
                {msg.content.split('\n').map((line, j) => (
                  <span key={j}>{line}{j < msg.content.split('\n').length - 1 && <br />}</span>
                ))}
              </div>
              {msg.role === 'user' && (
                <div style={S.userAvatar}>
                  {user?.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
              )}
            </div>
          ))}

          {loading && (
  <div style={S.asstMsgWrap}>
    <div style={S.asstAvatar}>🤖</div>
    <div style={S.asstBubble}>
      {/* Use the CSS class instead of inline style */}
      <div className="typing-dots">
        <span /><span /><span />
      </div>
    </div>
  </div>
)}

          {error && (
            <div style={S.errorBanner} role="alert">⚠ {error}</div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={S.inputArea}>
          <textarea
            style={S.textarea}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer… (Enter to send, Shift+Enter for newline)"
            rows={3}
            disabled={loading}
          />
          <button
            style={S.sendBtn(loading || !input.trim())}
            onClick={sendMessage}
            disabled={loading || !input.trim()}
          >
            {loading ? '…' : '↑'}
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
    padding: '32px 20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  /* Setup */
  setupCard: {
    width: '100%', maxWidth: 520,
    backgroundColor: '#12122a', border: '1px solid #1e1e38',
    borderRadius: 18, padding: '36px 36px 32px', boxSizing: 'border-box',
  },
  logoMark: { fontSize: 36, display: 'block', textAlign: 'center', marginBottom: 12 },
  setupTitle: {
    color: '#f0f0f8', fontSize: 24, fontWeight: 700,
    textAlign: 'center', margin: '0 0 8px', letterSpacing: '-0.02em',
  },
  setupSub: { color: '#5a5a7a', textAlign: 'center', fontSize: 14, marginBottom: 28 },
  fieldLabel: {
    display: 'block', color: '#8b8fa8', fontSize: 13,
    fontWeight: 600, marginBottom: 10, letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  chipGroup: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  chip: {
    backgroundColor: '#0d0d1f', border: '1px solid #252545',
    color: '#8b8fa8', padding: '8px 14px', borderRadius: 8,
    fontSize: 13, fontWeight: 500, cursor: 'pointer',
    transition: 'all 0.15s',
  },
  chipActive: {
    backgroundColor: '#1e1e50', border: '1px solid #5b5bf0',
    color: '#a0a0f8',
  },
  summaryBox: {
    backgroundColor: '#0d0d1f', border: '1px solid #1e1e38',
    borderRadius: 10, padding: '12px 16px', marginBottom: 24,
  },
  summaryText: { color: '#5a5a7a', fontSize: 14 },
  startBtn: {
    width: '100%', padding: 14, borderRadius: 10, border: 'none',
    backgroundColor: '#5b5bf0', color: '#fff', fontSize: 16,
    fontWeight: 600, cursor: 'pointer',
  },

  /* Chat */
  chatWrap: {
    width: '100%', maxWidth: 780,
    backgroundColor: '#12122a', border: '1px solid #1e1e38',
    borderRadius: 18, display: 'flex', flexDirection: 'column',
    minHeight: 'calc(100vh - 128px)',
  },
  chatHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '18px 24px', borderBottom: '1px solid #1e1e38',
  },
  chatTitle: { color: '#f0f0f8', fontSize: 16, fontWeight: 600, margin: 0 },
  chatMeta:  { color: '#5a5a7a', fontSize: 13, margin: '2px 0 0' },
  resetBtn: {
    backgroundColor: 'transparent', color: '#5a5a7a',
    border: '1px solid #252545', padding: '6px 14px',
    borderRadius: 8, fontSize: 13, cursor: 'pointer',
  },
  messages: {
    flex: 1, overflowY: 'auto', padding: '24px 24px 12px',
    display: 'flex', flexDirection: 'column', gap: 16,
  },
  asstMsgWrap: { display: 'flex', alignItems: 'flex-start', gap: 12 },
  userMsgWrap: { display: 'flex', alignItems: 'flex-start', gap: 12, justifyContent: 'flex-end' },
  asstAvatar: {
    width: 34, height: 34, borderRadius: '50%',
    backgroundColor: '#1e1e40', border: '1px solid #2e2e60',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16, flexShrink: 0,
  },
  userAvatar: {
    width: 34, height: 34, borderRadius: '50%',
    backgroundColor: '#1e1e50', border: '1px solid #5b5bf0',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#a0a0f8', fontSize: 14, fontWeight: 600, flexShrink: 0,
  },
  asstBubble: {
    backgroundColor: '#0d0d1f', border: '1px solid #1e1e38',
    borderRadius: '4px 12px 12px 12px', padding: '12px 16px',
    color: '#c8c8e8', fontSize: 14, lineHeight: 1.65, maxWidth: '85%',
    whiteSpace: 'pre-wrap',
  },
  userBubble: {
    backgroundColor: '#1e1e50', border: '1px solid #2e2e6a',
    borderRadius: '12px 4px 12px 12px', padding: '12px 16px',
    color: '#d0d0f8', fontSize: 14, lineHeight: 1.65, maxWidth: '85%',
    whiteSpace: 'pre-wrap',
  },
  typingDots: { display: 'flex', gap: 4, padding: '2px 0' },
  errorBanner: {
    backgroundColor: '#2a0d14', border: '1px solid #5a1a24',
    color: '#ff8a95', padding: '10px 14px', borderRadius: 8, fontSize: 14,
  },

  inputArea: {
    display: 'flex', gap: 10, padding: '16px 24px 20px',
    borderTop: '1px solid #1e1e38', alignItems: 'flex-end',
  },
  textarea: {
    flex: 1, backgroundColor: '#0d0d1f', border: '1.5px solid #252545',
    borderRadius: 10, color: '#f0f0f8', fontSize: 14,
    padding: '10px 14px', resize: 'none', fontFamily: 'inherit',
    lineHeight: 1.5, outline: 'none',
  },
  sendBtn: (disabled) => ({
    width: 44, height: 44, borderRadius: 10, border: 'none',
    backgroundColor: disabled ? '#252545' : '#5b5bf0',
    color: disabled ? '#5a5a7a' : '#fff',
    fontSize: 20, cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, transition: 'background-color 0.15s',
  }),
}