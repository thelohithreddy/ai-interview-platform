// Shows a single saved interview question
// question = the question text
// topic    = e.g. "React", "System Design"
// onRemove = optional function to remove from saved list

export default function QuestionCard({ question, topic, onRemove }) {
  return (
    <div style={S.card}>
      <div style={S.top}>
        {topic && <span style={S.badge}>{topic}</span>}
        {onRemove && (
          <button style={S.removeBtn} onClick={onRemove} title="Remove">
            ✕
          </button>
        )}
      </div>
      <p style={S.question}>{question}</p>
    </div>
  )
}

const S = {
  card: {
    backgroundColor: '#12122a',
    border: '1px solid #1e1e38',
    borderRadius: 12,
    padding: '18px 20px',
    transition: 'border-color 0.15s',
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    backgroundColor: '#1e1e50',
    color: '#8080e0',
    fontSize: 12,
    fontWeight: 600,
    padding: '3px 10px',
    borderRadius: 100,
    border: '1px solid #2e2e6a',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#5a5a7a',
    fontSize: 14,
    cursor: 'pointer',
    padding: '2px 6px',
    borderRadius: 4,
    lineHeight: 1,
  },
  question: {
    color: '#c8c8e8',
    fontSize: 14,
    lineHeight: 1.65,
    margin: 0,
  },
}