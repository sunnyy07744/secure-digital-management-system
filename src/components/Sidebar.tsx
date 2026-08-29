import type { Page } from '../App'

interface Props {
  current: Page
  navigate: (page: Page) => void
  onLogout: () => void
}

const navItems: { id: Page; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦' },
  { id: 'cases', label: 'Cases', icon: '◫' },
  { id: 'evidence', label: 'Evidence', icon: '⬡' },
  { id: 'documents', label: 'Documents', icon: '◧' },
  { id: 'timeline', label: 'Investigations', icon: '◉' },
  { id: 'reports', label: 'Reports', icon: '◪' },
  { id: 'audit', label: 'Audit Logs', icon: '▤' },
  { id: 'notifications', label: 'Notifications', icon: '◎' },
  { id: 'users', label: 'Users & Roles', icon: '◈' },
  { id: 'settings', label: 'Settings', icon: '◌' },
]

export default function Sidebar({ current, navigate, onLogout }: Props) {
  return (
    <div style={{
      width: 228,
      minWidth: 228,
      background: '#0a1628',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #1a2d45',
      height: '100%',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 18px 14px', borderBottom: '1px solid #1a2d45' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0,
          }}>🔒</div>
          <div>
            <div style={{ color: '#f1f5f9', fontSize: 12, fontWeight: 700, lineHeight: 1.2, letterSpacing: '0.02em' }}>SDMS</div>
            <div style={{ color: '#475569', fontSize: 10, lineHeight: 1.3 }}>Legal & Investigation</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: '#334155', padding: '4px 6px 8px', textTransform: 'uppercase' }}>Navigation</div>
        {navItems.map(item => (
          <div
            key={item.id}
            className={`sidebar-item ${current === item.id || (current === 'case-detail' && item.id === 'cases') || (current === 'evidence-detail' && item.id === 'evidence') ? 'active' : ''}`}
            onClick={() => navigate(item.id)}
          >
            <span style={{ fontSize: 14, width: 18, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
            <span>{item.label}</span>
            {item.id === 'notifications' && (
              <span style={{
                marginLeft: 'auto', background: '#dc2626', color: 'white',
                fontSize: 10, fontWeight: 700, borderRadius: 10,
                padding: '1px 6px', lineHeight: '16px',
              }}>3</span>
            )}
          </div>
        ))}
      </nav>

      {/* User profile */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid #1a2d45' }}>
        <div style={{ padding: '10px 12px', borderRadius: 8, background: '#0f2040' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 13, fontWeight: 700, flexShrink: 0,
            }}>RS</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: '#e2e8f0', fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>ACP Rajendra Singh</div>
              <div style={{ color: '#4a7aab', fontSize: 11 }}>Administrator</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            style={{
              width: '100%', padding: '6px', borderRadius: 5,
              background: 'transparent', border: '1px solid #1e3a5f',
              color: '#64748b', fontSize: 12, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'all 0.15s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = '#1a2d45'
              e.currentTarget.style.color = '#94a3b8'
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#64748b'
            }}
          >
            <span>↩</span> Logout
          </button>
        </div>
      </div>
    </div>
  )
}
