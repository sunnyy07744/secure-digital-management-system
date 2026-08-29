import { useState } from 'react'
import type { Page } from '../App'
import { DOCUMENTS } from '../data'
import { accessBadge } from '../components/Badge'

interface Props { navigate: (page: Page) => void }

export default function Documents({ navigate }: Props) {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterAccess, setFilterAccess] = useState('')

  const filtered = DOCUMENTS.filter(d => {
    const ms = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.caseId.toLowerCase().includes(search.toLowerCase()) || d.uploadedBy.toLowerCase().includes(search.toLowerCase())
    const mt = !filterType || d.type === filterType
    const ma = !filterAccess || d.accessLevel === filterAccess
    return ms && mt && ma
  })

  const typeIcon: Record<string, string> = {
    'FIR': '🚨', 'Investigation Report': '📋', 'Statement': '📝',
    'Court Document': '⚖️', 'Evidence Report': '🔍', 'Legal Document': '📜',
  }

  return (
    <div className="page-content fade-in">
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input className="input-field" style={{ maxWidth: 260 }} placeholder="Search documents, case ID, author…" value={search} onChange={e => setSearch(e.target.value)} />
        <select className="select-field" value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          {['FIR', 'Investigation Report', 'Statement', 'Court Document', 'Evidence Report', 'Legal Document'].map(t => <option key={t}>{t}</option>)}
        </select>
        <select className="select-field" value={filterAccess} onChange={e => setFilterAccess(e.target.value)}>
          <option value="">All Access Levels</option>
          {['Public', 'Restricted', 'Confidential', 'Top Secret'].map(a => <option key={a}>{a}</option>)}
        </select>
        <div style={{ flex: 1 }} />
        <button className="btn-primary">📤 Upload Document</button>
      </div>

      {/* Access level legend */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center', fontSize: 12.5, color: '#64748b' }}>
        <span>Access levels:</span>
        {['Public', 'Restricted', 'Confidential', 'Top Secret'].map(l => (
          <span key={l}>{accessBadge(l)}</span>
        ))}
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Doc ID</th>
              <th>Document Name</th>
              <th>Type</th>
              <th>Case ID</th>
              <th>Uploaded By</th>
              <th>Date</th>
              <th>Version</th>
              <th>Size</th>
              <th>Access Level</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.id}>
                <td><span className="font-mono" style={{ fontSize: 11.5, color: '#1d4ed8', fontWeight: 600 }}>{d.id}</span></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{typeIcon[d.type] ?? '📄'}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{d.name}</div>
                      <div style={{ fontSize: 11.5, color: '#94a3b8' }}>{d.caseName}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: 12.5, color: '#475569' }}>{d.type}</td>
                <td><span className="font-mono" style={{ fontSize: 11.5, color: '#1d4ed8' }}>{d.caseId}</span></td>
                <td style={{ fontSize: 12.5, color: '#475569' }}>{d.uploadedBy}</td>
                <td style={{ fontSize: 12.5, color: '#64748b' }}>{d.date}</td>
                <td><span className="font-mono" style={{ fontSize: 12 }}>v{d.version}</span></td>
                <td style={{ fontSize: 12.5, color: '#64748b' }}>{d.size}</td>
                <td>{accessBadge(d.accessLevel)}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: 11.5 }}>👁 View</button>
                    <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: 11.5 }}>⬇</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 12, fontSize: 12.5, color: '#94a3b8' }}>
        Showing {filtered.length} of {DOCUMENTS.length} documents · All document access is logged in the audit trail
      </div>
    </div>
  )
}
