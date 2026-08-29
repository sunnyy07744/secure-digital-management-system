import { apiRequest, USE_MOCK_DATA, mockDelay } from './client'
import { NOTIFICATIONS, type Notification } from '../data'

/** GET /api/notifications */
export async function getNotifications(): Promise<Notification[]> {
  if (USE_MOCK_DATA) return mockDelay(NOTIFICATIONS, 250)
  return apiRequest<Notification[]>('/notifications')
}

/** PATCH /api/notifications/{id} — mark as read. */
export async function markNotificationRead(id: string): Promise<void> {
  if (USE_MOCK_DATA) {
    const n = NOTIFICATIONS.find(n => n.id === id)
    if (n) n.read = true
    return mockDelay(undefined, 150)
  }
  return apiRequest<void>(`/notifications/${id}`, { method: 'PATCH', body: { read: true } })
}
