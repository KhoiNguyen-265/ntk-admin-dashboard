import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { MobileDrawer } from './MobileDrawer'
import { Header } from './Header'
import { ToastContainer } from '@/components/common/ToastContainer'
import { useSettingsStore } from '@/store/useSettingsStore'
import { applyAccentColor } from '@/lib/accentColors'

export function MainLayout() {
  const { settings } = useSettingsStore()

  useEffect(() => {
    applyAccentColor(settings.appearance.accentColor)
  }, [settings.appearance.accentColor])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex antialiased">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Drawer */}
      <MobileDrawer />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Toast Container */}
      <ToastContainer />
    </div>
  )
}
