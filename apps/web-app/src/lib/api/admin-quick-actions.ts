/**
 * Client API pour Quick Actions et Audit (admin dashboard)
 * Kong: NEXT_PUBLIC_API_URL/admin | Direct: NEXT_PUBLIC_ADMIN_API_URL/api/v1/admin
 */

const API_V1 = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL
  ? `${process.env.NEXT_PUBLIC_ADMIN_API_URL.replace(/\/$/, '')}/api/v1/admin`
  : `${API_V1.replace(/\/$/, '')}/admin`;

async function adminFetch(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<Response> {
  const { token, ...fetchOpts } = options;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(fetchOpts.headers as Record<string, string>),
  };
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  const p = path.startsWith('/') ? path : `/${path}`;
  const res = await fetch(`${ADMIN_URL}${p}`, {
    ...fetchOpts,
    headers,
    cache: 'no-store', // bypass cache (cahier des charges)
  });
  return res;
}

/**
 * POST /api/v1/admin/quick-actions/:action
 */
export async function executeQuickAction(
  action: string,
  token: string | null,
  body?: object
): Promise<{ success: boolean; action: string; message?: string }> {
  const res = await adminFetch(`/quick-actions/${action}`, {
    method: 'POST',
    token: token || undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || `Action ${action} failed`);
  }
  return data;
}

/**
 * POST /api/v1/admin/audit
 */
export async function persistAudit(
  payload: { action: string; target?: string | null; resource?: string; metadata?: object },
  token: string | null
): Promise<{ success: boolean }> {
  const res = await adminFetch('/admin/audit', {
    method: 'POST',
    token: token || undefined,
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Audit persist failed');
  }
  return data;
}

/**
 * POST /api/v1/admin/workflows/emergency-stop
 */
export async function emergencyStop(
  token: string | null,
  body?: { corridorId?: string; reason?: string }
): Promise<{ success: boolean; workflow: string }> {
  const res = await adminFetch('/workflows/emergency-stop', {
    method: 'POST',
    token: token || undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Emergency stop failed');
  }
  return data;
}

/**
 * POST /api/v1/admin/workflows/reroute-fleet
 */
export async function rerouteFleet(
  token: string | null,
  body?: { zoneId?: string; fleetIds?: string[]; reason?: string }
): Promise<{ success: boolean; workflow: string }> {
  const res = await adminFetch('/workflows/reroute-fleet', {
    method: 'POST',
    token: token || undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Reroute fleet failed');
  }
  return data;
}
