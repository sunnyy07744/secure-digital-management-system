import { useState } from 'react'
import type { Page } from '../App'
import { EVIDENCE, type Evidence } from '../data'
import Badge, { statusBadge } from '../components/Badge'

interface Props {
  navigate: (page: Page, extra?: Record<string, string>) => void
  selectedEvidenceId?: string
}

const CUSTODY_CHAIN = [
  { id: 'CC-001', event: 'Evidence Collected', user: 'DySP Rajan Mishra', date: '2024-05-14 14:30', location: 'Crime Scene — Sector 18, Noida', note: 'Collected and sealed at scene. Reference: CS-NOI-240514', verified: true },
  { id: 'CC-002', event: 'Transfer to Evidence Room', user: 'HC Sunil Tiwari (Evidence Officer)', date: '2024-05-14 17:45', location: 'Evidence Storage — Noida CP Office', note: 'Transferred under witness of SI Pradeep Gupta. Seal intact.', verified: true },
  { id: 'CC-003', event: 'Forensic Lab Transfer', user: 'Lab Coordinator Dr. Kavita Mehta (CFSL)', date: '2024-05-16 09:00', location: 'Central Forensic Science Laboratory, Delhi', note: 'Chain-of-custody document signed. Receipt: CFSL-2024-0516-089', verified: true },
  { id: 'CC-004', event: 'Return from Lab', user: 'HC Sunil Tiwari', date: '2024-05-25 11:30', location: 'Evidence Storage — Noida CP Office', note: 'Returned post-analysis. Lab report attached.', verified: true },
  { id: 'CC-005', event: 'Integrity Verification', user: 'SYSTEM (Automated)', date: '2024-08-27 09:05', location: 'SDMS Evidence Repository', note: 'SHA-256 hash verified. No tampering detected.', verified: true },
]

