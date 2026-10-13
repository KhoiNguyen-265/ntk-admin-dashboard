import React, { useState } from 'react'
import { Card, CardHeader } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { LanguageSelector } from '@/components/common/LanguageSelector'
import { useSettingsStore } from '@/store/useSettingsStore'
import { useThemeStore } from '@/store/useThemeStore'
import { useToastStore } from '@/store/useToastStore'
import { useLanguageStore } from '@/store/useLanguageStore'
import { ACCENT_PALETTES } from '@/lib/accentColors'
import {
  Settings,
  User,
  Shield,
  Bell,
  Palette,
  Check,
  Moon,
  Sun,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type SettingsTab = 'general' | 'profile' | 'security' | 'notifications' | 'appearance'

export function SettingsPage() {
  const {
    settings,
    updateGeneral,
    updateProfile,
    updateSecurity,
    updateNotifications,
    updateAppearance,
    resetToDefaults,
  } = useSettingsStore()

  const { isDark, setDark } = useThemeStore()
  const { success, info } = useToastStore()
  const { t } = useLanguageStore()

  const [activeTab, setActiveTab] = useState<SettingsTab>('general')

  // Local form states
  const [generalForm, setGeneralForm] = useState(settings.general)
  const [profileForm, setProfileForm] = useState(settings.profile)
  const [securityForm, setSecurityForm] = useState(settings.security)
  const [notificationForm, setNotificationForm] = useState(settings.notifications)

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault()
    updateGeneral(generalForm)
    success('General settings saved', 'Store parameters updated successfully.')
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile(profileForm)
    success('Profile updated', 'Your personal administrator info was saved.')
  }

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault()
    updateSecurity(securityForm)
    success('Security settings saved', 'Two-factor & session parameters updated.')
  }

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault()
    updateNotifications(notificationForm)
    success('Notification preferences saved', 'Email and push alert subscriptions updated.')
  }

  const handleThemeChange = (dark: boolean) => {
    setDark(dark)
    updateAppearance({ theme: dark ? 'dark' : 'light' })
    info(`Switched theme to ${dark ? 'Dark' : 'Light'} mode`)
  }

  const handleResetDefaults = () => {
    resetToDefaults()
    setGeneralForm(settings.general)
    setProfileForm(settings.profile)
    setSecurityForm(settings.security)
    setNotificationForm(settings.notifications)
    info('Settings restored to factory defaults')
  }

  const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: 'general', label: t.settings.tabGeneral, icon: Settings },
    { id: 'profile', label: t.settings.tabProfile, icon: User },
    { id: 'security', label: t.settings.tabSecurity, icon: Shield },
    { id: 'notifications', label: t.settings.tabNotifications, icon: Bell },
    { id: 'appearance', label: t.settings.tabAppearance, icon: Palette },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.settings.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.settings.subtitle}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleResetDefaults}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          {t.settings.resetDefaults}
        </Button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors duration-150 border-b-2 whitespace-nowrap',
                isActive
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100/70 dark:hover:bg-indigo-950/60'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {/* 1. General Settings */}
        {activeTab === 'general' && (
          <Card>
            <CardHeader
              title={t.settings.storeInfo}
              subtitle={t.settings.storeInfoSub}
            />
            <form onSubmit={handleSaveGeneral} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.settings.siteName}
                </label>
                <input
                  type="text"
                  value={generalForm.siteName}
                  onChange={(e) =>
                    setGeneralForm({ ...generalForm, siteName: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors duration-150"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.settings.supportEmail}
                  </label>
                  <input
                    type="email"
                    value={generalForm.siteEmail}
                    onChange={(e) =>
                      setGeneralForm({ ...generalForm, siteEmail: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors duration-150"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.settings.hotline}
                  </label>
                  <input
                    type="text"
                    value={generalForm.supportPhone}
                    onChange={(e) =>
                      setGeneralForm({ ...generalForm, supportPhone: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors duration-150"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.settings.currency}
                  </label>
                  <select
                    value={generalForm.currency}
                    onChange={(e) =>
                      setGeneralForm({ ...generalForm, currency: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors duration-150"
                  >
                    <option value="USD ($)">USD ($)</option>
                    <option value="EUR (€)">EUR (€)</option>
                    <option value="GBP (£)">GBP (£)</option>
                    <option value="VND (₫)">VND (₫)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.settings.timeZone}
                  </label>
                  <input
                    type="text"
                    value={generalForm.timezone}
                    onChange={(e) =>
                      setGeneralForm({ ...generalForm, timezone: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors duration-150"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.settings.dateFormat}
                  </label>
                  <select
                    value={generalForm.dateFormat}
                    onChange={(e) =>
                      setGeneralForm({ ...generalForm, dateFormat: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors duration-150"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" size="sm">
                  {t.settings.saveGeneral}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* 2. Profile Settings */}
        {activeTab === 'profile' && (
          <Card>
            <CardHeader
              title={t.settings.personalProfile}
              subtitle={t.settings.personalProfileSub}
            />
            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={profileForm.avatar}
                  alt={profileForm.fullName}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.settings.avatarUrl}
                  </label>
                  <input
                    type="text"
                    value={profileForm.avatar}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, avatar: e.target.value })
                    }
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors duration-150"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.customers.fullName}
                  </label>
                  <input
                    type="text"
                    value={profileForm.fullName}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, fullName: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors duration-150"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.customers.email}
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors duration-150"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.settings.jobTitle}
                  </label>
                  <input
                    type="text"
                    value={profileForm.jobTitle}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, jobTitle: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors duration-150"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.customers.phone}
                  </label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors duration-150"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.settings.bio}
                </label>
                <textarea
                  rows={3}
                  value={profileForm.bio}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, bio: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors duration-150 resize-none"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" size="sm">
                  {t.settings.saveProfile}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* 3. Security Settings */}
        {activeTab === 'security' && (
          <Card>
            <CardHeader
              title={t.settings.securityAuth}
              subtitle={t.settings.securityAuthSub}
            />
            <form onSubmit={handleSaveSecurity} className="space-y-6 max-w-2xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {t.settings.twoFactor}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {t.settings.twoFactorSub}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securityForm.twoFactorAuth}
                      onChange={(e) =>
                        setSecurityForm({
                          ...securityForm,
                          twoFactorAuth: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {t.settings.loginAlerts}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {t.settings.loginAlertsSub}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securityForm.loginAlerts}
                      onChange={(e) =>
                        setSecurityForm({
                          ...securityForm,
                          loginAlerts: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.settings.sessionTimeout}
                  </label>
                  <select
                    value={securityForm.sessionTimeout}
                    onChange={(e) =>
                      setSecurityForm({
                        ...securityForm,
                        sessionTimeout: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full sm:w-64 px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors duration-150"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" size="sm">
                  {t.settings.saveSecurity}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* 4. Notification Settings */}
        {activeTab === 'notifications' && (
          <Card>
            <CardHeader
              title={t.settings.notificationRules}
              subtitle={t.settings.notificationRulesSub}
            />
            <form onSubmit={handleSaveNotifications} className="space-y-4 max-w-2xl">
              <div className="space-y-3">
                {[
                  {
                    key: 'emailOrderCreated',
                    label: 'New Order Created',
                    desc: 'Notify when a customer successfully checks out and pays.',
                  },
                  {
                    key: 'emailLowStock',
                    label: 'Low Inventory Warning',
                    desc: 'Alert when a product falls below 10 remaining units in stock.',
                  },
                  {
                    key: 'emailNewCustomer',
                    label: 'New Customer Sign-up',
                    desc: 'Send an email whenever a new customer account is registered.',
                  },
                  {
                    key: 'pushDailyReport',
                    label: 'Daily Sales Digest',
                    desc: 'Deliver a summary digest of gross sales and profits at 11:59 PM.',
                  },
                  {
                    key: 'pushSystemAlerts',
                    label: 'Critical System Alerts',
                    desc: 'Instant alert regarding webhook delays, database syncs, or API drops.',
                  },
                ].map(({ key, label, desc }) => (
                  <label
                    key={key}
                    className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={
                        notificationForm[key as keyof typeof notificationForm]
                      }
                      onChange={(e) =>
                        setNotificationForm({
                          ...notificationForm,
                          [key]: e.target.checked,
                        })
                      }
                      className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                        {label}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" size="sm">
                  {t.settings.saveNotifications}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* 5. Appearance Settings */}
        {activeTab === 'appearance' && (
          <Card>
            <CardHeader
              title={t.settings.appearanceTheme}
              subtitle={t.settings.appearanceThemeSub}
            />
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  {t.settings.colorMode}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Light Option */}
                  <div
                    onClick={() => handleThemeChange(false)}
                    className={cn(
                      'p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3',
                      !isDark
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-sm ring-1 ring-indigo-500'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    )}
                  >
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-sm text-slate-700 dark:text-slate-300">
                      <Sun className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {t.settings.lightMode}
                      </h4>
                      <p className="text-xs text-slate-500">{t.settings.lightModeSub}</p>
                    </div>
                    {!isDark && <Check className="w-4 h-4 text-indigo-600 ml-auto" />}
                  </div>

                  {/* Dark Option */}
                  <div
                    onClick={() => handleThemeChange(true)}
                    className={cn(
                      'p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3',
                      isDark
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-sm ring-1 ring-indigo-500'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    )}
                  >
                    <div className="p-2.5 rounded-xl bg-slate-900 shadow-sm text-indigo-400">
                      <Moon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {t.settings.darkMode}
                      </h4>
                      <p className="text-xs text-slate-500">{t.settings.darkModeSub}</p>
                    </div>
                    {isDark && <Check className="w-4 h-4 text-indigo-600 ml-auto" />}
                  </div>
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {t.common.language}
                </label>
                <div className="flex items-center gap-3">
                  <LanguageSelector showLabel />
                </div>
              </div>

              {/* Accent Color Palette Preview */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {t.settings.accentColor}
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  {ACCENT_PALETTES.map((item) => {
                    const isSelected =
                      (settings.appearance.accentColor || '').toLowerCase() === item.color.toLowerCase()
                    return (
                      <button
                        key={item.color}
                        type="button"
                        onClick={() => {
                          updateAppearance({ accentColor: item.color })
                          success('Accent updated', `Active palette is now ${item.name}`)
                        }}
                        className={cn(
                          'w-9 h-9 rounded-full border-2 border-white dark:border-slate-900 shadow-sm flex items-center justify-center transition-all hover:scale-110 focus:outline-none relative ring-offset-2 dark:ring-offset-slate-900',
                          isSelected ? 'ring-2 ring-slate-600 dark:ring-slate-200 scale-110' : 'opacity-85 hover:opacity-100'
                        )}
                        style={{ backgroundColor: item.color }}
                        title={item.name}
                      >
                        {isSelected && <Check className="w-4 h-4 text-white drop-shadow-sm" />}
                      </button>
                    )
                  })}
                </div>

                {/* Live Accent Preview Box */}
                {(() => {
                  const activePalette =
                    ACCENT_PALETTES.find(
                      (p) =>
                        p.color.toLowerCase() ===
                        (settings.appearance.accentColor || '').toLowerCase()
                    ) || ACCENT_PALETTES[0]
                  return (
                    <div className="mt-4 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                            {activePalette.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {activePalette.color}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                          Active Theme
                        </span>
                        <button
                          type="button"
                          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold shadow-sm hover:bg-indigo-700 active:scale-95 transition-all"
                        >
                          Sample Button
                        </button>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
