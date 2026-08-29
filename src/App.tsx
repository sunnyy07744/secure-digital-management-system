import { useState, useEffect } from 'react'
import { getCurrentUser, logout, type CurrentUser } from './api/auth'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Cases from './pages/Cases'
import EvidencePage from './pages/Evidence'
import Documents from './pages/Documents'
import AuditLog from './pages/AuditLog'
import UserManagement from './pages/UserManagement'
import Reports from './pages/Reports'
import Notifications from './pages/Notifications'
import Timeline from './pages/Timeline'
import Search from './pages/Search'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

export type Page =
  | 'dashboard'
  | 'cases'
  | 'case-detail'
  | 'evidence'
  | 'evidence-detail'
  | 'documents'
  | 'timeline'
  | 'reports'
  | 'audit'
  | 'users'
  | 'notifications'
  | 'search'
  | 'settings'

export interface NavState {
  page: Page
  selectedCaseId?: string
  selectedEvidenceId?: string
}

export default function App() {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [nav, setNav] = useState<NavState>({ page: 'dashboard' })

  // On load, ask the backend whether the httpOnly session cookie (if any)
  // is still valid — this is what keeps someone logged in across a refresh.
  // In mock mode (no backend configured yet) this always resolves to "not
  // logged in", matching the previous demo behavior.
  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setCheckingSession(false))
  }, [])

  const navigate = (page: Page, extra?: Partial<NavState>) => {
    setNav({ page, ...extra })
  }

  const handleLogout = () => {
    setUser(null) // clear the UI immediately; don't block on the network call
    logout().catch(() => { /* cookie clears server-side regardless; nothing to recover here */ })
  }

  if (checkingSession) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: 14 }}>
        Checking session…
      </div>
    )
  }

  if (!user) {
    return <Login onLogin={setUser} />
  }

  const renderPage = () => {
    switch (nav.page) {
      case 'dashboard': return <Dashboard navigate={navigate} />
      case 'cases': return <Cases navigate={navigate} selectedCaseId={nav.selectedCaseId} />
      case 'case-detail': return <Cases navigate={navigate} selectedCaseId={nav.selectedCaseId} />
      case 'evidence': return <EvidencePage navigate={navigate} selectedEvidenceId={nav.selectedEvidenceId} />
      case 'evidence-detail': return <EvidencePage navigate={navigate} selectedEvidenceId={nav.selectedEvidenceId} />
      case 'documents': return <Documents navigate={navigate} />
      case 'timeline': return <Timeline navigate={navigate} />
      case 'reports': return <Reports navigate={navigate} />
      case 'audit': return <AuditLog navigate={navigate} />
      case 'users': return <UserManagement navigate={navigate} />
      case 'notifications': return <Notifications navigate={navigate} />
      case 'search': return <Search navigate={navigate} />
      case 'settings': return <SettingsPage />
      default: return <Dashboard navigate={navigate} />
    }
  }

  return (
    <div style={{ display: 'flex', height: '100%', background: '#f1f5f9' }}>
      <Sidebar current={nav.page} navigate={navigate} onLogout={handleLogout} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Header navigate={navigate} currentPage={nav.page} />
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {renderPage()}
        </div>
      </div>
    </div>
  )
}

function SettingsPage() {
  return (
    <div className="page-content fade-in">
      <div style={{ maxWidth: 720 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 24 }}>System Settings</h2>
        <div className="card" style={{ padding: 24, marginBottom: 16 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 16 }}>Security Configuration</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              ['Session Timeout', '30 minutes'],
              ['Two-Factor Authentication', 'Enabled (Mandatory)'],
              ['Password Policy', 'Min 12 chars, special chars required, 90-day expiry'],
              ['Login Attempt Limit', '3 attempts — account lockout'],
              ['Audit Log Retention', '7 years (as per NDPS Act)'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b', fontSize: 14 }}>{k}</span>
                <span style={{ fontWeight: 500, fontSize: 14, color: '#1e293b' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 16 }}>System Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              ['System Version', 'SDMS v2.4.1'],
              ['Last Security Patch', '2024-08-15'],
              ['Database Encryption', 'AES-256-GCM'],
              ['SSL/TLS', 'TLS 1.3 (enforced)'],
              ['Data Center', 'NIC Cloud, Hyderabad (Tier 4)'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b', fontSize: 14 }}>{k}</span>
                <span className="font-mono" style={{ fontWeight: 500, fontSize: 13, color: '#1e293b' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
