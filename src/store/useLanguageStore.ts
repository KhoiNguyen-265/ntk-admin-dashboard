import { create } from 'zustand'
import { translations, languages, type LanguageCode, type TranslationSchema } from '@/locales'

interface LanguageState {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: TranslationSchema
}

const getInitialLanguage = (): LanguageCode => {
  if (typeof window === 'undefined') return 'vi'
  const saved = localStorage.getItem('nexus_lang') as LanguageCode
  if (saved && ['en', 'vi', 'ja'].includes(saved)) {
    return saved
  }
  // Default to Vietnamese if browser is vi, else en
  const browserLang = navigator.language.slice(0, 2)
  if (browserLang === 'vi') return 'vi'
  if (browserLang === 'ja') return 'ja'
  return 'en'
}

const initialLang = getInitialLanguage()

export const useLanguageStore = create<LanguageState>((set) => ({
  language: initialLang,
  t: translations[initialLang],
  setLanguage: (lang: LanguageCode) => {
    localStorage.setItem('nexus_lang', lang)
    set({
      language: lang,
      t: translations[lang],
    })
  },
}))

export { languages }
