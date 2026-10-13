import { create } from 'zustand'
import type {
  AppSettings,
  GeneralSettings,
  ProfileSettings,
  SecuritySettings,
  NotificationSettings,
  AppearanceSettings,
} from '@/types/settings'
import {
  applyAccentColor,
  getInitialAccentColor,
  DEFAULT_ACCENT_COLOR,
} from '@/lib/accentColors'

interface SettingsState {
  settings: AppSettings
  updateGeneral: (data: Partial<GeneralSettings>) => void
  updateProfile: (data: Partial<ProfileSettings>) => void
  updateSecurity: (data: Partial<SecuritySettings>) => void
  updateNotifications: (data: Partial<NotificationSettings>) => void
  updateAppearance: (data: Partial<AppearanceSettings>) => void
  resetToDefaults: () => void
}

const defaultSettings: AppSettings = {
  general: {
    siteName: 'Nexus E-Commerce Admin',
    siteEmail: 'support@nexuscommerce.io',
    supportPhone: '+1 (800) 555-0199',
    currency: 'USD ($)',
    timezone: 'UTC+07:00 (Indochina Time)',
    dateFormat: 'MM/DD/YYYY',
  },
  profile: {
    fullName: 'Alex Morgan',
    email: 'alex.morgan@nexuscommerce.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    jobTitle: 'Head of Operations',
    bio: 'Lead product coordinator & system administrator overseeing global store analytics.',
    phone: '+1 (555) 349-2810',
    country: 'United States',
  },
  security: {
    twoFactorAuth: true,
    sessionTimeout: 30,
    loginAlerts: true,
  },
  notifications: {
    emailOrderCreated: true,
    emailLowStock: true,
    emailNewCustomer: false,
    pushDailyReport: true,
    pushSystemAlerts: true,
  },
  appearance: {
    theme: 'light',
    accentColor: DEFAULT_ACCENT_COLOR,
    sidebarCollapsed: false,
    compactMode: false,
  },
}

const getInitialSettings = (): AppSettings => {
  const accent = getInitialAccentColor()
  return {
    ...defaultSettings,
    appearance: {
      ...defaultSettings.appearance,
      accentColor: accent,
    },
  }
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: getInitialSettings(),

  updateGeneral: (data) =>
    set((state) => ({
      settings: {
        ...state.settings,
        general: { ...state.settings.general, ...data },
      },
    })),

  updateProfile: (data) =>
    set((state) => ({
      settings: {
        ...state.settings,
        profile: { ...state.settings.profile, ...data },
      },
    })),

  updateSecurity: (data) =>
    set((state) => ({
      settings: {
        ...state.settings,
        security: { ...state.settings.security, ...data },
      },
    })),

  updateNotifications: (data) =>
    set((state) => ({
      settings: {
        ...state.settings,
        notifications: { ...state.settings.notifications, ...data },
      },
    })),

  updateAppearance: (data) => {
    if (data.accentColor) {
      applyAccentColor(data.accentColor)
      try {
        localStorage.setItem('nexus_accent_color', data.accentColor)
      } catch (e) {
        console.error('Failed to save accent color', e)
      }
    }
    set((state) => ({
      settings: {
        ...state.settings,
        appearance: { ...state.settings.appearance, ...data },
      },
    }))
  },

  resetToDefaults: () => {
    applyAccentColor(DEFAULT_ACCENT_COLOR)
    try {
      localStorage.setItem('nexus_accent_color', DEFAULT_ACCENT_COLOR)
    } catch (e) {
      console.error('Failed to reset accent color', e)
    }
    set({
      settings: {
        ...defaultSettings,
        appearance: {
          ...defaultSettings.appearance,
          accentColor: DEFAULT_ACCENT_COLOR,
        },
      },
    })
  },
}))
