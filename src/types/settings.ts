export interface GeneralSettings {
  siteName: string
  siteEmail: string
  supportPhone: string
  currency: string
  timezone: string
  dateFormat: string
}

export interface ProfileSettings {
  fullName: string
  email: string
  avatar: string
  jobTitle: string
  bio: string
  phone: string
  country: string
}

export interface SecuritySettings {
  twoFactorAuth: boolean
  sessionTimeout: number
  loginAlerts: boolean
}

export interface NotificationSettings {
  emailOrderCreated: boolean
  emailLowStock: boolean
  emailNewCustomer: boolean
  pushDailyReport: boolean
  pushSystemAlerts: boolean
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system'
  accentColor: string
  sidebarCollapsed: boolean
  compactMode: boolean
}

export interface AppSettings {
  general: GeneralSettings
  profile: ProfileSettings
  security: SecuritySettings
  notifications: NotificationSettings
  appearance: AppearanceSettings
}
