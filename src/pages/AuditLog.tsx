import { useState } from 'react'
import type { Page } from '../App'
import { AUDIT_LOG } from '../data'
import { statusBadge } from '../components/Badge'

interface Props { navigate: (page: Page) => void }

export default function AuditLog({ navigate }: Props) {
  const [search, setSearch] = useState('')
  const [filterUser, setFilterUser] = useState('')
  const [filterResult, setFilterResult] = useState('')

  const filtered = AUDIT_LOG.filter(a => {
    const ms = !search || a.action.toLowerCase().includes(search.toLowerCase()) || a.user.toLowerCase().includes(search.toLowerCase()) || a.caseId.toLowerCase().includes(search.toLowerCase())
    const mu = !filterUser || a.user === filterUser
    const mr = !filterResult || a.result === filterResult
    return ms && mu && mr
  })

  const users = [...new Set(AUDIT_LOG.map(a => a.user))]

  const resultIcon: Record<string, string> = { Success: '✅', Failed: '🚫', Warning: '⚠️' }

  return (
    <div className="page-content fade-in">
      {/* Security notice */}
      <div style={{ background: '#0f2040', borderRadius: 10, padding: '12px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 18 }}>🔒</span>
        <span style={{ color: '#94a3b8', fontSize: 13 }}>
          <strong style={{ color: '#e2e8f0' }}>Immutable Audit Log</strong> — All entries are cryptographically signed and tamper-proof. This log is admissible as evidence. Unauthorized modification is a criminal offence.
        </span>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input className="input-field" style={{ maxWidth: 240 }} placeholder="Search action, user, case…" value={search} onChange={e => setSearch(e.target.value)} />
        <select className="select-field" value={filterUser} onChange={e => setFilterUser(e.target.value)}>
          <option value="">All Users</option>
          {users.map(u => <option key={u}>{u}</option>)}
        </select>
        <select className="select-field" value={filterResult} onChange={e => setFilterResult(e.target.value)}>
          <option value="">All Results</option>
          {['Success', 'Failed', 'Warning'].map(r => <option key={r}>{r}</option>)}
        </select>
        <div style={{ flex: 1 }} />
        <button className="btn-secondary">📥 Export CSV</button>
        <button className="btn-secondary">📄 Export PDF</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
        {[
          { label: 'Total Entries', value: AUDIT_LOG.length, color: '#1d4ed8' },
          { label: 'Successful', value: AUDIT_LOG.filter(a => a.result === 'Success').length, color: '#16a34a' },
          { label: 'Failed (Security)', value: AUDIT_LOG.filter(a => a.result === 'Failed').length, color: '#dc2626' },
          { label: 'Warnings', value: AUDIT_LOG.filter(a => a.result === 'Warning').length, color: '#d97706' },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 18px', display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: 20, color: s.color }}>{s.value}</span>
            <span style={{ fontSize: 12.5, color: '#64748b' }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Log ID</th>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Case / Resource</th>
              <th>IP Address</th>
              <th>Device</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id} style={{ background: a.result === 'Failed' ? '#fff5f5' : a.result === 'Warning' ? '#fffdf0' : undefined }}>
                <td><span className="font-mono" style={{ fontSize: 11, color: '#94a3b8' }}>{a.id}</span></td>
                <td><span className="font-mono" style={{ fontSize: 11.5, color: '#64748b' }}>{a.timestamp}</span></td>
                <td style={{ fontSize: 13, fontWeight: 500, color: a.user === 'UNKNOWN' ? '#dc2626' : '#0f172a' }}>
                  {a.user === 'UNKNOWN' ? '🚨 ' : ''}{a.user}
                </td>
                <td style={{ fontSize: 13, fontWeight: 500 }}>{a.action}</td>
                <td>
                  <span className="font-mono" style={{ fontSize: 11.5, color: '#1d4ed8' }}>{a.caseId !== 'N/A' ? a.caseId : '—'}</span>
                  <br />
                  <span className="font-mono" style={{ fontSize: 10.5, color: '#94a3b8' }}>{a.resource}</span>
                </td>
                <td><span className="font-mono" style={{ fontSize: 11.5, color: a.user === 'UNKNOWN' ? '#dc2626' : '#475569' }}>{a.ipAddress}</span></td>
                <td><span className="font-mono" style={{ fontSize: 11, color: '#64748b' }}>{a.device}</span></td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    {resultIcon[a.result]}
                    {statusBadge(a.result)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 12, fontSize: 12.5, color: '#94a3b8' }}>
        Showing {filtered.length} of {AUDIT_LOG.length} entries · Logs retained for 7 years per regulatory requirements
      </div>
    </div>
  )
}
