import { useState } from 'react'
import { login, verify2FA } from '../api/auth'
import { ApiError, USE_MOCK_DATA } from '../api/client'
import type { CurrentUser } from '../api/auth'

interface Props {
  onLogin: (user: CurrentUser) => void
}

export default function Login({ onLogin }: Props) {
  const [step, setStep] = useState<'login' | '2fa'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [otp, setOtp] = useState('')
  const [captchaChecked, setCaptchaChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please enter your credentials.'); return }
    if (!captchaChecked) { setError('Please complete the CAPTCHA verification.'); return }
    setLoading(true)
    try {
      await login(email, password)
      setStep('2fa')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handle2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (otp.length < 6) { setError('Please enter the 6-digit OTP.'); return }
    setLoading(true)
    try {
      // On success the backend has set the httpOnly session cookie already —
      // we just hold onto the returned profile for display in the UI.
      const user = await verify2FA(email, otp)
      onLogin(user)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-bg" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Background grid pattern */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      {/* Glow */}
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(29,78,216,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* India Gov emblem placeholder */}
      <div style={{ marginBottom: 24, textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1d4ed8, #0ea5e9)',
          margin: '0 auto 14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, boxShadow: '0 0 0 4px rgba(29,78,216,0.3)',
        }}>🔏</div>
        <div style={{ color: '#e2e8f0', fontSize: 19, fontWeight: 700, letterSpacing: '0.04em' }}>SECURE DIGITAL MANAGEMENT SYSTEM</div>
        <div style={{ color: '#64748b', fontSize: 12, marginTop: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Ministry of Home Affairs — Law Enforcement Division</div>
      </div>

      {/* Card */}
      <div style={{
        background: 'white',
        borderRadius: 14,
        width: '100%',
        maxWidth: 420,
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        position: 'relative', zIndex: 1,
        overflow: 'hidden',
      }}>
        {/* Card header */}
        <div style={{ background: '#0f2040', padding: '18px 28px', borderBottom: '1px solid #1a3a6b' }}>
          <div style={{ color: '#e2e8f0', fontSize: 15, fontWeight: 700 }}>
            {step === 'login' ? '🔐 Authorized Personnel Login' : '📱 Two-Factor Verification'}
          </div>
          <div style={{ color: '#4a7aab', fontSize: 12, marginTop: 3 }}>
            {step === 'login' ? 'Enter your credentials to access the system' : 'Enter the OTP sent to your registered device'}
          </div>
        </div>

        <div style={{ padding: '28px 28px 24px' }}>
          {step === 'login' ? (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Official Email / Username</label>
                <input
                  type="email"
                  className="input-field"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="officer@sdms.gov.in"
                  autoComplete="username"
                />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="input-field"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    style={{ paddingRight: 40 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 15 }}
                  >{showPass ? '🙈' : '👁'}</button>
                </div>
              </div>

              {/* CAPTCHA placeholder */}
              <div style={{ marginBottom: 18 }}>
                <div style={{
                  border: '1px solid #d1d5db', borderRadius: 6,
                  padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
                  background: '#f9fafb',
                }}>
                  <input
                    type="checkbox"
                    id="captcha"
                    checked={captchaChecked}
                    onChange={e => setCaptchaChecked(e.target.checked)}
                    style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#1d4ed8' }}
                  />
                  <label htmlFor="captcha" style={{ fontSize: 13.5, color: '#374151', cursor: 'pointer' }}>I am not a robot</label>
                  <div style={{ marginLeft: 'auto', fontSize: 22 }}>🔒</div>
                </div>
              </div>

              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '9px 12px', marginBottom: 16, color: '#dc2626', fontSize: 13 }}>
                  ⚠ {error}
                </div>
              )}

              <button className="btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center', padding: '11px 0' }} disabled={loading}>
                {loading ? 'Authenticating…' : 'Login to System'}
              </button>

              <div style={{ textAlign: 'center', marginTop: 14 }}>
                <button type="button" style={{ background: 'none', border: 'none', color: '#1d4ed8', fontSize: 13, cursor: 'pointer' }}>
                  Forgot password? Contact System Administrator
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handle2FA}>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#eff6ff', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>📱</div>
                <div style={{ fontSize: 13.5, color: '#475569' }}>OTP sent to registered mobile <strong>+91 ••••••7821</strong></div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Enter 6-Digit OTP</label>
                <input
                  className="input-field font-mono"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="— — — — — —"
                  style={{ textAlign: 'center', fontSize: 20, letterSpacing: '0.5em' }}
                  maxLength={6}
                />
              </div>

              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '9px 12px', marginBottom: 16, color: '#dc2626', fontSize: 13 }}>
                  ⚠ {error}
                </div>
              )}

              <button className="btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center', padding: '11px 0' }} disabled={loading}>
                {loading ? 'Verifying…' : 'Verify & Login'}
              </button>
              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <button type="button" onClick={() => setStep('login')} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 13, cursor: 'pointer' }}>
                  ← Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Security notice */}
      <div style={{ position: 'relative', zIndex: 1, marginTop: 20, maxWidth: 420, textAlign: 'center', color: '#475569', fontSize: 11.5, lineHeight: 1.6, padding: '0 16px' }}>
        🔒 This system is for authorized law enforcement and legal personnel only. All access is logged and monitored. Unauthorized use is a criminal offence under IT Act 2000.
      </div>

      {/* Mock-mode note — only shows while there's no real backend configured (see src/api/client.ts) */}
      {USE_MOCK_DATA && (
        <div style={{ position: 'relative', zIndex: 1, marginTop: 14, background: 'rgba(29,78,216,0.15)', border: '1px solid rgba(29,78,216,0.3)', borderRadius: 6, padding: '8px 16px', color: '#93c5fd', fontSize: 12 }}>
          DEMO MODE (no backend configured) — Enter any email/password, check CAPTCHA, then any 6-digit OTP
        </div>
      )}
    </div>
  )
}
