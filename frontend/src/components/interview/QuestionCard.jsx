import Badge from './Badge'
import Button from './Button'

export default function QuestionCard({ question, topic, difficulty, onRemove, onPractice }) {
  return (
    <div style={{
      backgroundColor: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: '16px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {topic && <Badge variant="brand">{topic}</Badge>}
          {difficulty && <Badge variant="default">{difficulty}</Badge>}
        </div>
        {onRemove && (
          <Button variant="ghost" size="xs" onClick={onRemove}>Remove</Button>
        )}
      </div>
      <p style={{ color: 'var(--text-primary)', fontSize: 14, lineHeight: 1.65, margin: 0 }}>{question}</p>
      {onPractice && (
        <Button size="sm" onClick={onPractice}>Practice</Button>
      )}
    </div>
  )
}
