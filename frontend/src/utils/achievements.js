export const ACHIEVEMENT_ICONS = {
  award: '🎯',
  flame: '🔥',
  zap: '⚡',
  trophy: '🏆',
  'book-open': '📚',
  mic: '🎤',
}

export function getAchievementIcon(iconKey) {
  return ACHIEVEMENT_ICONS[iconKey] || '🏅'
}
