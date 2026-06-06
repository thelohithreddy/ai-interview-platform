export const FIELD_LABELS = {
  name: 'Full name',
  email: 'Email',
  targetRole: 'Target role',
  college: 'College',
  degree: 'Degree',
  gradYear: 'Graduation year',
  expLevel: 'Experience level',
  experienceLevel: 'Experience level',
  location: 'Location',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  portfolio: 'Portfolio',
  bio: 'Bio',
  careerGoal: 'Career goal',
  jobType: 'Job type',
  industry: 'Preferred industry',
  preferredTopics: 'Preferred topics',
  difficulty: 'Difficulty',
}

export function fieldLabel(key) {
  return FIELD_LABELS[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())
}

export function displayValue(value, fallback = 'Not set') {
  if (value == null || String(value).trim() === '') return fallback
  return String(value).trim()
}
