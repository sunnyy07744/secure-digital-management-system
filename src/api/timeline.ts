import { apiRequest, USE_MOCK_DATA, mockDelay } from './client'
import { TIMELINE_EVENTS } from '../data'

type TimelineEvent = (typeof TIMELINE_EVENTS)[number]

/** GET /api/timeline?caseId=... */
export async function getTimelineEvents(caseId?: string): Promise<TimelineEvent[]> {
  if (USE_MOCK_DATA) {
    const filtered = caseId ? TIMELINE_EVENTS.filter(t => t.caseId === caseId || t.caseId === 'ALL') : TIMELINE_EVENTS
    return mockDelay(filtered, 300)
  }
  return apiRequest<TimelineEvent[]>(`/timeline${caseId ? `?caseId=${caseId}` : ''}`)
}

export interface NewTimelineEventInput {
  caseId: string
  action: string
  description: string
  relatedEvidence?: string | null
}

/** POST /api/timeline — server should stamp date/time/investigator from the authenticated session. */
export async function addTimelineEvent(input: NewTimelineEventInput): Promise<TimelineEvent> {
  if (USE_MOCK_DATA) {
    const now = new Date()
    const created: TimelineEvent = {
      id: `TL-${Date.now()}`,
      date: now.toISOString().slice(0, 10),
      time: now.toTimeString().slice(0, 5),
      investigator: 'Current User',
      action: input.action,
      description: input.description,
      caseId: input.caseId,
      relatedEvidence: input.relatedEvidence ?? null,
      verified: false,
    }
    TIMELINE_EVENTS.unshift(created)
    return mockDelay(created, 500)
  }
  return apiRequest<TimelineEvent>('/timeline', { method: 'POST', body: input })
}
