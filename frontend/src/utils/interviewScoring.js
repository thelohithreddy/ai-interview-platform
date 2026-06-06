/**
 * Local placeholder scoring — not AI-generated.
 * Replace with backend evaluate-answer when connected.
 */

export function scoreInterviewSession({ messages, role, durationSeconds }) {
  const userMessages = messages.filter(m => m.role === 'user')
  const questionsAnswered = userMessages.length

  if (questionsAnswered === 0) {
    return {
      score: 0,
      feedbackSummary: 'Session ended with no answers submitted.',
      strengths: [],
      weaknesses: ['No answers were provided during this session.'],
      feedback: [],
    }
  }

  const avgLength = userMessages.reduce((s, m) => s + m.content.length, 0) / questionsAnswered
  let score = 50
  if (avgLength > 80) score += 15
  if (avgLength > 200) score += 10
  if (questionsAnswered >= 3) score += 10
  if (questionsAnswered >= 5) score += 5
  if (durationSeconds > 300) score += 5
  score = Math.min(95, Math.max(40, score))

  const feedback = userMessages.slice(0, 5).map((msg, i) => ({
    question: extractQuestion(messages, i),
    score: Math.min(95, score + (i % 3) * 3 - 3),
    strengths: avgLength > 100
      ? 'Answer showed reasonable depth and structure.'
      : 'You attempted the question.',
    gaps: avgLength < 150
      ? 'Try to expand with examples, metrics, and trade-offs.'
      : 'Could include more specific technical details.',
    topic: role,
  }))

  return {
    score,
    feedbackSummary: `Local score based on ${questionsAnswered} answer(s). Connect the backend for AI evaluation.`,
    strengths: [
      questionsAnswered >= 2 ? 'Completed multiple questions' : 'Started the session',
      avgLength > 100 ? 'Answers had reasonable length' : null,
    ].filter(Boolean),
    weaknesses: [
      avgLength < 100 ? 'Answers were brief — expand with examples' : null,
      questionsAnswered < 3 ? 'Complete more questions for better practice' : null,
    ].filter(Boolean),
    feedback,
    questionsAnswered,
  }
}

function extractQuestion(messages, answerIndex) {
  const userIndices = messages
    .map((m, i) => (m.role === 'user' ? i : -1))
    .filter(i => i >= 0)
  const userIdx = userIndices[answerIndex]
  if (userIdx == null) return `Question ${answerIndex + 1}`

  for (let i = userIdx - 1; i >= 0; i--) {
    if (messages[i].role === 'assistant') {
      const line = messages[i].content.split('\n').find(l => l.trim()) || messages[i].content
      return line.slice(0, 120) + (line.length > 120 ? '…' : '')
    }
  }
  return `Question ${answerIndex + 1}`
}
