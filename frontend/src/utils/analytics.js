// All analytics calculations — replace body with API calls later

export function calculateAverageScore(interviews) {
  if (!interviews?.length) return null
  const scored = interviews.filter(i => i.score != null)
  if (!scored.length) return null
  return Math.round(scored.reduce((s, i) => s + i.score, 0) / scored.length)
}

export function calculateBestScore(interviews) {
  if (!interviews?.length) return null
  const scored = interviews.filter(i => i.score != null)
  if (!scored.length) return null
  return Math.max(...scored.map(i => i.score))
}

export function calculateReadinessScore(interviews) {
  if (!interviews || interviews.length < 3) return null
  return calculateAverageScore(interviews)
}

export function calculateCurrentStreak(activityLog) {
  if (!activityLog?.length) return 0
  const days = [...new Set(
    activityLog.map(e => new Date(e.date).toDateString())
  )].sort((a, b) => new Date(b) - new Date(a))

  let streak = 0
  let current = new Date()
  current.setHours(0,0,0,0)

  for (const day of days) {
    const d = new Date(day)
    const diff = Math.round((current - d) / 86400000)
    if (diff === 0 || diff === streak) { streak++; current = d }
    else break
  }
  return streak
}

export function calculateLongestStreak(activityLog) {
  if (!activityLog?.length) return 0
  const days = [...new Set(
    activityLog.map(e => new Date(e.date).toDateString())
  )].map(d => new Date(d)).sort((a,b) => a - b)

  let max = 1, cur = 1
  for (let i = 1; i < days.length; i++) {
    const diff = Math.round((days[i] - days[i-1]) / 86400000)
    cur = diff === 1 ? cur + 1 : 1
    max = Math.max(max, cur)
  }
  return days.length ? max : 0
}

export function generateHeatmapData(activityLog) {
  // Returns array of 364 integers (52 weeks × 7 days)
  const counts = {}
  activityLog?.forEach(e => {
    const key = new Date(e.date).toDateString()
    counts[key] = (counts[key] || 0) + (e.count || 1)
  })

  const cells = []
  const today = new Date()
  today.setHours(0,0,0,0)

  for (let i = 363; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    cells.push({ date: d, count: counts[d.toDateString()] || 0 })
  }
  return cells
}

export function getSkillMatrix(interviews) {
  if (!interviews?.length) return []
  const map = {}
  interviews.forEach(iv => {
    if (!iv.topic || iv.score == null) return
    if (!map[iv.topic]) map[iv.topic] = { attempts: 0, totalScore: 0, lastDate: null }
    map[iv.topic].attempts++
    map[iv.topic].totalScore += iv.score
    const d = new Date(iv.date)
    if (!map[iv.topic].lastDate || d > map[iv.topic].lastDate) map[iv.topic].lastDate = d
  })

  return Object.entries(map).map(([skill, data]) => {
    const avg = Math.round(data.totalScore / data.attempts)
    return {
      skill,
      attempts: data.attempts,
      avgScore: avg,
      lastDate: data.lastDate,
      level: avg < 60 ? 'Beginner' : avg < 80 ? 'Intermediate' : 'Advanced',
    }
  })
}

export function getModeStats(interviews) {
  const map = {}
  interviews?.forEach(iv => {
    if (!iv.mode) return
    if (!map[iv.mode]) map[iv.mode] = { attempts: 0, totalScore: 0, lastDate: null }
    map[iv.mode].attempts++
    if (iv.score != null) map[iv.mode].totalScore += iv.score
    const d = new Date(iv.date)
    if (!map[iv.mode].lastDate || d > map[iv.mode].lastDate) map[iv.mode].lastDate = d
  })
  return map
}

export function getUnlockedAchievements(stats, definitions) {
  return definitions.map(def => ({
    ...def,
    earned: def.condition(stats),
  }))
}

export function getProfileCompletion(user) {
  const fields = ['name','email','targetRole','college','degree','gradYear','github','linkedin','portfolio']
  const filled = fields.filter(f => user?.[f] && String(user[f]).trim())
  return { pct: Math.round((filled.length / fields.length) * 100), missing: fields.filter(f => !user?.[f] || !String(user[f]).trim()) }
}

export function getRecentActivity(activityLog, limit = 10) {
  if (!activityLog?.length) return []
  return [...activityLog].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, limit)
}

export function getTopicStats(interviews) {
  if (!interviews?.length) return []
  const map = {}
  interviews.forEach(iv => {
    if (!iv.topic) return
    map[iv.topic] = (map[iv.topic] || 0) + 1
  })
  return Object.entries(map).map(([topic, count]) => ({ topic, count }))
}

export function formatScore(score) {
  return score == null ? '—' : `${score}%`
}

export function formatCount(count) {
  return count ?? 0
}