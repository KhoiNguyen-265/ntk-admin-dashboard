export interface AccentColorOption {
  id: string
  name: string
  color: string
  shades: {
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
    950: string
  }
}

export const ACCENT_PALETTES: AccentColorOption[] = [
  {
    id: 'indigo',
    name: 'Indigo Brand',
    color: '#6366f1',
    shades: {
      50: '238 242 255',
      100: '224 231 255',
      200: '199 210 254',
      300: '165 180 252',
      400: '129 140 248',
      500: '99 102 241',
      600: '79 70 229',
      700: '67 56 202',
      800: '55 48 163',
      900: '49 46 129',
      950: '30 27 75',
    },
  },
  {
    id: 'sky',
    name: 'Sky Blue',
    color: '#0ea5e9',
    shades: {
      50: '240 249 255',
      100: '224 242 254',
      200: '186 230 253',
      300: '125 211 252',
      400: '56 189 248',
      500: '14 165 233',
      600: '2 132 199',
      700: '3 105 161',
      800: '7 89 133',
      900: '12 74 110',
      950: '8 47 73',
    },
  },
  {
    id: 'emerald',
    name: 'Emerald',
    color: '#10b981',
    shades: {
      50: '236 253 245',
      100: '209 250 229',
      200: '167 243 208',
      300: '110 231 183',
      400: '52 211 153',
      500: '16 185 129',
      600: '5 150 105',
      700: '4 120 87',
      800: '6 95 70',
      900: '6 78 59',
      950: '2 44 34',
    },
  },
  {
    id: 'purple',
    name: 'Purple',
    color: '#8b5cf6',
    shades: {
      50: '245 243 255',
      100: '237 233 254',
      200: '221 214 254',
      300: '196 181 253',
      400: '167 139 250',
      500: '139 92 246',
      600: '124 58 237',
      700: '109 40 217',
      800: '91 33 182',
      900: '76 29 149',
      950: '46 16 101',
    },
  },
  {
    id: 'amber',
    name: 'Amber',
    color: '#f59e0b',
    shades: {
      50: '255 251 235',
      100: '254 243 199',
      200: '253 230 138',
      300: '252 211 77',
      400: '251 191 36',
      500: '245 158 11',
      600: '217 119 6',
      700: '180 83 9',
      800: '146 64 14',
      900: '120 53 15',
      950: '69 26 3',
    },
  },
  {
    id: 'rose',
    name: 'Rose',
    color: '#f43f5e',
    shades: {
      50: '255 241 242',
      100: '255 228 230',
      200: '254 205 211',
      300: '253 164 175',
      400: '251 113 133',
      500: '244 63 94',
      600: '225 29 72',
      700: '190 18 60',
      800: '159 18 57',
      900: '136 19 55',
      950: '76 5 25',
    },
  },
]

export const DEFAULT_ACCENT_COLOR = '#6366f1'

export function applyAccentColor(hexColor: string) {
  if (typeof document === 'undefined') return

  const normalized = (hexColor || DEFAULT_ACCENT_COLOR).toLowerCase()
  const found = ACCENT_PALETTES.find((p) => p.color.toLowerCase() === normalized)
  const palette = found || ACCENT_PALETTES[0]

  const root = document.documentElement

  // 1. Set CSS Variables on document.documentElement
  Object.entries(palette.shades).forEach(([shade, rgbValue]) => {
    root.style.setProperty(`--color-primary-${shade}`, rgbValue)
  })
  root.style.setProperty('--color-accent-hex', palette.color)

  // 2. Inject or update dedicated style tag for 100% instant CSS rule override
  let styleEl = document.getElementById('nexus-accent-styles') as HTMLStyleElement | null
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = 'nexus-accent-styles'
    document.head.appendChild(styleEl)
  }

  const c600 = palette.color
  const rgb600 = palette.shades[600]
  const rgb500 = palette.shades[500]
  const rgb700 = palette.shades[700]
  const rgb800 = palette.shades[800]
  const rgb50 = palette.shades[50]
  const rgb950 = palette.shades[950]

  styleEl.textContent = `
    :root {
      --color-primary-50: ${rgb50};
      --color-primary-100: ${palette.shades[100]};
      --color-primary-200: ${palette.shades[200]};
      --color-primary-300: ${palette.shades[300]};
      --color-primary-400: ${palette.shades[400]};
      --color-primary-500: ${rgb500};
      --color-primary-600: ${rgb600};
      --color-primary-700: ${rgb700};
      --color-primary-800: ${rgb800};
      --color-primary-900: ${palette.shades[900]};
      --color-primary-950: ${rgb950};
      --color-accent-hex: ${c600};
    }

    /* Primary backgrounds */
    .bg-indigo-600 {
      background-color: rgb(${rgb600}) !important;
    }
    .hover\\:bg-indigo-700:hover {
      background-color: rgb(${rgb700}) !important;
    }
    .active\\:bg-indigo-800:active {
      background-color: rgb(${rgb800}) !important;
    }
    .bg-indigo-50, .bg-indigo-50\\/50, .bg-indigo-50\\/70 {
      background-color: rgba(${rgb600}, 0.08) !important;
    }
    .dark .dark\\:bg-indigo-950,
    .dark .dark\\:bg-indigo-950\\/20,
    .dark .dark\\:bg-indigo-950\\/30,
    .dark .dark\\:bg-indigo-950\\/40,
    .dark .dark\\:bg-indigo-950\\/50,
    .dark .dark\\:bg-indigo-950\\/60,
    .dark .dark\\:bg-indigo-950\\/80 {
      background-color: rgba(${rgb600}, 0.16) !important;
    }

    /* Primary text colors */
    .text-indigo-600 {
      color: rgb(${rgb600}) !important;
    }
    .text-indigo-500 {
      color: rgb(${rgb500}) !important;
    }
    .text-indigo-700 {
      color: rgb(${rgb700}) !important;
    }
    .dark .dark\\:text-indigo-400, .dark .dark\\:text-indigo-300 {
      color: rgb(${rgb500}) !important;
    }

    /* Borders and rings */
    .border-indigo-600 {
      border-color: rgb(${rgb600}) !important;
    }
    .focus\\:border-indigo-500:focus, .dark .dark\\:focus\\:border-indigo-500:focus {
      border-color: rgb(${rgb600}) !important;
    }
    .ring-indigo-500, .ring-indigo-600 {
      --tw-ring-color: rgb(${rgb600}) !important;
    }
    .focus\\:ring-indigo-500:focus, .focus\\:ring-indigo-500\\/20:focus {
      --tw-ring-color: rgba(${rgb500}, 0.25) !important;
    }

    /* Shadows */
    .shadow-indigo-200 {
      --tw-shadow-color: rgba(${rgb500}, 0.25) !important;
    }

    /* Form checkboxes & radios */
    input:checked + .peer-checked\\:bg-indigo-600,
    input:checked ~ .peer-checked\\:bg-indigo-600,
    .peer:checked ~ div.peer-checked\\:bg-indigo-600 {
      background-color: rgb(${rgb600}) !important;
    }
  `
}

export function getInitialAccentColor(): string {
  if (typeof window === 'undefined') return DEFAULT_ACCENT_COLOR
  const saved = localStorage.getItem('nexus_accent_color')
  if (saved && ACCENT_PALETTES.some((p) => p.color.toLowerCase() === saved.toLowerCase())) {
    applyAccentColor(saved)
    return saved
  }
  applyAccentColor(DEFAULT_ACCENT_COLOR)
  return DEFAULT_ACCENT_COLOR
}