export default function EvidencePage({ navigate, selectedEvidenceId }: Props) {
  const [selected, setSelected] = useState<Evidence | null>(
    selectedEvidenceId ? EVIDENCE.find(e => e.id === selectedEvidenceId) ?? null : null
  )
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)

  const filtered = EVIDENCE.filter(e => {
    const ms = !search || e.id.toLowerCase().includes(search.toLowerCase()) || e.name.toLowerCase().includes(search.toLowerCase()) || e.caseId.toLowerCase().includes(search.toLowerCase())
    const mt = !filterType || e.type === filterType
    const mst = !filterStatus || e.integrityStatus === filterStatus
    return ms && mt && mst
  })

  if (selected) {
    return (
      <div className="page-content fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 13, color: '#64748b' }}>
          <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#1d4ed8', cursor: 'pointer', fontSize: 13, padding: 0 }}>← Evidence</button>
          <span>/</span>
          <span className="font-mono" style={{ color: '#0f172a', fontWeight: 600 }}>{selected.id}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
          {/* Main */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Header */}
            <div className="card" style={{ padding: 22 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                    <span className="font-mono" style={{ background: '#f5f3ff', color: '#7c3aed', padding: '3px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>{selected.id}</span>
                    <Badge variant={selected.type === 'Digital' ? 'info' : selected.type === 'Video' ? 'warning' : 'medium'} label={selected.type} />
                    {statusBadge(selected.integrityStatus)}
                    {statusBadge(selected.custodyStatus)}
                  </div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>{selected.name}</h2>
                  <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.6 }}>{selected.description}</p>
                </div>
              </div>

              {/* File preview placeholder */}
              <div style={{ background: '#f8fafc', border: '2px dashed #e2e8f0', borderRadius: 10, padding: '32px 20px', textAlign: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>
                  {selected.type === 'Image' ? '🖼️' : selected.type === 'Video' ? '🎬' : selected.type === 'Audio' ? '🎵' : selected.type === 'Document' ? '📄' : selected.type === 'Digital' ? '💾' : '📦'}
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#374151' }}>{selected.filename}</div>
                <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Size: {selected.size}</div>
                <div style={{ marginTop: 12, display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button className="btn-secondary" style={{ fontSize: 12.5 }}>👁 Preview (Authorized)</button>
                  <button className="btn-secondary" style={{ fontSize: 12.5 }}>⬇ Download (Logged)</button>
                </div>
              </div>

              {/* Hash */}
              <div style={{ background: '#0f172a', borderRadius: 8, padding: '12px 16px' }}>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>SHA-256 Hash</div>
                <div className="font-mono" style={{ color: '#4ade80', fontSize: 12, wordBreak: 'break-all', lineHeight: 1.6 }}>{selected.hash}</div>
              </div>
            </div>

            {/* Integrity Verification */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ fontWeight: 700, fontSize: 14 }}>Integrity Verification</h3>
                <button
                  className="btn-primary"
                  style={{ fontSize: 12.5 }}
                  onClick={() => { setVerifying(true); setTimeout(() => { setVerifying(false); setVerified(true) }, 2200) }}
                  disabled={verifying}
                >
                  {verifying ? '⟳ Verifying…' : '🔒 Verify Integrity'}
                </button>
              </div>
              {verified && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '12px 16px', fontSize: 13.5, color: '#15803d', fontWeight: 600 }}>
                  ✅ Integrity Verified — SHA-256 hash matches original. No tampering detected. Timestamp: {new Date().toLocaleString('en-IN')}
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
                {[
                  ['Upload Timestamp', selected.uploadDate],
                  ['Uploaded By', selected.uploadedBy],
                  ['Last Verification', '2024-08-27 09:05'],
                  ['Total Accesses', '7'],
                ].map(([k, v]) => (
                  <div key={k} style={{ background: '#f8fafc', borderRadius: 6, padding: '10px 14px' }}>
                    <div style={{ fontSize: 11.5, color: '#94a3b8', marginBottom: 3 }}>{k}</div>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: '#1e293b' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chain of Custody sidebar */}
          <div className="card" style={{ padding: 20, alignSelf: 'start' }}>
            <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 18 }}>Chain of Custody</h3>
            <div style={{ position: 'relative', paddingLeft: 24 }}>
              <div style={{ position: 'absolute', left: 5, top: 0, bottom: 0, width: 2, background: '#e2e8f0' }} />
              {CUSTODY_CHAIN.map((item, i) => (
                <div key={item.id} style={{ position: 'relative', marginBottom: 20 }}>
                  <div style={{
                    position: 'absolute', left: -24, top: 2,
                    width: 12, height: 12, borderRadius: '50%',
                    background: item.verified ? '#16a34a' : '#d97706',
                    border: '2px solid white', boxShadow: `0 0 0 2px ${item.verified ? '#16a34a' : '#d97706'}`,
                  }} />
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0f172a' }}>{item.event}</div>
                  <div style={{ fontSize: 11.5, color: '#1d4ed8', marginTop: 1 }}>{item.user}</div>
                  <div className="font-mono" style={{ fontSize: 10.5, color: '#94a3b8', marginTop: 2 }}>{item.date}</div>
                  <div style={{ fontSize: 11.5, color: '#475569', marginTop: 3, lineHeight: 1.5 }}>{item.note}</div>
                  {item.verified && <div style={{ fontSize: 11, color: '#16a34a', marginTop: 3, fontWeight: 600 }}>✓ Verified</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content fade-in">
      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input className="input-field" style={{ maxWidth: 260 }} placeholder="Search evidence ID, name, case…" value={search} onChange={e => setSearch(e.target.value)} />
        <select className="select-field" value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          {['Document', 'Image', 'Video', 'Audio', 'Digital', 'Physical'].map(t => <option key={t}>{t}</option>)}
        </select>
        <select className="select-field" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Integrity Status</option>
          {['Verified', 'Pending', 'Failed'].map(s => <option key={s}>{s}</option>)}
        </select>
        <div style={{ flex: 1 }} />
        <button className="btn-primary">📤 Upload Evidence</button>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
        {[
          { label: 'Total Items', value: EVIDENCE.length, color: '#1d4ed8' },
          { label: 'Verified', value: EVIDENCE.filter(e => e.integrityStatus === 'Verified').length, color: '#16a34a' },
          { label: 'Pending Verification', value: EVIDENCE.filter(e => e.integrityStatus === 'Pending').length, color: '#d97706' },
          { label: 'Flagged', value: EVIDENCE.filter(e => e.status === 'Flagged').length, color: '#dc2626' },
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
              <th>Evidence ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Case ID</th>
              <th>Uploaded By</th>
              <th>Upload Date</th>
              <th>Size</th>
              <th>Integrity</th>
              <th>Custody</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id}>
                <td><span className="font-mono" style={{ fontSize: 11.5, color: '#7c3aed', fontWeight: 600 }}>{e.id}</span></td>
                <td>
                  <div style={{ fontWeight: 500, fontSize: 13, color: '#0f172a' }}>{e.name}</div>
                  <div className="font-mono" style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>{e.hash.slice(0, 12)}…</div>
                </td>
                <td><Badge variant={e.type === 'Digital' ? 'info' : e.type === 'Video' ? 'warning' : e.type === 'Physical' ? 'medium' : 'active'} label={e.type} /></td>
                <td><span className="font-mono" style={{ fontSize: 11.5, color: '#1d4ed8' }}>{e.caseId}</span></td>
                <td style={{ fontSize: 12.5, color: '#475569' }}>{e.uploadedBy}</td>
                <td style={{ fontSize: 12.5, color: '#64748b' }}>{e.uploadDate}</td>
                <td style={{ fontSize: 12.5, color: '#64748b' }}>{e.size}</td>
                <td>{statusBadge(e.integrityStatus)}</td>
                <td>{statusBadge(e.custodyStatus)}</td>
                <td><button className="btn-primary" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => setSelected(e)}>View →</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
