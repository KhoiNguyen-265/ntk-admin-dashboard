import React, { useState, useRef, useEffect } from 'react'
import { useLanguageStore, languages } from '@/store/useLanguageStore'
import { Check, ChevronDown, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LanguageSelector({ showLabel = false }: { showLabel?: boolean }) {
  const { language, setLanguage } = useLanguageStore()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentOption = languages.find((l) => l.code === language) || languages[0]

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'flex items-center gap-1.5 p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-semibold'
        )}
        title="Change Language / Đổi ngôn ngữ / 言語を変更"
        aria-label="Language selection"
      >
        <span className="text-base leading-none">{currentOption.flag}</span>
        {showLabel ? (
          <span className="hidden sm:inline-block">{currentOption.nativeName}</span>
        ) : (
          <span className="hidden sm:inline-block uppercase tracking-wider text-[11px]">
            {currentOption.code}
          </span>
        )}
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
            <Globe className="w-3 h-3" /> Select Language
          </div>

          <div className="p-1 space-y-0.5">
            {languages.map((item) => {
              const isSelected = item.code === language
              return (
                <button
                  key={item.code}
                  onClick={() => {
                    setLanguage(item.code)
                    setIsOpen(false)
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-xl transition-colors',
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">{item.flag}</span>
                    <span>{item.nativeName}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
