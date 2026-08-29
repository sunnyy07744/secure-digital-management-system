import { apiRequest, USE_MOCK_DATA, mockDelay } from './client'
import { USERS, type User } from '../data'

/** GET /api/users */
export async function getUsers(): Promise<User[]> {
  if (USE_MOCK_DATA) return mockDelay(USERS, 300)
  return apiRequest<User[]>('/users')
}

/** PATCH /api/users/{id} — e.g. change role or status. */
export async function updateUser(id: string, changes: Partial<User>): Promise<User> {
  if (USE_MOCK_DATA) {
    const existing = USERS.find(u => u.id === id)
    if (!existing) throw new Error('User not found')
    Object.assign(existing, changes)
    return mockDelay(existing, 400)
  }
  return apiRequest<User>(`/users/${id}`, { method: 'PATCH', body: changes })
}
