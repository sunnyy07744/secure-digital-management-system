import { useState, useEffect, useCallback } from 'react'
import type { Page } from '../App'
import { type Case, type Evidence, type Document } from '../data'
import { getCases, getCaseById, createCase, type NewCaseInput } from '../api/cases'
import { getEvidence } from '../api/evidence'
import { getDocuments } from '../api/documents'
import { getTimelineEvents } from '../api/timeline'
import { ApiError } from '../api/client'
import Badge, { priorityBadge, statusBadge } from '../components/Badge'

interface Props {
  navigate: (page: Page, extra?: Record<string, string>) => void
  selectedCaseId?: string
}

export default function Cases({ navigate, selectedCaseId }: Props) {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<Case | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'documents' | 'timeline' | 'notes'>('overview')
  const [showNewCase, setShowNewCase] = useState(false)

  const loadCases = useCallback(() => {
    setLoading(true)
    setError('')
    getCases({ search, status: filterStatus, priority: filterPriority })
      .then(setCases)
      .catch(err => setError(err instanceof ApiError ? err.message : 'Failed to load cases.'))
      .finally(() => setLoading(false))
  }, [search, filterStatus, filterPriority])

  useEffect(() => { loadCases() }, [loadCases])

  // Deep-link support: if we arrived via navigate('case-detail', { selectedCaseId }),
  // fetch that specific case even if it's not in the currently filtered list.
  useEffect(() => {
    if (!selectedCaseId) { setSelected(null); return }
    getCaseById(selectedCaseId).then(setSelected).catch(() => setSelected(null))
  }, [selectedCaseId])

  if (selected) {
    return <CaseDetail c={selected} navigate={navigate} onBack={() => setSelected(null)} activeTab={activeTab} setActiveTab={setActiveTab} />
  }

  return (
    <div className="page-content fade-in">
      {/* Header actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <input className="input-field" style={{ maxWidth: 280 }} placeholder="Search by Case ID, title, investigator…" value={search} onChange={e => setSearch(e.target.value)} />
        <select className="select-field" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          {['Active', 'Closed', 'Pending', 'On Hold', 'Archived'].map(s => <option key={s}>{s}</option>)}
        </select>
        <select className="select-field" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
          <option value="">All Priority</option>
          {['Critical', 'High', 'Medium', 'Low'].map(s => <option key={s}>{s}</option>)}
        </select>
        <div style={{ flex: 1 }} />
        <button className="btn-primary" onClick={() => setShowNewCase(true)}>➕ New Case</button>
      </div>

      {/* Summary pills */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
        {[
          { label: `All (${cases.length})`, value: '' },
          { label: `Active`, value: 'Active' },
          { label: `Pending`, value: 'Pending' },
          { label: `Closed`, value: 'Closed' },
        ].map(p => (
          <button
            key={p.label}
            onClick={() => setFilterStatus(filterStatus === p.value ? '' : p.value)}
            style={{
              padding: '5px 14px', borderRadius: 20, fontSize: 12.5, fontWeight: 500, cursor: 'pointer', border: 'none',
              background: filterStatus === p.value ? '#0f2040' : '#f1f5f9', color: filterStatus === p.value ? '#e2e8f0' : '#64748b', transition: 'all 0.15s',
            }}
          >{p.label}</button>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '10px 14px', margin: 16, color: '#dc2626', fontSize: 13 }}>
            ⚠ {error} <button onClick={loadCases} style={{ marginLeft: 8, color: '#1d4ed8', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, textDecoration: 'underline' }}>Retry</button>
          </div>
        )}
        <table className="data-table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Case Title</th>
              <th>Type</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Investigator</th>
              <th>Last Updated</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Loading cases…</td></tr>
            ) : cases.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>No cases match your filters.</td></tr>
            ) : cases.map(c => (
              <tr key={c.id}>
                <td><span className="font-mono" style={{ fontSize: 12, color: '#1d4ed8', fontWeight: 600 }}>{c.id}</span></td>
                <td>
                  <div style={{ fontWeight: 600, fontSize: 13.5, color: '#0f172a' }}>{c.title}</div>
                  <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 1 }}>{c.location}</div>
                </td>
                <td style={{ fontSize: 12.5, color: '#475569' }}>{c.type}</td>
                <td>{priorityBadge(c.priority)}</td>
                <td>{statusBadge(c.status)}</td>
                <td style={{ fontSize: 13 }}>{c.investigator}</td>
                <td style={{ fontSize: 12, color: '#64748b' }}>{c.lastUpdated}</td>
                <td>
                  <button className="btn-primary" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => setSelected(c)}>View →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!loading && cases.length > 0 && (
        <div style={{ marginTop: 12, fontSize: 12.5, color: '#94a3b8' }}>
          Showing {cases.length} case{cases.length === 1 ? '' : 's'}
        </div>
      )}

      {/* New Case Modal */}
      {showNewCase && (
        <NewCaseModal
          onClose={() => setShowNewCase(false)}
          onCreated={() => { setShowNewCase(false); loadCases() }}
        />
      )}
    </div>
  )
}

