// Central source of truth for all initial/empty user data
// Replace these with API calls in Phase 2 backend integration

export const EMPTY_USER_STATS = {
  interviewsCompleted: 0,
  questionsAnswered:   0,
  savedQuestionsCount: 0,
  currentStreak:       0,
  longestStreak:       0,
  averageScore:        null,
  bestScore:           null,
  resumeScore:         null,
  readinessScore:      null,
  roadmapProgress:     null,
  topicsPracticed:     0,
}

export const EMPTY_INTERVIEWS   = []
export const EMPTY_SAVED        = []
export const EMPTY_ACTIVITY_LOG = []
export const EMPTY_ROADMAP      = null
export const EMPTY_RESUME       = null

export const ACHIEVEMENT_DEFINITIONS = [
  { id: 'first_interview',  icon: 'award',     label: 'First Interview',  desc: 'Complete your first session',          condition: s => s.interviewsCompleted >= 1  },
  { id: 'streak_3',         icon: 'flame',     label: '3-Day Streak',     desc: 'Practice 3 days in a row',             condition: s => s.currentStreak >= 3        },
  { id: 'streak_7',         icon: 'zap',       label: 'Week Warrior',     desc: 'Practice 7 days in a row',             condition: s => s.currentStreak >= 7        },
  { id: 'top_scorer',       icon: 'trophy',    label: 'Top Scorer',       desc: 'Score above 90% in any interview',     condition: s => s.bestScore >= 90           },
  { id: 'topic_master',     icon: 'book-open', label: 'Topic Master',     desc: 'Practice 5 different topics',          condition: s => s.topicsPracticed >= 5      },
  { id: 'ten_interviews',   icon: 'mic',       label: 'Consistent',       desc: 'Complete 10 interviews',               condition: s => s.interviewsCompleted >= 10 },
]

export const INTERVIEW_MODES = [
  { id: 'frontend',      label: 'Frontend',      sub: 'React · CSS · JS'     },
  { id: 'backend',       label: 'Backend',       sub: 'Node · APIs · DBs'    },
  { id: 'fullstack',     label: 'Full Stack',    sub: 'End-to-end'           },
  { id: 'dsa',           label: 'DSA',           sub: 'Arrays · Trees · DP'  },
  { id: 'behavioral',    label: 'Behavioral',    sub: 'STAR method'          },
  { id: 'system_design', label: 'System Design', sub: 'Scale · Architecture' },
  { id: 'hr',            label: 'HR Round',      sub: 'Culture fit'          },
  { id: 'rapid_fire',    label: 'Rapid Fire',    sub: '60-sec answers'       },
]