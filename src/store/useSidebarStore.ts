import { create } from 'zustand'

interface SidebarState {
  isCollapsed: boolean
  isMobileOpen: boolean
  toggleCollapse: () => void
  setCollapsed: (collapsed: boolean) => void
  openMobile: () => void
  closeMobile: () => void
  toggleMobile: () => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: false,
  isMobileOpen: false,
  toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  setCollapsed: (collapsed: boolean) => set({ isCollapsed: collapsed }),
  openMobile: () => set({ isMobileOpen: true }),
  closeMobile: () => set({ isMobileOpen: false }),
  toggleMobile: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
}))
