import { useState } from 'react'
import type { Page } from '../App'
import { USERS, type User } from '../data'
import Badge, { statusBadge } from '../components/Badge'

interface Props { navigate: (page: Page) => void }

const ROLE_PERMISSIONS: Record<string, string[]> = {
  'Administrator': ['View Cases', 'Create Cases', 'Edit Cases', 'Delete Cases', 'View Evidence', 'Upload Evidence', 'View Documents', 'Upload Documents', 'View Audit Logs', 'Manage Users', 'Generate Reports', 'Assign Investigators'],
  'Investigator': ['View Cases', 'Create Cases', 'Edit Cases', 'View Evidence', 'Upload Evidence', 'View Documents', 'Upload Documents', 'Generate Reports'],
  'Legal Officer': ['View Cases', 'View Evidence', 'View Documents', 'Upload Documents', 'Generate Reports'],
  'Evidence Officer': ['View Cases', 'View Evidence', 'Upload Evidence', 'View Documents'],
  'Viewer': ['View Cases', 'View Evidence', 'View Documents'],
}

const roleColor = (role: string) => {
  const m: Record<string, { bg: string, color: string }> = {
    'Administrator': { bg: '#fef2f2', color: '#991b1b' },
    'Investigator': { bg: '#eff6ff', color: '#1d4ed8' },
    'Legal Officer': { bg: '#f5f3ff', color: '#6d28d9' },
    'Evidence Officer': { bg: '#fff7ed', color: '#c2410c' },
    'Viewer': { bg: '#f8fafc', color: '#475569' },
  }
  return m[role] ?? { bg: '#f8fafc', color: '#475569' }
}

export default function UserManagement({ navigate }: Props) {
  const [selected, setSelected] = useState<User | null>(null)
  const [search, setSearch] = useState('')

  const filtered = USERS.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.role.toLowerCase().includes(search.toLowerCase()) || u.department.toLowerCase().includes(search.toLowerCase())
  )

  if (selected) {
    const perms = ROLE_PERMISSIONS[selected.role] ?? []
    const allPerms = ROLE_PERMISSIONS['Administrator']
    return (
      <div className="page-content fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 13, color: '#64748b' }}>
          <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#1d4ed8', cursor: 'pointer', fontSize: 13, padding: 0 }}>← Users & Roles</button>
          <span>/</span>
          <span style={{ color: '#0f172a', fontWeight: 600 }}>{selected.name}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: 20, fontWeight: 700,
              }}>{selected.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#0f172a' }}>{selected.name}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>{selected.email}</div>
                <div style={{ marginTop: 4 }}>
                  <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700, background: roleColor(selected.role).bg, color: roleColor(selected.role).color }}>
                    {selected.role}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['User ID', selected.id],
                ['Department', selected.department],
                ['Account Status', selected.status],
                ['Last Login', selected.lastLogin],
                ['Cases Assigned', String(selected.casesAssigned)],
                ['Joined Date', selected.joinDate],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: 13, color: '#64748b' }}>{k}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: 12.5 }}>✏️ Edit Profile</button>
              {selected.status === 'Active'
                ? <button className="btn-danger" style={{ flex: 1, justifyContent: 'center', fontSize: 12.5 }}>⛔ Suspend</button>
                : <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: 12.5 }}>✅ Activate</button>}
            </div>
          </div>
          <div className="card" style={{ padding: 22 }}>
            <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Role-Based Permissions</h3>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12.5, color: '#64748b', marginBottom: 8 }}>Current Role: <strong style={{ color: '#0f172a' }}>{selected.role}</strong></div>
              <select className="select-field" style={{ width: '100%' }}>
                {Object.keys(ROLE_PERMISSIONS).map(r => <option key={r} selected={r === selected.role}>{r}</option>)}
              </select>
            </div>
            <div style={{ borderRadius: 8, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              {allPerms.map(p => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 14px', borderBottom: '1px solid #f8fafc' }}>
                  <span style={{ fontSize: 13 }}>{p}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: perms.includes(p) ? '#16a34a' : '#d1d5db' }}>
                    {perms.includes(p) ? '✓ Granted' : '✗ Denied'}
                  </span>
                </div>
              ))}
            </div>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 14, fontSize: 13 }}>Save Permission Changes</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content fade-in">
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input className="input-field" style={{ maxWidth: 260 }} placeholder="Search users, role, department…" value={search} onChange={e => setSearch(e.target.value)} />
        <div style={{ flex: 1 }} />
        <button className="btn-primary">➕ Add User</button>
      </div>

      {/* Role summary */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        {Object.entries(ROLE_PERMISSIONS).map(([role]) => {
          const count = USERS.filter(u => u.role === role).length
          const c = roleColor(role)
          return (
            <div key={role} style={{ padding: '6px 14px', borderRadius: 8, background: c.bg, border: `1px solid ${c.color}30`, display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: c.color }}>{count}</span>
              <span style={{ fontSize: 12.5, color: '#64748b' }}>{role}</span>
            </div>
          )
        })}
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>User ID</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Cases</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const c = roleColor(u.role)
              return (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #1e40af, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                        {u.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{u.name}</div>
                        <div style={{ fontSize: 11.5, color: '#94a3b8' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="font-mono" style={{ fontSize: 11.5, color: '#64748b' }}>{u.id}</span></td>
                  <td><span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700, background: c.bg, color: c.color }}>{u.role}</span></td>
                  <td style={{ fontSize: 13, color: '#475569' }}>{u.department}</td>
                  <td>{statusBadge(u.status)}</td>
                  <td><span className="font-mono" style={{ fontSize: 11.5, color: '#64748b' }}>{u.lastLogin}</span></td>
                  <td style={{ textAlign: 'center', fontWeight: 700, color: '#1d4ed8' }}>{u.casesAssigned}</td>
                  <td>
                    <button className="btn-primary" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => setSelected(u)}>Manage →</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
