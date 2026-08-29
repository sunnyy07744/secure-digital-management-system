import { useState } from 'react'
import type { Page } from '../App'
import { CASES, EVIDENCE, DOCUMENTS, USERS } from '../data'

interface Props { navigate: (page: Page, extra?: Record<string, string>) => void }

export default function Search({ navigate }: Props) {
  const [query, setQuery] = useState('')
  const [searched, setSearched] = useState(false)

  const q = query.toLowerCase().trim()

  const caseResults = q ? CASES.filter(c =>
    c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) ||
    c.suspects.some(s => s.toLowerCase().includes(q)) || c.investigator.toLowerCase().includes(q) ||
    c.type.toLowerCase().includes(q) || c.location.toLowerCase().includes(q)
  ) : []

  const evidenceResults = q ? EVIDENCE.filter(e =>
    e.id.toLowerCase().includes(q) || e.name.toLowerCase().includes(q) || e.caseId.toLowerCase().includes(q)
  ) : []

  const docResults = q ? DOCUMENTS.filter(d =>
    d.name.toLowerCase().includes(q) || d.caseId.toLowerCase().includes(q) || d.type.toLowerCase().includes(q)
  ) : []

  const userResults = q ? USERS.filter(u =>
    u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q) || u.department.toLowerCase().includes(q)
  ) : []

  const total = caseResults.length + evidenceResults.length + docResults.length + userResults.length

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setSearched(true) }

  return (
    <div className="page-content fade-in">
      <form onSubmit={handleSearch} style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', gap: 12, maxWidth: 640 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              className="input-field"
              value={query}
              onChange={e => { setQuery(e.target.value); setSearched(false) }}
              placeholder="Search cases, evidence IDs, suspects, investigators, documents…"
              style={{ paddingLeft: 38, fontSize: 15, padding: '11px 12px 11px 38px' }}
              autoFocus
            />
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 16 }}>🔍</span>
          </div>
          <button className="btn-primary" type="submit" style={{ padding: '0 22px', fontSize: 14 }}>Search</button>
        </div>
        <div style={{ marginTop: 8, fontSize: 12.5, color: '#94a3b8' }}>
          Tip: Search by Case ID (e.g. CASE-2024-001), suspect name, investigator, crime type, or location.
        </div>
      </form>

      {searched && q && (
        <div className="fade-in">
          <div style={{ marginBottom: 20, fontSize: 14, color: '#475569' }}>
            Found <strong style={{ color: '#0f172a' }}>{total} results</strong> for &ldquo;<strong>{query}</strong>&rdquo;
          </div>

          {caseResults.length > 0 && (
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', fontWeight: 700, fontSize: 13.5, color: '#0f172a' }}>
                📂 Cases ({caseResults.length})
              </div>
              {caseResults.map(c => (
                <div
                  key={c.id}
                  style={{ padding: '12px 18px', borderBottom: '1px solid #f8fafc', cursor: 'pointer', transition: 'background 0.1s' }}
                  onClick={() => navigate('case-detail', { selectedCaseId: c.id })}
                  onMouseOver={e => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseOut={e => (e.currentTarget.style.background = 'white')}
                >
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span className="font-mono" style={{ fontSize: 12, color: '#1d4ed8', fontWeight: 600, flexShrink: 0 }}>{c.id}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{c.title}</div>
                      <div style={{ fontSize: 12.5, color: '#64748b', marginTop: 2 }}>{c.type} · {c.location} · {c.investigator}</div>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: '#1d4ed8' }}>View →</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {evidenceResults.length > 0 && (
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', fontWeight: 700, fontSize: 13.5, color: '#0f172a' }}>
                🔍 Evidence ({evidenceResults.length})
              </div>
              {evidenceResults.map(e => (
                <div
                  key={e.id}
                  style={{ padding: '12px 18px', borderBottom: '1px solid #f8fafc', cursor: 'pointer', transition: 'background 0.1s' }}
                  onClick={() => navigate('evidence-detail', { selectedEvidenceId: e.id })}
                  onMouseOver={ev => (ev.currentTarget.style.background = '#f8fafc')}
                  onMouseOut={ev => (ev.currentTarget.style.background = 'white')}
                >
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span className="font-mono" style={{ fontSize: 12, color: '#7c3aed', fontWeight: 600 }}>{e.id}</span>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{e.name}</span>
                    <span style={{ fontSize: 12.5, color: '#64748b' }}>· {e.type} · {e.caseId}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: '#1d4ed8' }}>View →</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {docResults.length > 0 && (
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', fontWeight: 700, fontSize: 13.5, color: '#0f172a' }}>
                📄 Documents ({docResults.length})
              </div>
              {docResults.map(d => (
                <div
                  key={d.id}
                  style={{ padding: '12px 18px', borderBottom: '1px solid #f8fafc', cursor: 'pointer' }}
                  onClick={() => navigate('documents')}
                  onMouseOver={e => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseOut={e => (e.currentTarget.style.background = 'white')}
                >
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span className="font-mono" style={{ fontSize: 12, color: '#1d4ed8', fontWeight: 600 }}>{d.id}</span>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{d.name}</span>
                    <span style={{ fontSize: 12.5, color: '#64748b' }}>· {d.type} · {d.caseId}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: '#1d4ed8' }}>View →</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {userResults.length > 0 && (
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', fontWeight: 700, fontSize: 13.5, color: '#0f172a' }}>
                👮 Users ({userResults.length})
              </div>
              {userResults.map(u => (
                <div
                  key={u.id}
                  style={{ padding: '12px 18px', borderBottom: '1px solid #f8fafc', cursor: 'pointer' }}
                  onClick={() => navigate('users')}
                  onMouseOver={e => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseOut={e => (e.currentTarget.style.background = 'white')}
                >
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span className="font-mono" style={{ fontSize: 12, color: '#64748b' }}>{u.id}</span>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</span>
                    <span style={{ fontSize: 12.5, color: '#64748b' }}>· {u.role} · {u.department}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: '#1d4ed8' }}>View →</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {total === 0 && (
            <div className="card" style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>No results found</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>Try a different search term or browse using the navigation.</div>
            </div>
          )}
        </div>
      )}

      {!searched && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { icon: '📂', label: 'Browse Cases', page: 'cases' as Page },
            { icon: '🔍', label: 'Browse Evidence', page: 'evidence' as Page },
            { icon: '📄', label: 'Browse Documents', page: 'documents' as Page },
            { icon: '👮', label: 'Browse Users', page: 'users' as Page },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => navigate(item.page)}
              style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: 20, cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = '#1d4ed8'; e.currentTarget.style.background = '#f8fafc' }}
              onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white' }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: '#374151' }}>{item.label}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
