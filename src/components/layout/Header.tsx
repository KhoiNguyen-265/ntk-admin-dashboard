import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Menu,
  Moon,
  Sun,
  Bell,
  Search,
  CheckCheck,
  Package,
  ShoppingCart,
  User,
  ExternalLink,
  Settings as SettingsIcon,
  LogOut,
} from 'lucide-react'
import { useSidebarStore } from '@/store/useSidebarStore'
import { useThemeStore } from '@/store/useThemeStore'
import { useToastStore } from '@/store/useToastStore'
import { useProductStore } from '@/store/useProductStore'
import { useOrderStore } from '@/store/useOrderStore'
import { useLanguageStore } from '@/store/useLanguageStore'
import { LanguageSelector } from '@/components/common/LanguageSelector'
import { formatCurrency } from '@/lib/utils'

interface MockNotification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: 'order' | 'product' | 'system'
}

const initialNotifications: MockNotification[] = [
  {
    id: 'notif-1',
    title: 'New Order Received',
    message: 'Order #ORD-9842 placed by Sarah Jenkins ($647.92)',
    time: '5 mins ago',
    read: false,
    type: 'order',
  },
  {
    id: 'notif-2',
    title: 'Low Stock Alert',
    message: 'Lumix Mechanical RGB Keyboard has only 7 units left!',
    time: '42 mins ago',
    read: false,
    type: 'product',
  },
  {
    id: 'notif-3',
    title: 'Database Backup Completed',
    message: 'Automated nightly sync completed successfully.',
    time: '3 hours ago',
    read: true,
    type: 'system',
  },
]

export function Header() {
  const navigate = useNavigate()
  const { openMobile } = useSidebarStore()
  const { isDark, toggleTheme } = useThemeStore()
  const { info } = useToastStore()
  const { products } = useProductStore()
  const { orders } = useOrderStore()
  const { t } = useLanguageStore()

  // State
  const [notifications, setNotifications] = useState<MockNotification[]>(initialNotifications)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    info('All notifications marked as read')
  }

  // Live search results
  const searchResults = searchQuery.trim()
    ? {
        products: products
          .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, 3),
        orders: orders
          .filter(
            (o) =>
              o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
              o.customerName.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 3),
      }
    : null

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left Side: Mobile toggle + Quick search */}
        <div className="flex items-center gap-3 flex-1 max-w-lg">
          <button
            onClick={openMobile}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Global search input */}
          <div className="relative w-full" ref={searchRef}>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setIsSearchOpen(true)
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder={t.header.searchPlaceholder}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-900 transition-colors duration-150"
              />
            </div>

            {/* Quick search popup results */}
            {isSearchOpen && searchResults && (
              <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50">
                <div className="text-[11px] font-semibold text-slate-400 uppercase px-3 py-1.5">
                  Products
                </div>
                {searchResults.products.length > 0 ? (
                  searchResults.products.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        navigate('/products')
                        setIsSearchOpen(false)
                        setSearchQuery('')
                      }}
                      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-indigo-500" />
                        <span className="font-medium text-slate-800 dark:text-slate-200">{p.name}</span>
                      </div>
                      <span className="text-slate-500">{formatCurrency(p.price)}</span>
                    </div>
                  ))
                ) : (
                  <p className="px-3 py-1 text-xs text-slate-400">No matching products</p>
                )}

                <div className="text-[11px] font-semibold text-slate-400 uppercase px-3 py-1.5 mt-2 border-t border-slate-100 dark:border-slate-800">
                  Orders
                </div>
                {searchResults.orders.length > 0 ? (
                  searchResults.orders.map((o) => (
                    <div
                      key={o.id}
                      onClick={() => {
                        navigate('/orders')
                        setIsSearchOpen(false)
                        setSearchQuery('')
                      }}
                      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-emerald-500" />
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {o.orderNumber} - {o.customerName}
                        </span>
                      </div>
                      <span className="text-slate-500">{formatCurrency(o.totalAmount)}</span>
                    </div>
                  ))
                ) : (
                  <p className="px-3 py-1 text-xs text-slate-400">No matching orders</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Language selector + Theme toggle + Notifications + Profile dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <LanguageSelector />

          {/* Dark/Light mode toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400 transition-transform duration-200 rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600 transition-transform duration-200 rotate-0 hover:-rotate-12" />
            )}
          </button>

          {/* Notifications dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen((prev) => !prev)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              aria-label="Open notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">
                      {t.header.notifications}
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-[11px] font-semibold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 rounded-full">
                        {unreadCount} {t.header.newBadge}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      {t.header.markAllRead}
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-start gap-3 ${
                        !n.read ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white ${
                          n.type === 'order'
                            ? 'bg-emerald-500'
                            : n.type === 'product'
                            ? 'bg-amber-500'
                            : 'bg-indigo-500'
                        }`}
                      >
                        {n.type === 'order' ? (
                          <ShoppingCart className="w-4 h-4" />
                        ) : n.type === 'product' ? (
                          <Package className="w-4 h-4" />
                        ) : (
                          <Bell className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {n.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                          {n.message}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2 border-t border-slate-100 dark:border-slate-800 text-center">
                  <button
                    onClick={() => {
                      setIsNotifOpen(false)
                      navigate('/orders')
                    }}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                  >
                    View All Orders <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile user dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-indigo-500/20 transition-all focus:outline-none"
              aria-label="User profile menu"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
                alt="Alex Morgan"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Alex Morgan</p>
                  <p className="text-xs text-slate-400 truncate">alex.morgan@nexuscommerce.io</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 rounded-full">
                    {t.header.superAdmin}
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false)
                      navigate('/settings')
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    {t.header.myProfile}
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false)
                      navigate('/settings')
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <SettingsIcon className="w-4 h-4 text-slate-400" />
                    {t.header.storeSettings}
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false)
                      info('Signed out of demo session')
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    {t.header.signOut}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
