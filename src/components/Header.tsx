import { useState } from 'react'
import type { Page } from '../App'

interface Props {
  navigate: (page: Page) => void
  currentPage: Page
}

const PAGE_TITLES: Record<Page, string> = {
  dashboard: 'Dashboard',
  cases: 'Case Management',
  'case-detail': 'Case Details',
  evidence: 'Digital Evidence',
  'evidence-detail': 'Evidence Details',
  documents: 'Document Management',
  timeline: 'Investigation Timeline',
  reports: 'Reports',
  audit: 'Audit Logs',
  users: 'Users & Roles',
  notifications: 'Notifications',
  search: 'Global Search',
  settings: 'Settings',
}

export default function Header({ navigate, currentPage }: Props) {
  const [q, setQ] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim()) navigate('search')
  }

  return (
    <div style={{
      background: 'white',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 24px',
      height: 56,
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      flexShrink: 0,
    }}>
      {/* Page title */}
      <div style={{ flex: '0 0 auto' }}>
        <h1 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>
          {PAGE_TITLES[currentPage]}
        </h1>
      </div>

      <div style={{ flex: 1 }} />

      {/* Search */}
      <form onSubmit={handleSearch} style={{ position: 'relative' }}>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search cases, evidence, suspects…"
          style={{
            padding: '7px 12px 7px 34px',
            border: '1px solid #e2e8f0',
            borderRadius: 6,
            fontSize: 13,
            color: '#1e293b',
            background: '#f8fafc',
            outline: 'none',
            width: 240,
            fontFamily: 'DM Sans, sans-serif',
          }}
          onFocus={e => { e.target.style.borderColor = '#1d4ed8'; e.target.style.background = 'white' }}
          onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }}
        />
        <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 14 }}>🔍</span>
      </form>

      {/* Notifications bell */}
      <button
        onClick={() => navigate('notifications')}
        style={{
          width: 36, height: 36, borderRadius: 8,
          background: '#f8fafc', border: '1px solid #e2e8f0',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', fontSize: 16,
        }}
        title="Notifications"
      >
        🔔
        <span style={{
          position: 'absolute', top: 5, right: 5,
          width: 8, height: 8, borderRadius: '50%',
          background: '#dc2626', border: '2px solid white',
        }} />
      </button>

      {/* Security indicator */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '5px 10px', borderRadius: 6,
        background: '#f0fdf4', border: '1px solid #bbf7d0',
      }}>
        <span style={{ color: '#16a34a', fontSize: 11 }}>🔐</span>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: '#15803d' }}>Secure Session</span>
      </div>

      {/* Date/time */}
      <div style={{ fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' }}>
        {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
      </div>
    </div>
  )
}