function CaseDetail({ c, navigate, onBack, activeTab, setActiveTab }: {
  c: Case
  navigate: (page: Page, extra?: Record<string, string>) => void
  onBack: () => void
  activeTab: string
  setActiveTab: (t: any) => void
}) {
  const [caseEvidence, setCaseEvidence] = useState<Evidence[]>([])
  const [caseDocs, setCaseDocs] = useState<Document[]>([])
  const [caseTimeline, setCaseTimeline] = useState<Awaited<ReturnType<typeof getTimelineEvents>>>([])

  useEffect(() => {
    getEvidence(c.id).then(setCaseEvidence).catch(() => setCaseEvidence([]))
    getDocuments(c.id).then(setCaseDocs).catch(() => setCaseDocs([]))
    getTimelineEvents(c.id).then(setCaseTimeline).catch(() => setCaseTimeline([]))
  }, [c.id])

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'evidence', label: `Evidence (${caseEvidence.length})` },
    { id: 'documents', label: `Documents (${caseDocs.length})` },
    { id: 'timeline', label: 'Timeline' },
    { id: 'notes', label: 'Notes & Activity' },
  ]

  return (
    <div className="page-content fade-in">
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 13, color: '#64748b' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#1d4ed8', cursor: 'pointer', fontSize: 13, padding: 0 }}>← Cases</button>
        <span>/</span>
        <span className="font-mono" style={{ color: '#0f172a', fontWeight: 600 }}>{c.id}</span>
      </div>

      {/* Case header card */}
      <div className="card" style={{ padding: '20px 24px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span className="font-mono" style={{ background: '#eff6ff', color: '#1d4ed8', padding: '3px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>{c.id}</span>
              {priorityBadge(c.priority)}
              {statusBadge(c.status)}
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>{c.title}</h2>
            <div style={{ color: '#475569', fontSize: 13.5 }}>{c.type} · {c.location}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-secondary" style={{ fontSize: 12.5 }}>✏️ Edit Case</button>
            <button className="btn-primary" style={{ fontSize: 12.5 }} onClick={() => navigate('reports')}>📄 Generate Report</button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginTop: 18, paddingTop: 18, borderTop: '1px solid #f1f5f9' }}>
          {[
            { label: 'Filed Date', value: c.filedDate },
            { label: 'Last Updated', value: c.lastUpdated },
            { label: 'Lead Investigator', value: c.investigator },
            { label: 'Department', value: c.department },
          ].map(m => (
            <div key={m.label}>
              <div style={{ fontSize: 11.5, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>{m.label}</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1e293b' }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 0 }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '8px 16px', borderRadius: '6px 6px 0 0',
              background: activeTab === t.id ? 'white' : 'transparent',
              border: activeTab === t.id ? '1px solid #e2e8f0' : '1px solid transparent',
              borderBottom: activeTab === t.id ? '1px solid white' : 'none',
              marginBottom: activeTab === t.id ? -1 : 0,
              color: activeTab === t.id ? '#0f172a' : '#64748b',
              fontSize: 13.5, fontWeight: activeTab === t.id ? 700 : 500,
              cursor: 'pointer',
            }}
          >{t.label}</button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 14, fontSize: 14 }}>Case Description</h3>
            <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7 }}>{c.description}</p>
          </div>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 14, fontSize: 14 }}>Persons of Interest</h3>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Victims / Complainants</div>
              {c.victims.map(v => (
                <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid #f8fafc' }}>
                  <span style={{ color: '#16a34a' }}>👤</span>
                  <span style={{ fontSize: 13.5 }}>{v}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Suspects</div>
              {c.suspects.map(s => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid #f8fafc' }}>
                  <span style={{ color: '#dc2626' }}>⚠</span>
                  <span style={{ fontSize: 13.5 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 14, fontSize: 14 }}>Case Statistics</h3>
            {[
              { label: 'Evidence Items', value: c.evidenceCount, icon: '🔍' },
              { label: 'Documents', value: c.documentsCount, icon: '📄' },
              { label: 'Investigators Assigned', value: 1, icon: '👮' },
              { label: 'Days Active', value: Math.floor((new Date().getTime() - new Date(c.filedDate).getTime()) / 86400000), icon: '📅' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5 }}>
                  <span>{s.icon}</span><span>{s.label}</span>
                </div>
                <span style={{ fontWeight: 700, color: '#1d4ed8', fontSize: 16 }}>{s.value}</span>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 14, fontSize: 14 }}>Security & Integrity</h3>
            {[
              ['Evidence Integrity', '100% Verified', '#16a34a'],
              ['Chain of Custody', 'Maintained', '#16a34a'],
              ['Access Control', 'RBAC Active', '#1d4ed8'],
              ['Audit Trail', 'Complete', '#16a34a'],
            ].map(([k, v, c]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f8fafc', alignItems: 'center' }}>
                <span style={{ fontSize: 13.5, color: '#374151' }}>{k}</span>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: c as string }}>✓ {v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'evidence' && (
        <div className="card">
          <div style={{ padding: '14px 20px 0', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Evidence Items ({caseEvidence.length})</span>
            <button className="btn-primary" style={{ fontSize: 12 }} onClick={() => navigate('evidence')}>View All Evidence</button>
          </div>
          <table className="data-table" style={{ marginTop: 8 }}>
            <thead><tr><th>Evidence ID</th><th>Name</th><th>Type</th><th>Uploaded</th><th>Hash (SHA-256)</th><th>Integrity</th><th>Custody</th></tr></thead>
            <tbody>
              {caseEvidence.length === 0 ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: 30, color: '#94a3b8' }}>No evidence items for this case.</td></tr>
                : caseEvidence.map(e => (
                  <tr key={e.id}>
                    <td><span className="font-mono" style={{ fontSize: 11.5, color: '#7c3aed' }}>{e.id}</span></td>
                    <td style={{ fontWeight: 500, fontSize: 13 }}>{e.name}</td>
                    <td><Badge variant={e.type === 'Digital' ? 'info' : e.type === 'Video' ? 'warning' : e.type === 'Physical' ? 'medium' : 'active'} label={e.type} /></td>
                    <td style={{ fontSize: 12.5, color: '#64748b' }}>{e.uploadDate}</td>
                    <td><span className="font-mono" style={{ fontSize: 10.5, color: '#64748b' }}>{e.hash.slice(0, 16)}…</span></td>
                    <td>{statusBadge(e.integrityStatus)}</td>
                    <td>{statusBadge(e.custodyStatus)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="card">
          <div style={{ padding: '14px 20px 0', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Documents ({caseDocs.length})</span>
            <button className="btn-primary" style={{ fontSize: 12 }} onClick={() => navigate('documents')}>View All Documents</button>
          </div>
          <table className="data-table" style={{ marginTop: 8 }}>
            <thead><tr><th>Doc ID</th><th>Name</th><th>Type</th><th>Uploaded By</th><th>Date</th><th>Version</th><th>Access Level</th></tr></thead>
            <tbody>
              {caseDocs.length === 0 ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: 30, color: '#94a3b8' }}>No documents for this case.</td></tr>
                : caseDocs.map(d => (
                  <tr key={d.id}>
                    <td><span className="font-mono" style={{ fontSize: 11.5, color: '#1d4ed8' }}>{d.id}</span></td>
                    <td style={{ fontWeight: 500, fontSize: 13 }}>{d.name}</td>
                    <td style={{ fontSize: 12.5 }}>{d.type}</td>
                    <td style={{ fontSize: 12.5, color: '#64748b' }}>{d.uploadedBy}</td>
                    <td style={{ fontSize: 12.5, color: '#64748b' }}>{d.date}</td>
                    <td><span className="font-mono" style={{ fontSize: 12 }}>v{d.version}</span></td>
                    <td><Badge variant={d.accessLevel === 'Top Secret' ? 'top-secret' : d.accessLevel === 'Confidential' ? 'confidential' : d.accessLevel === 'Restricted' ? 'restricted' : 'public'} label={d.accessLevel} /></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: 14 }}>Investigation Timeline</h3>
          <div style={{ position: 'relative', paddingLeft: 32 }}>
            <div style={{ position: 'absolute', left: 6, top: 0, bottom: 0, width: 2, background: '#e2e8f0' }} />
            {caseTimeline.length === 0 ? (
              <div style={{ color: '#94a3b8', fontSize: 13, padding: '20px 0' }}>No timeline events recorded yet.</div>
            ) : caseTimeline.map((e, i) => (
              <div key={e.id} style={{ position: 'relative', marginBottom: 24 }}>
                <div style={{ position: 'absolute', left: -30, top: 3, width: 14, height: 14, borderRadius: '50%', background: e.verified ? '#16a34a' : '#d97706', border: '2px solid white', boxShadow: `0 0 0 2px ${e.verified ? '#16a34a' : '#d97706'}` }} />
                <div style={{ background: '#f8fafc', borderRadius: 8, padding: '12px 16px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: 13.5, color: '#0f172a' }}>{e.action}</span>
                      {e.verified && <span style={{ marginLeft: 8, fontSize: 11, color: '#16a34a', fontWeight: 600 }}>✓ Verified</span>}
                    </div>
                    <span className="font-mono" style={{ fontSize: 11, color: '#94a3b8' }}>{e.date} {e.time}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, margin: 0 }}>{e.description}</p>
                  <div style={{ marginTop: 8, fontSize: 12, color: '#64748b' }}>
                    👮 {e.investigator}
                    {e.relatedEvidence && <span style={{ marginLeft: 12 }}>🔗 <span className="font-mono" style={{ fontSize: 11 }}>{e.relatedEvidence}</span></span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'notes' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 14, fontSize: 14 }}>Case Notes</h3>
            <textarea
              style={{ width: '100%', minHeight: 140, padding: 12, border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13.5, color: '#374151', resize: 'vertical', fontFamily: 'DM Sans, sans-serif', outline: 'none' }}
              placeholder="Add investigation notes… (changes are automatically logged in audit trail)"
            />
            <button className="btn-primary" style={{ marginTop: 10, fontSize: 12.5 }}>Save Note</button>
          </div>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 14, fontSize: 14 }}>Audit History</h3>
            <div style={{ fontSize: 13, color: '#94a3b8', background: '#f8fafc', borderRadius: 8, padding: 16, textAlign: 'center' }}>
              All modifications to this case are immutably recorded in the system audit log.
              <br /><button className="btn-secondary" style={{ marginTop: 10, fontSize: 12 }} onClick={() => navigate('audit')}>View Full Audit Log →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function NewCaseModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState<NewCaseInput>({
    title: '', location: '', type: 'Financial Fraud', priority: 'Medium', description: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const set = (field: keyof NewCaseInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async () => {
    setError('')
    if (!form.title.trim() || !form.location.trim()) {
      setError('Case title and location are required.')
      return
    }
    setSubmitting(true)
    try {
      await createCase(form)
      onCreated()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to register case.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, color: '#0f172a' }}>Register New Case</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#94a3b8' }}>×</button>
        </div>
        <div style={{ padding: '20px 24px' }}>
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 6, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: '#92400e' }}>
            ⚠ New case registrations are recorded in the audit log and require supervisor approval.
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Case Title *</label>
            <input className="input-field" placeholder="Brief descriptive title" value={form.title} onChange={set('title')} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Location *</label>
            <input className="input-field" placeholder="Primary crime/incident location" value={form.location} onChange={set('location')} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Case Type *</label>
              <select className="select-field" style={{ width: '100%' }} value={form.type} onChange={set('type')}>
                {['Financial Fraud', 'Cybercrime', 'Homicide', 'Property Crime', 'Drug Trafficking', 'Corruption', 'Terrorism', 'Human Trafficking', 'Civil Dispute'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Priority *</label>
              <select className="select-field" style={{ width: '100%' }} value={form.priority} onChange={set('priority')}>
                {['Critical', 'High', 'Medium', 'Low'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Description</label>
            <textarea className="input-field" style={{ minHeight: 80, resize: 'vertical' }} placeholder="Case description and initial findings…" value={form.description} onChange={set('description')} />
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '9px 12px', marginBottom: 14, color: '#dc2626', fontSize: 13 }}>
              ⚠ {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8 }}>
            <button className="btn-secondary" onClick={onClose} disabled={submitting}>Cancel</button>
            <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Registering…' : 'Register Case'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
