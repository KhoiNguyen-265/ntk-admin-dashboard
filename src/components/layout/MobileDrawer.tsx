import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  Users,
  BarChart3,
  MessageSquare,
  Settings,
  X,
  Sparkles,
} from 'lucide-react'
import { useSidebarStore } from '@/store/useSidebarStore'
import { useMessageStore } from '@/store/useMessageStore'
import { useOrderStore } from '@/store/useOrderStore'
import { useLanguageStore } from '@/store/useLanguageStore'
import { cn } from '@/lib/utils'

export function MobileDrawer() {
  const { isMobileOpen, closeMobile } = useSidebarStore()
  const { conversations } = useMessageStore()
  const { orders } = useOrderStore()
  const { t } = useLanguageStore()

  const totalUnreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0)
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length

  const navigation = [
    { name: t.nav.dashboard, to: '/dashboard', icon: LayoutDashboard },
    { name: t.nav.products, to: '/products', icon: Package },
    { name: t.nav.categories, to: '/categories', icon: Layers },
    {
      name: t.nav.orders,
      to: '/orders',
      icon: ShoppingCart,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
    },
    { name: t.nav.customers, to: '/customers', icon: Users },
    { name: t.nav.analytics, to: '/analytics', icon: BarChart3 },
    {
      name: t.nav.messages,
      to: '/messages',
      icon: MessageSquare,
      badge: totalUnreadMessages > 0 ? totalUnreadMessages : undefined,
    },
    { name: t.nav.settings, to: '/settings', icon: Settings },
  ]

  if (!isMobileOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={closeMobile}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white dark:bg-slate-900 shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-200 dark:shadow-none">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-900 dark:text-white">NTK Admin</span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                E-Commerce Suite
              </span>
            </div>
          </div>
          <button
            onClick={closeMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMobile}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all',
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        'w-5 h-5 flex-shrink-0',
                        isActive ? 'text-white' : 'text-slate-400'
                      )}
                    />
                    <span className="flex-1 truncate">{item.name}</span>
                    {item.badge !== undefined && (
                      <span
                        className={cn(
                          'px-2 py-0.5 text-xs font-semibold rounded-full',
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            )
          })}
        </div>

        {/* Footer profile */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
              alt="Alex Morgan"
              className="w-9 h-9 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                Alex Morgan
              </p>
              <p className="text-[11px] text-slate-400 truncate">{t.nav.storeAdmin}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
