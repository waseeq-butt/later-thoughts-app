import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Home', icon: 'M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z' },
  { to: '/thoughts', label: 'Thoughts', icon: 'M4 5h16M4 12h16M4 19h10' },
  { to: '/trash', label: 'Trash', icon: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13' },
]

export default function BottomBar() {
  return (
    <nav className="pb-safe flex shrink-0 border-t border-raised bg-app">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end
          className={({ isActive }) =>
            `flex min-h-16 flex-1 flex-col items-center justify-center gap-1 text-xs transition-colors ${
              isActive ? 'text-white' : 'text-muted'
            }`
          }
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d={t.icon} />
          </svg>
          {t.label}
        </NavLink>
      ))}
    </nav>
  )
}
