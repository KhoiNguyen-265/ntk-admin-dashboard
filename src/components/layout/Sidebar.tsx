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
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { useSidebarStore } from '@/store/useSidebarStore'
import { useMessageStore } from '@/store/useMessageStore'
import { useOrderStore } from '@/store/useOrderStore'
import { useLanguageStore } from '@/store/useLanguageStore'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const { isCollapsed, toggleCollapse } = useSidebarStore()
  const { conversations } = useMessageStore()
  const { orders } = useOrderStore()
  const { t } = useLanguageStore()

  const totalUnreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0)
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length

  const navigation = [
    {
      name: t.nav.dashboard,
      to: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: t.nav.products,
      to: '/products',
      icon: Package,
    },
    {
      name: t.nav.categories,
      to: '/categories',
      icon: Layers,
    },
    {
      name: t.nav.orders,
      to: '/orders',
      icon: ShoppingCart,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      badgeVariant: 'amber',
    },
    {
      name: t.nav.customers,
      to: '/customers',
      icon: Users,
    },
    {
      name: t.nav.analytics,
      to: '/analytics',
      icon: BarChart3,
    },
    {
      name: t.nav.messages,
      to: '/messages',
      icon: MessageSquare,
      badge: totalUnreadMessages > 0 ? totalUnreadMessages : undefined,
      badgeVariant: 'indigo',
    },
    {
      name: t.nav.settings,
      to: '/settings',
      icon: Settings,
    },
  ]

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 relative z-30 flex-shrink-0 h-screen sticky top-0',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      {!isCollapsed ? (
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200 dark:shadow-none flex-shrink-0">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <div className="flex flex-col min-w-0 transition-opacity duration-200">
              <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight truncate">
                NTK Admin
              </span>
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                {t.nav.storeAdmin}
              </span>
            </div>
          </div>

          {/* Collapse button when expanded */}
          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="h-16 flex items-center justify-center border-b border-slate-100 dark:border-slate-800/80 relative">
          {/* Symmetrical Centered Logo */}
          <div
            onClick={toggleCollapse}
            className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200 dark:shadow-none cursor-pointer transition-transform hover:scale-105"
            title="NexusAdmin (Click to expand)"
          >
            <Sparkles className="w-5 h-5 text-indigo-100" />
          </div>

          {/* Floating Edge Toggle Button on the border */}
          <button
            onClick={toggleCollapse}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-110 transition-all z-40 focus:outline-none cursor-pointer"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <div
        className={cn(
          'flex-1 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden',
          isCollapsed ? 'px-2' : 'px-3'
        )}
      >
        {!isCollapsed && (
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            {t.nav.menu}
          </div>
        )}

        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={isCollapsed ? item.name : undefined}
              className={({ isActive }) =>
                cn(
                  'flex items-center rounded-xl font-medium text-sm transition-all duration-150 group relative',
                  isCollapsed
                    ? 'w-11 h-11 mx-auto justify-center p-0'
                    : 'gap-3 px-3 py-2.5 w-full',
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-none'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'w-5 h-5 flex-shrink-0 transition-transform duration-150 group-hover:scale-105',
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                    )}
                  />

                  {!isCollapsed && (
                    <span className="truncate flex-1">{item.name}</span>
                  )}

                  {!isCollapsed && item.badge !== undefined && (
                    <span
                      className={cn(
                        'px-2 py-0.5 text-xs font-semibold rounded-full flex-shrink-0',
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeVariant === 'amber'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                          : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Clean, well-aligned notification indicator dot in collapsed mode */}
                  {isCollapsed && item.badge !== undefined && (
                    <span
                      className={cn(
                        'absolute top-1.5 right-1.5 w-2 h-2 rounded-full ring-2 ring-white dark:ring-slate-900',
                        item.badgeVariant === 'amber'
                          ? 'bg-amber-500'
                          : 'bg-indigo-500'
                      )}
                    />
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </div>

      {/* Footer profile teaser */}
      {!isCollapsed ? (
        <div className="p-3 mx-3 mb-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
            alt="Alex Morgan"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
              Alex Morgan
            </p>
            <p className="text-[11px] text-slate-400 truncate">{t.nav.storeAdmin}</p>
          </div>
        </div>
      ) : (
        <div className="p-3 flex justify-center mb-4 border-t border-slate-100 dark:border-slate-800/80 pt-3">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
            alt="Alex Morgan"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20 cursor-pointer hover:ring-indigo-500/50 transition-all"
            title={`Alex Morgan (${t.nav.storeAdmin})`}
          />
        </div>
      )}
    </aside>
  )
}
