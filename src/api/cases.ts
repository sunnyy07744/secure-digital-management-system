import { apiRequest, USE_MOCK_DATA, mockDelay } from './client'
import { CASES, type Case } from '../data'

export interface CaseFilters {
  search?: string
  status?: string
  priority?: string
}

function buildQuery(filters: CaseFilters): string {
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.status) params.set('status', filters.status)
  if (filters.priority) params.set('priority', filters.priority)
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

/** GET /api/cases — server-side filtering when a real backend exists. */
export async function getCases(filters: CaseFilters = {}): Promise<Case[]> {
  if (USE_MOCK_DATA) {
    // Client-side filtering here mirrors what Cases.tsx used to do inline,
    // so the page keeps working unchanged in mock mode.
    const filtered = CASES.filter(c => {
      const matchSearch = !filters.search
        || c.id.toLowerCase().includes(filters.search.toLowerCase())
        || c.title.toLowerCase().includes(filters.search.toLowerCase())
        || c.investigator.toLowerCase().includes(filters.search.toLowerCase())
      const matchStatus = !filters.status || c.status === filters.status
      const matchPriority = !filters.priority || c.priority === filters.priority
      return matchSearch && matchStatus && matchPriority
    })
    return mockDelay(filtered, 300)
  }
  return apiRequest<Case[]>(`/cases${buildQuery(filters)}`)
}

/** GET /api/cases/{id} */
export async function getCaseById(id: string): Promise<Case | null> {
  if (USE_MOCK_DATA) {
    return mockDelay(CASES.find(c => c.id === id) ?? null, 200)
  }
  return apiRequest<Case>(`/cases/${id}`)
}

export interface NewCaseInput {
  title: string
  location: string
  type: Case['type']
  priority: Case['priority']
  description: string
}

/** POST /api/cases */
export async function createCase(input: NewCaseInput): Promise<Case> {
  if (USE_MOCK_DATA) {
    const created: Case = {
      id: `CASE-${new Date().getFullYear()}-${String(CASES.length + 1).padStart(3, '0')}`,
      title: input.title,
      type: input.type,
      priority: input.priority,
      status: 'Pending',
      investigator: 'Unassigned',
      department: 'Pending Assignment',
      filedDate: new Date().toISOString().slice(0, 10),
      lastUpdated: new Date().toISOString().slice(0, 10),
      description: input.description,
      location: input.location,
      victims: [],
      suspects: [],
      evidenceCount: 0,
      documentsCount: 0,
    }
    CASES.unshift(created) // mutate the in-memory mock array so it shows up in the list
    return mockDelay(created, 500)
  }
  return apiRequest<Case>('/cases', { method: 'POST', body: input })
}

/** PATCH /api/cases/{id} */
export async function updateCase(id: string, changes: Partial<Case>): Promise<Case> {
  if (USE_MOCK_DATA) {
    const existing = CASES.find(c => c.id === id)
    if (!existing) throw new Error('Case not found')
    Object.assign(existing, changes, { lastUpdated: new Date().toISOString().slice(0, 10) })
    return mockDelay(existing, 400)
  }
  return apiRequest<Case>(`/cases/${id}`, { method: 'PATCH', body: changes })
}
