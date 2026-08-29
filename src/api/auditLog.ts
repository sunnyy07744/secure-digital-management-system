import { apiRequest, USE_MOCK_DATA, mockDelay } from './client'
import { AUDIT_LOG, type AuditEntry } from '../data'

/** GET /api/audit-logs?search=... — audit logs are read-only and should be immutable server-side. */
export async function getAuditLogs(search?: string): Promise<AuditEntry[]> {
  if (USE_MOCK_DATA) {
    const filtered = !search ? AUDIT_LOG : AUDIT_LOG.filter(a =>
      a.user.toLowerCase().includes(search.toLowerCase())
      || a.action.toLowerCase().includes(search.toLowerCase())
      || a.caseId.toLowerCase().includes(search.toLowerCase())
      || a.resource.toLowerCase().includes(search.toLowerCase())
    )
    return mockDelay(filtered, 300)
  }
  return apiRequest<AuditEntry[]>(`/audit-logs${search ? `?search=${encodeURIComponent(search)}` : ''}`)
}
