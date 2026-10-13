import { en, type TranslationSchema } from './en'
import { vi } from './vi'
import { ja } from './ja'

export type LanguageCode = 'en' | 'vi' | 'ja'

export interface LanguageOption {
  code: LanguageCode
  name: string
  nativeName: string
  flag: string
}

export const languages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
]

export const translations: Record<LanguageCode, TranslationSchema> = {
  en,
  vi,
  ja,
}

export type { TranslationSchema }
