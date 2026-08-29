import { apiRequest, USE_MOCK_DATA, mockDelay } from './client'
import { EVIDENCE, type Evidence } from '../data'

/** GET /api/evidence?caseId=... (caseId optional — omit for the full list) */
export async function getEvidence(caseId?: string): Promise<Evidence[]> {
  if (USE_MOCK_DATA) {
    const filtered = caseId ? EVIDENCE.filter(e => e.caseId === caseId) : EVIDENCE
    return mockDelay(filtered, 300)
  }
  return apiRequest<Evidence[]>(`/evidence${caseId ? `?caseId=${caseId}` : ''}`)
}

/** GET /api/evidence/{id} */
export async function getEvidenceById(id: string): Promise<Evidence | null> {
  if (USE_MOCK_DATA) {
    return mockDelay(EVIDENCE.find(e => e.id === id) ?? null, 200)
  }
  return apiRequest<Evidence>(`/evidence/${id}`)
}

/**
 * POST /api/evidence (multipart/form-data)
 * The backend computes and returns the real SHA-256 hash — never trust a
 * hash computed in the browser for chain-of-custody purposes.
 */
export async function uploadEvidence(caseId: string, file: File, description: string): Promise<Evidence> {
  if (USE_MOCK_DATA) {
    const created: Evidence = {
      id: `EVD-${Date.now()}`,
      caseId,
      caseName: 'Mock Case',
      name: file.name,
      type: 'Digital',
      filename: file.name,
      uploadDate: new Date().toISOString().slice(0, 10),
      uploadedBy: 'Current User',
      size: `${(file.size / 1024).toFixed(1)} KB`,
      hash: '0'.repeat(64), // placeholder — real hash comes from the backend
      integrityStatus: 'Pending',
      custodyStatus: 'In Custody',
      status: 'Active',
      description,
    }
    EVIDENCE.unshift(created)
    return mockDelay(created, 800)
  }
  const formData = new FormData()
  formData.append('file', file)
  formData.append('caseId', caseId)
  formData.append('description', description)
  return apiRequest<Evidence>('/evidence', { method: 'POST', formData })
}

/** GET /api/evidence/{id}/verify — re-runs SHA-256 verification server-side. */
export async function verifyEvidenceIntegrity(id: string): Promise<{ verified: boolean; hash: string; checkedAt: string }> {
  if (USE_MOCK_DATA) {
    const evidence = EVIDENCE.find(e => e.id === id)
    return mockDelay({ verified: true, hash: evidence?.hash ?? '', checkedAt: new Date().toISOString() }, 600)
  }
  return apiRequest(`/evidence/${id}/verify`)
}
