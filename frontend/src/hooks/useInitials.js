export function getInitials(name, fallback = '?') {
  if (!name?.trim()) return fallback
  return name
    .trim()
    .split(/\s+/)
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function useInitials(name, fallback = '?') {
  return getInitials(name, fallback)
}
