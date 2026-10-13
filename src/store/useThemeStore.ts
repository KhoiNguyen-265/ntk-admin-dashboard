import { create } from 'zustand'

interface ThemeState {
  isDark: boolean
  toggleTheme: () => void
  setDark: (val: boolean) => void
}

const getInitialTheme = (): boolean => {
  if (typeof window === 'undefined') return false
  const saved = localStorage.getItem('nexus_theme')
  if (saved !== null) {
    const isDark = saved === 'dark'
    if (isDark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    return isDark
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (prefersDark) document.documentElement.classList.add('dark')
  return prefersDark
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: getInitialTheme(),
  toggleTheme: () =>
    set((state) => {
      const next = !state.isDark
      if (next) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('nexus_theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('nexus_theme', 'light')
      }
      return { isDark: next }
    }),
  setDark: (val: boolean) => {
    if (val) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('nexus_theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('nexus_theme', 'light')
    }
    set({ isDark: val })
  },
}))
