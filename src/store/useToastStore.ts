import { create } from 'zustand'
import type { ToastItem, ToastType } from '@/types/common'

interface ToastState {
  toasts: ToastItem[]
  addToast: (toast: Omit<ToastItem, 'id'>) => void
  removeToast: (id: string) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: ToastItem = { ...toast, id }
    set((state) => ({ toasts: [...state.toasts, newToast] }))

    const duration = toast.duration ?? 4000
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id)
      }, duration)
    }
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  success: (title, message) =>
    get().addToast({ title, message, type: 'success' }),
  error: (title, message) =>
    get().addToast({ title, message, type: 'error' }),
  warning: (title, message) =>
    get().addToast({ title, message, type: 'warning' }),
  info: (title, message) =>
    get().addToast({ title, message, type: 'info' }),
}))
