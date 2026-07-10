import { h, defineComponent, type Component } from 'vue'

export interface NavChild {
  name: string
  label: string
  to: string
}

export type ThemeShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950

export interface NavItem {
  name: string
  label: string
  to?: string
  icon: Component
  children?: NavChild[]
  trackShade?: ThemeShade
}

function createIcon(path: string): Component {
  return defineComponent({
    setup() {
      return () =>
        h(
          'svg',
          {
            class: 'h-5.5 w-5.5',
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24',
          },
          [
            h('path', {
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              'stroke-width': 2,
              d: path,
            }),
          ],
        )
    },
  })
}

export const NAV_ITEMS: NavItem[] = [
  {
    name: 'dashboard',
    label: 'Dashboard',
    to: '/admin/dashboard',
    trackShade: 500,
    icon: createIcon(
      'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    ),
  },
  {
    name: 'users',
    label: 'User Management',
    trackShade: 600,
    icon: createIcon(
      'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
    ),
    children: [
      { name: 'users', label: 'All Users', to: '/admin/users' },
      { name: 'students', label: 'Students', to: '/admin/students' },
      { name: 'tutors', label: 'Tutors', to: '/admin/tutors' },
    ],
  },
  {
    name: 'companies',
    label: 'Companies',
    to: '/admin/companies',
    trackShade: 500,
    icon: createIcon(
      'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    ),
  },
  {
    name: 'batches',
    label: 'Batches',
    to: '/admin/batches',
    trackShade: 400,
    icon: createIcon(
      'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    ),
  },
  {
    name: 'assignments',
    label: 'Assignments',
    to: '/admin/assignments',
    trackShade: 500,
    icon: createIcon(
      'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
    ),
  },
  {
    name: 'reports',
    label: 'Reports',
    to: '/admin/reports',
    trackShade: 600,
    icon: createIcon(
      'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    ),
  },
]
