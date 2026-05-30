import { createContext, useContext, useState, useEffect, useCallback } from 'react'

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
  // Appearance — LIGHT by default
  darkMode:      false,
  compactMode:   false,
  accentColor:   'blue',
  fontSize:      'medium',
  reduceMotion:  false,

  // Notifications
  emailNotif:         false,
  interviewReminder:  true,
  weeklyReport:       false,
  browserPush:        false,
  achievementAlerts:  true,
  roadmapUpdates:     true,

  // Interview preferences
  preferredTypes:   ['Frontend', 'Backend', 'Full Stack'],
  difficulty:       'Medium',
  interviewLength:  '30',
  preferredLang:    'JavaScript',
  adaptiveDifficulty: false,

  // Learning goals
  dailyGoal:    5,
  weeklyGoal:   3,
  targetScore:  80,
  studyDays:    5,

  // Privacy
  publicProfile:     false,
  shareStats:        false,
  showAchievements:  true,
  aiPersonalization: true,

  // Career
  targetRole:      '',
  experienceLevel: 'Student',
  college:         '',
  gradYear:        '',
  preferredTopics: ['React', 'Node.js', 'DSA'],
  jobType:         'Internship',
  careerGoal:      'Placement',
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS
  } catch { return DEFAULTS }
}

export function ThemeProvider({ children }) {
  const [settings, setSettings] = useState(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))

    // Apply theme to document root
    document.documentElement.setAttribute('data-theme',
      settings.darkMode ? 'dark' : 'light'
    )
    document.documentElement.setAttribute('data-accent',  settings.accentColor)
    document.documentElement.setAttribute('data-font',    settings.fontSize)
    document.documentElement.setAttribute('data-compact', settings.compactMode ? 'compact' : 'normal')
  }, [settings])

  // Also apply on mount immediately
  useEffect(() => {
    const s = load()
    document.documentElement.setAttribute('data-theme',
      s.darkMode ? 'dark' : 'light'
    )
    document.documentElement.setAttribute('data-accent',  s.accentColor)
  }, [])

  const update     = useCallback((key, val)  => setSettings(p => ({ ...p, [key]: val })), [])
  const updateMany = useCallback((patch)     => setSettings(p => ({ ...p, ...patch })), [])
  const accent     = ACCENT_COLORS[settings.accentColor] || ACCENT_COLORS.blue

  return (
    <ThemeContext.Provider value={{ settings, update, updateMany, accent, ACCENT_COLORS }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be inside <ThemeProvider>')
  return ctx
}