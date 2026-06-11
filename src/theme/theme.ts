export type ThemeMode = 'day' | 'night' | 'auto'
export type ThemeAccent =
  | 'blue'
  | 'teal'
  | 'green'
  | 'olive'
  | 'amber'
  | 'orange'
  | 'rose'
  | 'pink'
  | 'purple'
  | 'indigo'
  | 'sky'
  | 'brown'

export const THEME_MODE_KEY = 'crm-theme-mode'
export const THEME_ACCENT_KEY = 'crm-theme-accent'

export const THEME_ACCENTS: Array<{ id: ThemeAccent; hex: string; label: string }> = [
  { id: 'blue', hex: '#1a56db', label: 'Blue' },
  { id: 'teal', hex: '#0f766e', label: 'Teal' },
  { id: 'green', hex: '#2e7d32', label: 'Green' },
  { id: 'olive', hex: '#7a8f00', label: 'Olive' },
  { id: 'amber', hex: '#a16207', label: 'Amber' },
  { id: 'orange', hex: '#c2410c', label: 'Orange' },
  { id: 'rose', hex: '#be123c', label: 'Rose' },
  { id: 'pink', hex: '#9d174d', label: 'Pink' },
  { id: 'purple', hex: '#7e22ce', label: 'Purple' },
  { id: 'indigo', hex: '#4338ca', label: 'Indigo' },
  { id: 'sky', hex: '#0369a1', label: 'Sky' },
  { id: 'brown', hex: '#6f4e37', label: 'Brown' },
]

function isSystemDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function getStoredThemeSettings(): { mode: ThemeMode; accent: ThemeAccent } {
  const mode = (localStorage.getItem(THEME_MODE_KEY) as ThemeMode | null) ?? 'day'
  const accent = (localStorage.getItem(THEME_ACCENT_KEY) as ThemeAccent | null) ?? 'blue'
  return {
    mode: mode === 'day' || mode === 'night' || mode === 'auto' ? mode : 'day',
    accent: THEME_ACCENTS.some((item) => item.id === accent) ? accent : 'blue',
  }
}

export function applyThemeSettings(
  settings: { mode: ThemeMode; accent: ThemeAccent },
  persist = true
) {
  const resolvedMode = settings.mode === 'auto' ? (isSystemDark() ? 'night' : 'day') : settings.mode
  const root = document.documentElement
  root.dataset.theme = resolvedMode
  root.dataset.accent = settings.accent

  if (persist) {
    localStorage.setItem(THEME_MODE_KEY, settings.mode)
    localStorage.setItem(THEME_ACCENT_KEY, settings.accent)
  }
}

export function initTheme() {
  applyThemeSettings(getStoredThemeSettings(), false)
}

