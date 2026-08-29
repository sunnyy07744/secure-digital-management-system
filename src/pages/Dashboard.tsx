import type { Page } from '../App'
import { CASES, NOTIFICATIONS, AUDIT_LOG } from '../data'
import { priorityBadge, statusBadge } from '../components/Badge'

interface Props { navigate: (page: Page, extra?: Record<string, string>) => void }

const stats = [
  { label: 'Total Active Cases', value: 6, sub: '+2 this month', color: '#1d4ed8', bg: '#eff6ff', icon: '📂' },
  { label: 'Closed Cases', value: 2, sub: 'FY 2023-24', color: '#16a34a', bg: '#f0fdf4', icon: '✅' },
  { label: 'Pending Investigation', value: 2, sub: 'Awaiting assignment', color: '#d97706', bg: '#fffbeb', icon: '⏳' },
  { label: 'Critical Priority', value: 4, sub: 'Require immediate action', color: '#dc2626', bg: '#fef2f2', icon: '🚨' },
  { label: 'Evidence Items', value: 216, sub: 'All verified ✓', color: '#7c3aed', bg: '#f5f3ff', icon: '🔍' },
  { label: 'Investigators Active', value: 6, sub: '2 in field operations', color: '#0284c7', bg: '#f0f9ff', icon: '👮' },
]

const quickActions = [
  { label: 'Create New Case', icon: '➕', page: 'cases' as Page, color: '#1d4ed8' },
  { label: 'Upload Evidence', icon: '📤', page: 'evidence' as Page, color: '#7c3aed' },
  { label: 'Search Cases', icon: '🔍', page: 'search' as Page, color: '#0284c7' },
  { label: 'Generate Report', icon: '📊', page: 'reports' as Page, color: '#16a34a' },
]

const statusData = [
  { label: 'Active', count: 6, pct: 75, color: '#1d4ed8' },
  { label: 'Pending', count: 2, pct: 25, color: '#d97706' },
  { label: 'Closed', count: 2, pct: 25, color: '#16a34a' },
  { label: 'On Hold', count: 0, pct: 0, color: '#7c3aed' },
]

export default function Dashboard({ navigate }: Props) {
  const recentCases = CASES.slice(0, 5)
  const unread = NOTIFICATIONS.filter(n => !n.read)

  return (
    <div className="page-content fade-in">
      {/* Security banner */}
      <div style={{ background: 'linear-gradient(90deg, #0f2040, #1e3a8a)', borderRadius: 10, padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 22 }}>🛡️</span>
        <div>
          <div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 14 }}>Secure Digital Management System — Law Enforcement Division</div>
          <div style={{ color: '#4a7aab', fontSize: 12, marginTop: 2 }}>Classification: RESTRICTED | Session authenticated via 2FA | All activity monitored and logged</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ color: '#4ade80', fontSize: 12, fontWeight: 600 }}>● System Operational</div>
          <div style={{ color: '#475569', fontSize: 11, marginTop: 2 }}>Last sync: just now</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginTop: 3 }}>{s.label}</div>
              <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 2 }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, marginBottom: 20 }}>
        {/* Recent Cases */}
        <div className="card">
          <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Recent Cases</h3>
            <button className="btn-secondary" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => navigate('cases')}>View All →</button>
          </div>
          <div style={{ padding: '12px 0 4px' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Title</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Investigator</th>
                </tr>
              </thead>
              <tbody>
                {recentCases.map(c => (
                  <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => navigate('case-detail', { selectedCaseId: c.id })}>
                    <td><span className="font-mono" style={{ fontSize: 12, color: '#1d4ed8' }}>{c.id}</span></td>
                    <td style={{ maxWidth: 200 }}>
                      <div style={{ fontWeight: 500, fontSize: 13, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{c.type}</div>
                    </td>
                    <td>{priorityBadge(c.priority)}</td>
                    <td>{statusBadge(c.status)}</td>
                    <td style={{ fontSize: 13, color: '#475569' }}>{c.investigator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Quick Actions */}
          <div className="card" style={{ padding: 18 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {quickActions.map(a => (
                <button
                  key={a.label}
                  onClick={() => navigate(a.page)}
                  style={{
                    padding: '12px 8px', borderRadius: 8, border: '1px solid #e2e8f0',
                    background: 'white', cursor: 'pointer', textAlign: 'center',
                    transition: 'all 0.15s',
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.background = '#f8fafc' }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white' }}
                >
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{a.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{a.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Case Status Chart */}
          <div className="card" style={{ padding: 18 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>Case Status Overview</h3>
            {statusData.map(s => (
              <div key={s.label} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 500, color: '#374151' }}>{s.label}</span>
                  <span style={{ fontSize: 12, color: '#64748b' }}>{s.count}</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: '#f1f5f9', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: 3, transition: 'width 0.3s' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Recent Alerts */}
        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Recent Alerts</h3>
            <button className="btn-secondary" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => navigate('notifications')}>All Alerts</button>
          </div>
          {unread.map(n => {
            const colors = {
              critical: { bg: '#fef2f2', border: '#fecaca', icon: '🚨', text: '#991b1b' },
              warning: { bg: '#fffbeb', border: '#fde68a', icon: '⚠️', text: '#92400e' },
              info: { bg: '#eff6ff', border: '#bfdbfe', icon: 'ℹ️', text: '#1e40af' },
              success: { bg: '#f0fdf4', border: '#bbf7d0', icon: '✅', text: '#166534' },
            }
            const c = colors[n.type]
            return (
              <div key={n.id} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 8, padding: '10px 12px', marginBottom: 8 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 15, flexShrink: 0 }}>{c.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: c.text }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2, lineHeight: 1.4 }}>{n.message.slice(0, 90)}…</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{n.time}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Recent Activity */}
        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Recent Activity</h3>
            <button className="btn-secondary" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => navigate('audit')}>View Logs</button>
          </div>
          {AUDIT_LOG.slice(0, 5).map(a => {
            const isError = a.result === 'Failed'
            const isWarning = a.result === 'Warning'
            return (
              <div key={a.id} style={{ display: 'flex', gap: 10, paddingBottom: 10, marginBottom: 10, borderBottom: '1px solid #f1f5f9', alignItems: 'flex-start' }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 5,
                  background: isError ? '#dc2626' : isWarning ? '#d97706' : '#16a34a',
                }} />
                <div>
                  <div style={{ fontSize: 13, color: '#0f172a', fontWeight: 500 }}>{a.action}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{a.user} · <span className="font-mono" style={{ fontSize: 11 }}>{a.caseId !== 'N/A' && a.caseId !== 'ALL' ? a.caseId : a.resource}</span></div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{a.timestamp}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
