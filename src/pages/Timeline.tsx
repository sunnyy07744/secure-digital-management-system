import type { Page } from '../App'
import { TIMELINE_EVENTS, CASES } from '../data'

interface Props { navigate: (page: Page, extra?: Record<string, string>) => void }

export default function Timeline({ navigate }: Props) {
  return (
    <div className="page-content fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        {/* Timeline */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 22 }}>Investigation Activity Timeline</h3>
          <div style={{ position: 'relative', paddingLeft: 36 }}>
            <div style={{ position: 'absolute', left: 9, top: 0, bottom: 0, width: 2, background: '#e2e8f0' }} />
            {TIMELINE_EVENTS.map((e, i) => (
              <div key={e.id} style={{ position: 'relative', marginBottom: 28 }}>
                <div style={{
                  position: 'absolute', left: -34, top: 4,
                  width: 16, height: 16, borderRadius: '50%',
                  background: e.verified ? '#16a34a' : '#d97706',
                  border: '3px solid white',
                  boxShadow: `0 0 0 2px ${e.verified ? '#16a34a' : '#d97706'}`,
                }} />
                <div style={{ background: '#f8fafc', borderRadius: 10, padding: '14px 18px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: 14.5, color: '#0f172a' }}>{e.action}</span>
                      {e.verified && <span style={{ marginLeft: 8, fontSize: 11, color: '#16a34a', fontWeight: 700, background: '#f0fdf4', padding: '2px 7px', borderRadius: 10 }}>✓ Verified</span>}
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div className="font-mono" style={{ fontSize: 12, color: '#64748b' }}>{e.date}</div>
                      <div className="font-mono" style={{ fontSize: 12, color: '#94a3b8' }}>{e.time} IST</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 13.5, color: '#374151', lineHeight: 1.7, margin: '0 0 10px' }}>{e.description}</p>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12.5, color: '#64748b', flexWrap: 'wrap' }}>
                    <span>👮 {e.investigator}</span>
                    {e.caseId !== 'ALL' && (
                      <button
                        onClick={() => navigate('case-detail', { selectedCaseId: e.caseId })}
                        style={{ background: 'none', border: 'none', color: '#1d4ed8', fontSize: 12.5, cursor: 'pointer', padding: 0, fontWeight: 600 }}
                      >
                        📂 {e.caseId} →
                      </button>
                    )}
                    {e.relatedEvidence && (
                      <span>🔗 <span className="font-mono" style={{ fontSize: 11.5 }}>{e.relatedEvidence}</span></span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {/* Empty state for future events */}
            <div style={{ position: 'relative', paddingLeft: 0 }}>
              <div style={{ position: 'absolute', left: -29, top: 2, width: 8, height: 8, borderRadius: '50%', background: '#e2e8f0', border: '2px solid white' }} />
              <div style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>Future events will appear here as the investigation progresses.</div>
            </div>
          </div>
        </div>

        {/* Case quick nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ padding: 18 }}>
            <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Active Cases</h3>
            {CASES.filter(c => c.status === 'Active').map(c => (
              <div
                key={c.id}
                style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                onClick={() => navigate('case-detail', { selectedCaseId: c.id })}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="font-mono" style={{ fontSize: 11, color: '#1d4ed8' }}>{c.id}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginTop: 2 }}>{c.title.slice(0, 32)}{c.title.length > 32 ? '…' : ''}</div>
                  </div>
                  <span style={{
                    fontSize: 10.5, fontWeight: 700, padding: '2px 7px', borderRadius: 10,
                    background: c.priority === 'Critical' ? '#fef2f2' : c.priority === 'High' ? '#fff7ed' : '#fefce8',
                    color: c.priority === 'Critical' ? '#991b1b' : c.priority === 'High' ? '#c2410c' : '#854d0e',
                  }}>{c.priority}</span>
                </div>
                <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 3 }}>{c.investigator}</div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 18 }}>
            <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Security Status</h3>
            {[
              ['Evidence Integrity', '100%', '#16a34a'],
              ['Chain of Custody', 'Active', '#16a34a'],
              ['Audit Trail', 'Complete', '#16a34a'],
              ['Access Control', 'RBAC', '#1d4ed8'],
            ].map(([k, v, c]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f8fafc', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#374151' }}>{k}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: c as string }}>✓ {v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
