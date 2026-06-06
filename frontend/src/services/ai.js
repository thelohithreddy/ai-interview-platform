import { api } from './api'

/**
 * All AI calls go through the backend — never call provider APIs from the browser.
 * Endpoints are stubbed until backend implements them.
 */

export async function sendInterviewMessage({ messages, systemPrompt, role, level }) {
  try {
    return await api.post('/api/ai/interview-question', {
      messages,
      systemPrompt,
      role,
      level,
    })
  } catch (err) {
    if ([404, 501].includes(err.status) || err.message?.includes('Failed to fetch')) {
      return {
        stub: true,
        content: getStubInterviewReply(messages, role, level),
      }
    }
    throw err
  }
}

export async function askCareerCoach(query) {
  try {
    return await api.post('/api/ai/recommendations', { query })
  } catch (err) {
    if ([404, 501].includes(err.status) || err.message?.includes('Failed to fetch')) {
      return {
        stub: true,
        content: 'AI coaching will be available once the backend is connected. Complete a few interviews to unlock personalized recommendations.',
      }
    }
    throw err
  }
}

export async function analyzeResume(fileMeta) {
  try {
    return await api.post('/api/resume/analyze', fileMeta)
  } catch (err) {
    if ([404, 501].includes(err.status) || err.message?.includes('Failed to fetch')) {
      return {
        stub: true,
        status: 'uploaded',
        message: 'Resume uploaded. Analysis will be available after AI backend connection.',
      }
    }
    throw err
  }
}

function getStubInterviewReply(messages, role, level) {
  const userCount = messages.filter(m => m.role === 'user').length
  if (userCount === 0) {
    return `Hello! I'll be conducting your ${level} ${role} interview today. Let's begin.\n\n**Question 1:** Tell me about a recent project where you solved a challenging technical problem. What was your approach?`
  }
  return `Thank you for your answer.\n\n✅ **Strengths:** You provided a structured response.\n⚠️ **Gaps:** Consider adding more specific metrics and trade-offs.\n💡 **Key points:** Mention scalability, testing, and team collaboration.\n\n**Follow-up:** How would you improve that solution if you had more time?`
}
