import { apiRequest, USE_MOCK_DATA, mockDelay } from './client'
import { DOCUMENTS, type Document } from '../data'

/** GET /api/documents?caseId=... */
export async function getDocuments(caseId?: string): Promise<Document[]> {
  if (USE_MOCK_DATA) {
    const filtered = caseId ? DOCUMENTS.filter(d => d.caseId === caseId) : DOCUMENTS
    return mockDelay(filtered, 300)
  }
  return apiRequest<Document[]>(`/documents${caseId ? `?caseId=${caseId}` : ''}`)
}

/** POST /api/documents (multipart/form-data) */
export async function uploadDocument(caseId: string, file: File, type: Document['type'], accessLevel: Document['accessLevel']): Promise<Document> {
  if (USE_MOCK_DATA) {
    const created: Document = {
      id: `DOC-${Date.now()}`,
      name: file.name,
      type,
      caseId,
      caseName: 'Mock Case',
      uploadedBy: 'Current User',
      date: new Date().toISOString().slice(0, 10),
      version: '1.0',
      accessLevel,
      size: `${(file.size / 1024).toFixed(1)} KB`,
    }
    DOCUMENTS.unshift(created)
    return mockDelay(created, 700)
  }
  const formData = new FormData()
  formData.append('file', file)
  formData.append('caseId', caseId)
  formData.append('type', type)
  formData.append('accessLevel', accessLevel)
  return apiRequest<Document>('/documents', { method: 'POST', formData })
}
