import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

const ThemeContext = createContext(null)
const STORAGE_KEY = 'ai_interviewer_settings'

export const ACCENT_COLORS = {
  blue:    { primary: '#2563EB', hover: '#1D4ED8', light: '#EFF6FF', text: '#1D4ED8' },
  indigo:  { primary: '#4F46E5', hover: '#4338CA', light: '#EEF2FF', text: '#4338CA' },
  emerald: { primary: '#059669', hover: '#047857', light: '#ECFDF5', text: '#047857' },
  orange:  { primary: '#EA580C', hover: '#C2410C', light: '#FFF7ED', text: '#C2410C' },
  rose:    { primary: '#E11D48', hover: '#BE123C', light: '#FFF1F2', text: '#BE123C' },
}

const DEFAULTS = {
  themeMode: 'light',
  darkMode: false,
  compactMode: false,
  accentColor: 'blue',
  fontSize: 'medium',
  reduceMotion: false,

  emailNotif: false,
  interviewReminder: false,
  reminderTime: '09:00',
  weeklyReport: false,
  browserPush: false,
  achievementAlerts: false,
  roadmapUpdates: false,

  preferredTypes: [],
  difficulty: 'Medium',
  interviewLength: '30',
  preferredLang: 'JavaScript',
  adaptiveDifficulty: false,

  dailyGoal: 5,
  weeklyGoal: 3,
  targetScore: 80,
  studyDays: 5,

  publicProfile: false,
  shareStats: false,
  showAchievements: false,
  aiPersonalization: false,

  experienceLevel: 'Student',
  industry: '',
  preferredTopics: [],
  jobType: '',
  careerGoal: '',
}

const BOOLEAN_KEYS = [
  'darkMode', 'compactMode', 'reduceMotion',
  'emailNotif', 'interviewReminder', 'weeklyReport', 'browserPush',
  'achievementAlerts', 'roadmapUpdates', 'adaptiveDifficulty',
  'publicProfile', 'shareStats', 'showAchievements', 'aiPersonalization',
]

function coerceBoolean(value, fallback) {
  if (typeof value === 'boolean') return value
  if (value === 'true' || value === 1 || value === '1') return true
  if (value === 'false' || value === 0 || value === '0') return false
  return fallback
}

function normalizeSettings(raw) {
  const merged = { ...DEFAULTS, ...raw }
  BOOLEAN_KEYS.forEach((key) => {
    merged[key] = coerceBoolean(merged[key], DEFAULTS[key])
  })
  if (!Array.isArray(merged.preferredTypes)) merged.preferredTypes = []
  if (!Array.isArray(merged.preferredTopics)) merged.preferredTopics = []
  return merged
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? normalizeSettings(JSON.parse(raw)) : { ...DEFAULTS }
  } catch {
    return { ...DEFAULTS }
  }
}

function resolveTheme(settings) {
  if (settings.themeMode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  if (settings.themeMode === 'dark' || settings.darkMode) return 'dark'
  return 'light'
}

function applyThemeToDom(settings) {
  document.documentElement.setAttribute('data-theme', resolveTheme(settings))
  document.documentElement.setAttribute('data-accent', settings.accentColor)
  document.documentElement.setAttribute('data-font', settings.fontSize)
  document.documentElement.setAttribute('data-compact', settings.compactMode ? 'compact' : 'normal')
}

export function ThemeProvider({ children }) {
  const [settings, setSettings] = useState(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    applyThemeToDom(settings)
  }, [settings])

  useEffect(() => {
    if (settings.themeMode !== 'system') return undefined
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyThemeToDom(settings)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [settings.themeMode, settings])

  const update = useCallback((key, val) => {
    setSettings(p => {
      let nextVal = val
      if (BOOLEAN_KEYS.includes(key)) {
        nextVal = coerceBoolean(val, DEFAULTS[key])
      }
      const next = normalizeSettings({ ...p, [key]: nextVal })
      if (key === 'themeMode') {
        next.darkMode = val === 'dark'
      }
      if (key === 'darkMode') {
        next.themeMode = val ? 'dark' : 'light'
      }
      return next
    })
  }, [])

  const updateMany = useCallback((patch) => {
    setSettings(p => normalizeSettings({ ...p, ...patch }))
  }, [])

  const accent = ACCENT_COLORS[settings.accentColor] || ACCENT_COLORS.blue

  const value = useMemo(() => ({
    settings,
    update,
    updateMany,
    accent,
  }), [settings, update, updateMany, accent])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be inside <ThemeProvider>')
  return ctx
}

export { ACCENT_COLORS as accentColors }
