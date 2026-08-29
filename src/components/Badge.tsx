type Variant = 'critical' | 'high' | 'medium' | 'low' | 'active' | 'closed' | 'pending' | 'on-hold' | 'archived' | 'verified' | 'failed' | 'warning' | 'success' | 'info' | 'restricted' | 'confidential' | 'top-secret' | 'public'

const STYLES: Record<Variant, { bg: string; color: string; border: string }> = {
  critical:    { bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
  high:        { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
  medium:      { bg: '#fefce8', color: '#854d0e', border: '#fde68a' },
  low:         { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
  active:      { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  closed:      { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' },
  pending:     { bg: '#fefce8', color: '#854d0e', border: '#fde68a' },
  'on-hold':   { bg: '#f5f3ff', color: '#6d28d9', border: '#ddd6fe' },
  archived:    { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' },
  verified:    { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  failed:      { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  warning:     { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  success:     { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  info:        { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  restricted:  { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
  confidential:{ bg: '#fff1f2', color: '#be123c', border: '#fecdd3' },
  'top-secret':{ bg: '#fdf2f8', color: '#86198f', border: '#f5d0fe' },
  public:      { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
}

interface Props {
  variant: Variant
  label?: string
  dot?: boolean
}

export default function Badge({ variant, label, dot = false }: Props) {
  const s = STYLES[variant] ?? STYLES.info
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 8px', borderRadius: 12,
      fontSize: 11.5, fontWeight: 600, letterSpacing: '0.02em',
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      whiteSpace: 'nowrap',
    }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color, flexShrink: 0 }} />}
      {label ?? variant.charAt(0).toUpperCase() + variant.slice(1)}
    </span>
  )
}

export function priorityBadge(p: string) {
  const v = p.toLowerCase() as Variant
  return <Badge variant={v} label={p} dot />
}

export function statusBadge(s: string) {
  const map: Record<string, Variant> = {
    'Active': 'active',
    'Closed': 'closed',
    'Pending': 'pending',
    'On Hold': 'on-hold',
    'Archived': 'archived',
    'Verified': 'verified',
    'Failed': 'failed',
    'In Custody': 'success',
    'Transferred': 'warning',
    'Checked Out': 'info',
    'Flagged': 'critical',
    'Success': 'success',
    'Warning': 'warning',
  }
  return <Badge variant={map[s] ?? 'info'} label={s} dot />
}

export function accessBadge(level: string) {
  const map: Record<string, Variant> = {
    'Public': 'public',
    'Restricted': 'restricted',
    'Confidential': 'confidential',
    'Top Secret': 'top-secret',
  }
  return <Badge variant={map[level] ?? 'info'} label={level} />
}
