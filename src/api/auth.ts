import { apiRequest, USE_MOCK_DATA, mockDelay, ApiError } from './client'

export interface CurrentUser {
  id: string
  name: string
  email: string
  role: 'Administrator' | 'Investigator' | 'Legal Officer' | 'Evidence Officer' | 'Viewer'
  department: string
}

export interface LoginResult {
  /** True if login succeeded and a 2FA challenge was sent. Cookie is NOT set yet at this point. */
  requires2FA: boolean
}

/**
 * Step 1 of login: POST /api/auth/login
 * Flask should validate credentials and, on success, send an OTP to the
 * user's registered device — but NOT set the session cookie yet (that
 * happens after 2FA succeeds).
 */
export async function login(email: string, password: string): Promise<LoginResult> {
  if (USE_MOCK_DATA) {
    if (!email || !password) throw new ApiError('Please enter your credentials.', 400)
    return mockDelay({ requires2FA: true }, 1200)
  }
  return apiRequest<LoginResult>('/auth/login', { method: 'POST', body: { email, password } })
}

/**
 * Step 2 of login: POST /api/auth/verify-2fa
 * On success, Flask sets the httpOnly session cookie in the response.
 */
export async function verify2FA(email: string, otp: string): Promise<CurrentUser> {
  if (USE_MOCK_DATA) {
    if (otp.length < 6) throw new ApiError('Please enter the 6-digit OTP.', 400)
    return mockDelay(
      { id: 'USR-001', name: 'ACP Rajendra Singh', email, role: 'Administrator', department: 'Headquarters' },
      1000
    )
  }
  return apiRequest<CurrentUser>('/auth/verify-2fa', { method: 'POST', body: { email, otp } })
}

/** POST /api/auth/logout — clears the session cookie server-side. */
export async function logout(): Promise<void> {
  if (USE_MOCK_DATA) return mockDelay(undefined, 200)
  return apiRequest<void>('/auth/logout', { method: 'POST' })
}

/**
 * GET /api/auth/me — used on app load to check whether the httpOnly cookie
 * still represents a valid session (e.g. after a page refresh). Should
 * return 401 if not authenticated; apiRequest turns that into an ApiError
 * that callers should catch and treat as "not logged in".
 */
export async function getCurrentUser(): Promise<CurrentUser> {
  if (USE_MOCK_DATA) {
    // No real session to check in mock mode — always "not logged in" on
    // fresh load, matching current demo behavior (login required each visit).
    throw new ApiError('Not authenticated', 401)
  }
  return apiRequest<CurrentUser>('/auth/me')
}
