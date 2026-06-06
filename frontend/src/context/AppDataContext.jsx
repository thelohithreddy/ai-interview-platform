import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from './AuthContext'

const AppDataContext = createContext(null)
const LEGACY_STORAGE_KEY = 'ai_interviewer_app_data'

export const EMPTY_RESUME_ANALYSIS = {
  uploaded: false,
  fileName: null,
  fileSize: null,
  fileType: null,
  uploadedAt: null,
  status: 'idle',
  score: null,
  strengths: [],
  weaknesses: [],
  missingKeywords: [],
  suggestions: [],
  recommendedSkills: [],
  roleMatch: null,
}

const DEFAULT_STATE = {
  interviews: [],
  savedQuestions: [],
  activityLog: [],
  roadmap: null,
  resumeAnalysis: { ...EMPTY_RESUME_ANALYSIS },
  recommendations: [],
}

function storageKeyForUser(email) {
  const safe = String(email).trim().toLowerCase()
  return `ai_interviewer_app_data__${safe}`
}

function parseStoredState(raw) {
  if (!raw) return { ...DEFAULT_STATE, resumeAnalysis: { ...EMPTY_RESUME_ANALYSIS } }
  try {
    const parsed = JSON.parse(raw)
    return {
      ...DEFAULT_STATE,
      ...parsed,
      resumeAnalysis: { ...EMPTY_RESUME_ANALYSIS, ...parsed.resumeAnalysis },
    }
  } catch {
    return { ...DEFAULT_STATE, resumeAnalysis: { ...EMPTY_RESUME_ANALYSIS } }
  }
}

function loadStateForUser(email) {
  const key = storageKeyForUser(email)
  let raw = localStorage.getItem(key)

  // One-time: move old shared storage into this account if they have no data yet
  if (!raw) {
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacy) {
      localStorage.setItem(key, legacy)
      localStorage.removeItem(LEGACY_STORAGE_KEY)
      raw = legacy
    }
  }

  return parseStoredState(raw)
}

function persistStateForUser(email, state) {
  localStorage.setItem(storageKeyForUser(email), JSON.stringify(state))
}

export function AppDataProvider({ children }) {
  const { user, loading: authLoading } = useAuth()
  const [data, setData] = useState(DEFAULT_STATE)

  // Load the correct user's data when they log in (or switch accounts)
  useEffect(() => {
    if (authLoading) return
    if (!user?.email) {
      setData({
        ...DEFAULT_STATE,
        resumeAnalysis: { ...EMPTY_RESUME_ANALYSIS },
      })
      return
    }
    setData(loadStateForUser(user.email))
  }, [user?.email, authLoading])

  // Save only for the logged-in user
  useEffect(() => {
    if (!user?.email) return
    persistStateForUser(user.email, data)
  }, [data, user?.email])

  const addInterview = useCallback((interview) => {
    const entry = {
      id: interview.id || crypto.randomUUID(),
      mode: interview.mode,
      topic: interview.topic,
      difficulty: interview.difficulty,
      score: interview.score,
      duration: interview.duration,
      date: interview.date || new Date().toISOString(),
      questionsAnswered: interview.questionsAnswered ?? 0,
      feedbackSummary: interview.feedbackSummary ?? '',
      strengths: interview.strengths ?? [],
      weaknesses: interview.weaknesses ?? [],
      feedback: interview.feedback ?? [],
    }
    setData(prev => ({
      ...prev,
      interviews: [entry, ...prev.interviews],
    }))
    return entry
  }, [])

  const saveQuestion = useCallback((question) => {
    const entry = {
      id: question.id || crypto.randomUUID(),
      question: question.question,
      topic: question.topic,
      difficulty: question.difficulty,
      sourceInterviewId: question.sourceInterviewId ?? null,
      savedAt: question.savedAt || new Date().toISOString(),
      answer: question.answer ?? '',
    }
    setData(prev => ({
      ...prev,
      savedQuestions: [entry, ...prev.savedQuestions.filter(q => q.id !== entry.id)],
    }))
    return entry
  }, [])

  const removeSavedQuestion = useCallback((id) => {
    setData(prev => ({
      ...prev,
      savedQuestions: prev.savedQuestions.filter(q => q.id !== id),
    }))
  }, [])

  const addActivity = useCallback((activity) => {
    const entry = {
      id: activity.id || crypto.randomUUID(),
      type: activity.type,
      label: activity.label,
      date: activity.date || new Date().toISOString(),
      count: activity.count ?? 1,
    }
    setData(prev => ({
      ...prev,
      activityLog: [entry, ...prev.activityLog],
    }))
    return entry
  }, [])

  const updateResumeAnalysis = useCallback((patch) => {
    setData(prev => ({
      ...prev,
      resumeAnalysis: { ...prev.resumeAnalysis, ...patch },
    }))
  }, [])

  const generateRoadmap = useCallback((payload = {}) => {
    const roadmap = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      targetRole: payload.targetRole || '',
      phases: [
        { id: 1, title: 'Foundation', status: 'pending', topics: [] },
        { id: 2, title: 'Practice', status: 'pending', topics: [] },
        { id: 3, title: 'Mock interviews', status: 'pending', topics: [] },
      ],
      progress: 0,
      ...payload,
    }
    setData(prev => ({ ...prev, roadmap }))
    return roadmap
  }, [])

  const clearSavedQuestions = useCallback(() => {
    setData(prev => ({ ...prev, savedQuestions: [] }))
  }, [])

  const resetAnalytics = useCallback(() => {
    setData(prev => ({
      ...prev,
      interviews: prev.interviews.map(iv => ({ ...iv, score: null })),
    }))
  }, [])

  const clearHistory = useCallback(() => {
    setData(prev => ({ ...prev, interviews: [], activityLog: [] }))
  }, [])

  const clearAllUserData = useCallback(() => {
    setData({
      ...DEFAULT_STATE,
      resumeAnalysis: { ...EMPTY_RESUME_ANALYSIS },
    })
  }, [])

  const getInterviewById = useCallback((id) => {
    return data.interviews.find(iv => iv.id === id) ?? null
  }, [data.interviews])

  const value = useMemo(() => ({
    ...data,
    addInterview,
    saveQuestion,
    removeSavedQuestion,
    addActivity,
    updateResumeAnalysis,
    generateRoadmap,
    clearSavedQuestions,
    resetAnalytics,
    clearHistory,
    clearAllUserData,
    getInterviewById,
  }), [
    data,
    addInterview,
    saveQuestion,
    removeSavedQuestion,
    addActivity,
    updateResumeAnalysis,
    generateRoadmap,
    clearSavedQuestions,
    resetAnalytics,
    clearHistory,
    clearAllUserData,
    getInterviewById,
  ])

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  )
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used inside <AppDataProvider>')
  return ctx
}
