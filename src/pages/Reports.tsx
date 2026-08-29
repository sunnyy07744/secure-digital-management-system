import { useState } from 'react'
import type { Page } from '../App'
import { CASES } from '../data'

interface Props { navigate: (page: Page) => void }

const REPORT_TYPES = [
  { id: 'case', icon: '📂', title: 'Case Report', desc: 'Comprehensive report for a specific case including all evidence, documents, timeline, and investigation notes.', time: '~2 min' },
  { id: 'investigation', icon: '🔍', title: 'Investigation Summary', desc: 'Summary of ongoing investigation activities, suspects, and findings for departmental review.', time: '~3 min' },
  { id: 'evidence', icon: '⬡', title: 'Evidence Audit Report', desc: 'Complete chain-of-custody and integrity verification report for all evidence items.', time: '~5 min' },
  { id: 'statistics', icon: '📊', title: 'Case Statistics Report', desc: 'Department-wide statistical analysis of cases by type, priority, status, and resolution rate.', time: '~1 min' },
  { id: 'audit', icon: '📋', title: 'Audit Trail Report', desc: 'Complete system access and modification audit report for compliance and oversight.', time: '~4 min' },
  { id: 'investigator', icon: '👮', title: 'Investigator Performance', desc: 'Caseload, resolution rate, and activity summary per investigator for supervisory review.', time: '~2 min' },
]

export default function Reports({ navigate }: Props) {
  const [generating, setGenerating] = useState<string | null>(null)
  const [generated, setGenerated] = useState<string | null>(null)

  const generate = (id: string) => {
    setGenerated(null)
    setGenerating(id)
    setTimeout(() => { setGenerating(null); setGenerated(id) }, 2000)
  }

  const stats = [
    { label: 'Total Cases', value: 10 },
    { label: 'Active', value: 6 },
    { label: 'Closed (FY24)', value: 2 },
    { label: 'Resolution Rate', value: '62%' },
    { label: 'Avg Days to Closure', value: 187 },
    { label: 'Critical Pending', value: 4 },
  ]

  return (
    <div className="page-content fade-in">
      {/* Stats overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card" style={{ textAlign: 'center', padding: '14px 10px' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#1d4ed8' }}>{s.value}</div>
            <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <h3 style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 16 }}>Generate Reports</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {REPORT_TYPES.map(r => (
          <div key={r.id} className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
              <span style={{ fontSize: 28 }}>{r.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{r.title}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>Est. time: {r.time}</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, marginBottom: 14 }}>{r.desc}</p>
            {generated === r.id && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, padding: '8px 12px', fontSize: 12.5, color: '#15803d', marginBottom: 10 }}>
                ✅ Report generated successfully!
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center', fontSize: 12.5 }}
                onClick={() => generate(r.id)}
                disabled={generating === r.id}
              >{generating === r.id ? '⟳ Generating…' : '📄 Generate PDF'}</button>
              <button className="btn-secondary" style={{ fontSize: 12.5 }}>CSV</button>
            </div>
          </div>
        ))}
      </div>

      {/* Case-by-case stats */}
      <h3 style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 14 }}>Case Statistics</h3>
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Title</th>
              <th>Type</th>
              <th>Status</th>
              <th>Evidence</th>
              <th>Documents</th>
              <th>Days Active</th>
              <th>Report</th>
            </tr>
          </thead>
          <tbody>
            {CASES.map(c => (
              <tr key={c.id}>
                <td><span className="font-mono" style={{ fontSize: 11.5, color: '#1d4ed8' }}>{c.id}</span></td>
                <td style={{ fontWeight: 500, fontSize: 13 }}>{c.title}</td>
                <td style={{ fontSize: 12.5, color: '#64748b' }}>{c.type}</td>
                <td style={{ fontSize: 12.5 }}>{c.status}</td>
                <td style={{ fontWeight: 700, color: '#7c3aed', textAlign: 'center' }}>{c.evidenceCount}</td>
                <td style={{ fontWeight: 700, color: '#0284c7', textAlign: 'center' }}>{c.documentsCount}</td>
                <td style={{ textAlign: 'center', fontWeight: 600 }}>
                  {Math.floor((new Date().getTime() - new Date(c.filedDate).getTime()) / 86400000)}
                </td>
                <td><button className="btn-secondary" style={{ padding: '4px 10px', fontSize: 11.5 }}>📄 Generate</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
