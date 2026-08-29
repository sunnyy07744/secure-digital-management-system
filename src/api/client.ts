/**
 * Shared API client.
 *
 * - Auth is via an httpOnly cookie set by Flask on login, so we never touch
 *   the token in JS. We just send `credentials: 'include'` on every request
 *   so the browser attaches the cookie automatically.
 * - Flask should set the cookie with `SameSite=Lax` (or `None; Secure` if
 *   frontend and backend are on different domains) for this to work.
 * - Set VITE_API_BASE_URL in a .env file once the backend exists, e.g.
 *   VITE_API_BASE_URL=http://localhost:5000/api
 *   If unset, it defaults to '/api' (works if you proxy /api to Flask in
 *   vite.config.ts, or serve the built frontend from Flask itself).
 */

const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api'

/**
 * USE_MOCK_DATA controls whether resource modules fall back to the static
 * arrays in `src/data.ts` instead of hitting the network. Flip this to
 * false once the Flask backend is up and reachable.
 *
 * It defaults to true unless VITE_API_BASE_URL is explicitly set, so the
 * app keeps working standalone (no backend) out of the box.
 */
export const USE_MOCK_DATA = !(import.meta as any).env?.VITE_API_BASE_URL

export class ApiError extends Error {
  status: number
  body: unknown
  constructor(message: string, status: number, body?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  /** Pass a FormData body directly (for file uploads) instead of JSON. */
  formData?: FormData
  signal?: AbortSignal
}

/**
 * Core request function. All resource modules (cases.ts, evidence.ts, ...)
 * call this instead of `fetch` directly, so auth, error handling and the
 * base URL only live in one place.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, formData, signal } = options

  const init: RequestInit = {
    method,
    credentials: 'include', // sends the httpOnly auth cookie automatically
    signal,
  }

  if (formData) {
    init.body = formData
    // Do NOT set Content-Type for FormData — the browser sets the correct
    // multipart boundary automatically.
  } else if (body !== undefined) {
    init.headers = { 'Content-Type': 'application/json' }
    init.body = JSON.stringify(body)
  }

  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, init)
  } catch (err) {
    throw new ApiError('Network error — could not reach the server.', 0, err)
  }

  // 204 No Content, or empty body
  const text = await res.text()
  const data = text ? safeJsonParse(text) : null

  if (!res.ok) {
    const message = (data && typeof data === 'object' && 'message' in data)
      ? String((data as any).message)
      : `Request failed with status ${res.status}`
    throw new ApiError(message, res.status, data)
  }

  return data as T
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

/** Small helper so mock fallbacks feel like a real network call in the UI (loading states, etc). */
export function mockDelay<T>(value: T, ms = 400): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms))
}
