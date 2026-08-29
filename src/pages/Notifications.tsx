import { useState } from 'react'
import type { Page } from '../App'
import { NOTIFICATIONS, type Notification } from '../data'

interface Props { navigate: (page: Page, extra?: Record<string, string>) => void }

export default function Notifications({ navigate }: Props) {
  const [notifs, setNotifs] = useState(NOTIFICATIONS)
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical' | 'warning'>('all')

  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  const markAll = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })))

  const filtered = notifs.filter(n => {
    if (filter === 'unread') return !n.read
    if (filter === 'critical') return n.type === 'critical'
    if (filter === 'warning') return n.type === 'warning'
    return true
  })

  const config: Record<Notification['type'], { bg: string; border: string; icon: string; label: string; textColor: string }> = {
    critical: { bg: '#fef2f2', border: '#fecaca', icon: '🚨', label: 'CRITICAL', textColor: '#991b1b' },
    warning:  { bg: '#fffbeb', border: '#fde68a', icon: '⚠️', label: 'WARNING', textColor: '#92400e' },
    info:     { bg: '#f0f9ff', border: '#bae6fd', icon: 'ℹ️', label: 'INFO', textColor: '#0369a1' },
    success:  { bg: '#f0fdf4', border: '#bbf7d0', icon: '✅', label: 'SUCCESS', textColor: '#15803d' },
  }

  const unreadCount = notifs.filter(n => !n.read).length

  return (
    <div className="page-content fade-in">
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
        {(['all', 'unread', 'critical', 'warning'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 16px', borderRadius: 20, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', border: 'none',
              background: filter === f ? '#0f2040' : '#f1f5f9',
              color: filter === f ? '#e2e8f0' : '#64748b',
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'unread' && unreadCount > 0 && <span style={{ marginLeft: 6, background: '#dc2626', color: 'white', borderRadius: 10, padding: '0px 6px', fontSize: 10.5 }}>{unreadCount}</span>}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        {unreadCount > 0 && (
          <button className="btn-secondary" style={{ fontSize: 12.5 }} onClick={markAll}>Mark All Read</button>
        )}
      </div>

      {/* Summary */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        {[
          { type: 'critical', label: 'Critical', count: notifs.filter(n => n.type === 'critical').length },
          { type: 'warning', label: 'Warnings', count: notifs.filter(n => n.type === 'warning').length },
          { type: 'info', label: 'Info', count: notifs.filter(n => n.type === 'info').length },
          { type: 'success', label: 'Success', count: notifs.filter(n => n.type === 'success').length },
        ].map(s => {
          const c = config[s.type as Notification['type']]
          return (
            <div key={s.type} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 8, padding: '10px 18px', display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 18 }}>{c.icon}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, color: c.textColor }}>{s.count}</div>
                <div style={{ fontSize: 11.5, color: '#64748b' }}>{s.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔔</div>
            <div>No notifications to show.</div>
          </div>
        ) : filtered.map(n => {
          const c = config[n.type]
          return (
            <div
              key={n.id}
              style={{
                background: n.read ? 'white' : c.bg,
                border: `1px solid ${n.read ? '#e2e8f0' : c.border}`,
                borderRadius: 10, padding: '14px 18px',
                display: 'flex', gap: 14, alignItems: 'flex-start',
                cursor: 'default', transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>{c.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: n.read ? '#374151' : c.textColor }}>{n.title}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 10, background: c.bg, color: c.textColor, border: `1px solid ${c.border}` }}>{c.label}</span>
                  {!n.read && <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.textColor }} />}
                </div>
                <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.6, margin: 0 }}>{n.message}</p>
                <div style={{ display: 'flex', gap: 16, marginTop: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>🕐 {n.time}</span>
                  {n.caseId && (
                    <button
                      onClick={() => navigate('case-detail', { selectedCaseId: n.caseId! })}
                      style={{ background: 'none', border: 'none', color: '#1d4ed8', fontSize: 12, cursor: 'pointer', padding: 0, fontWeight: 600 }}
                    >
                      View Case {n.caseId} →
                    </button>
                  )}
                  {!n.read && (
                    <button onClick={() => markRead(n.id)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 12, cursor: 'pointer', padding: 0 }}>
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
