# NTK Admin Dashboard

[![React 19](https://img.shields.io/badge/React-19.0-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0-brown)](https://github.com/pmndrs/zustand)
[![Recharts](https://img.shields.io/badge/Recharts-3.8-22c55e)](https://recharts.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A modern, responsive, high-performance **SaaS & E-Commerce Admin Dashboard** built with **React 19, Vite, TypeScript, and Tailwind CSS**. Features full multi-language i18n support, dynamic live accent color palette, dark/light theme, interactive analytics charts, and zero decorative buttons — all CRUD, search, filter, and pagination interactions are fully functional.

---

## 🌟 Key Features

### 🎨 UI & User Experience (UX)
- **Modern Minimalist SaaS Design:** Soft shadows, 10–14px rounded corners, neutral slate base, and vibrant accent colors.
- **Light / Dark Mode:** Instant theme toggle with seamless background transitions, synced to `localStorage` and `<html>` classes.
- **Dynamic Accent Color Palette:** Real-time color palette customization (Indigo Brand, Sky Blue, Emerald, Purple, Amber, Rose) dynamically injecting live CSS variables without reloads.
- **Global Multi-Language (i18n):** Complete runtime language switcher supporting **English (EN)**, **Tiếng Việt (VI)**, and **日本語 (JA)** across all 8 modules.
- **Responsive Navigation:**
  - **Desktop:** Collapsible sidebar with centered icon badges, live status dots, and floating expand/collapse button.
  - **Mobile / Tablet:** Smooth backdrop-blurred sliding drawer with full navigation access.
- **Global Quick Search (`Ctrl + K`):** Header search bar with instant dropdown results across products and orders with smooth, flicker-free focus rings.
- **Toast Notifications:** Built-in floating notification toast system for success, info, warning, and error states.

---

### 📊 Pages & Capabilities

| Page | Path | Highlights & Core Interactions |
| :--- | :--- | :--- |
| **Dashboard** | `/dashboard` | 4 KPI Cards (Revenue, Orders, Customers, Products), interactive Recharts revenue area chart with metric toggles, recent orders, top products, and 7D / 30D / 3M / 12M time filters. |
| **Products** | `/products` | Live search, multi-field filtering (category, stock status), sorting, pagination, strict form validation modal (Add/Edit), safe delete confirmation, and CSV export. |
| **Categories** | `/categories` | Category CRUD, auto-generated URL slugs, real-time product count aggregation, and deletion safeguards. |
| **Orders** | `/orders` | Order statistics, status filters, payment status filters, inline status updating, detailed invoice modal with items breakdown & shipping info, and CSV export. |
| **Customers** | `/customers` | Customer directory, lifetime spend tracking, order counts, status badges, customer modal, and CSV export. |
| **Analytics** | `/analytics` | Deep metrics: Revenue & Profit area charts, Category Sales donut chart, Customer Growth bar chart, Order Status distribution, and Top Performing Products table. |
| **Messages** | `/messages` | Full 2-way chat simulator, online/offline presence indicators, unread message badges, and automated response simulation. |
| **Settings** | `/settings` | 5 tabs: Store General Info, Profile & Avatar, Security (2FA & Session timeouts), Notification Rules, and Appearance (Theme & Accent Color Palette). |

---

## 🛠️ Tech Stack & Architecture

- **Core:** [React 19](https://react.dev/), [TypeScript (Strict Mode)](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v3](https://tailwindcss.com/), PostCSS, Autoprefixer
- **State Management:** [Zustand v5](https://github.com/pmndrs/zustand) (Modular stores for products, categories, orders, customers, theme, i18n, toasts, and settings)
- **Data Visualization:** [Recharts](https://recharts.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Routing:** [React Router DOM v7](https://reactrouter.com/)
- **Networking:** [Axios](https://axios-http.com/) configured with baseURL and request/response interceptors (ready for REST API plug-in)

---

## 📂 Project Structure

```text
src/
├── components/
│   ├── common/          # Button, Card, Badge, Modal, ConfirmDialog, Pagination, SearchInput, Toast
│   ├── layout/          # Header, Sidebar, MobileDrawer, MainLayout
│   ├── dashboard/       # StatCard, RevenueChart, RecentOrdersTable, TopProductsCard
│   ├── products/        # ProductModal
│   ├── categories/      # CategoryModal
│   ├── orders/          # OrderDetailModal, OrderStatusBadge
│   └── customers/       # CustomerModal
├── pages/               # Dashboard, Products, Categories, Orders, Customers, Analytics, Messages, Settings, 404
├── data/                # Mock datasets (products, categories, orders, customers, analytics, messages)
├── locales/             # i18n translation dictionaries (en.ts, vi.ts, ja.ts)
├── store/               # Zustand state stores (useProductStore, useThemeStore, useLanguageStore, etc.)
├── hooks/               # useDebounce, usePagination, custom hooks
├── types/               # Strict TypeScript definitions & interfaces
├── lib/                 # utils (formatters, CSV exporter), accentColors, Axios API client
├── App.tsx              # Application routes & provider setup
└── main.tsx             # Application mount entrypoint
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/KhoiNguyen-265/ntk-admin-dashboard.git
   cd ntk-admin-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Build for production:**
   ```bash
   npm run build
   ```
   Generates an optimized, production-ready bundle in the `dist/` directory.

5. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## 🌐 Multi-Language (i18n)

The dashboard provides native localization without heavy external dependencies. Easily add new languages by creating a locale dictionary in `src/locales/`:
- `en.ts` (English)
- `vi.ts` (Tiếng Việt)
- `ja.ts` (日本語)

State is handled reactively by `useLanguageStore` with automatic `localStorage` persistence.

---

## 🎨 Accent Color Palette

Customize the primary brand color directly from `/settings` (Appearance tab):
- **Indigo Brand** (`#6366f1`)
- **Sky Blue** (`#0ea5e9`)
- **Emerald** (`#10b981`)
- **Purple** (`#8b5cf6`)
- **Amber** (`#f59e0b`)
- **Rose** (`#f43f5e`)

Changes instantly update CSS variables `--color-primary-*` and update Recharts gradients in real time.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

Author: **Khoi Nguyen** ([@KhoiNguyen-265](https://github.com/KhoiNguyen-265))
