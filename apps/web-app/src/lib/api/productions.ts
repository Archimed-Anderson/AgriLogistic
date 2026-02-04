const API_URL =
  process.env.NEXT_PUBLIC_PRODUCTIONS_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8000/api/v1';

async function fetchApi(
  path: string,
  opts: RequestInit = {}
): Promise<Response> {
  const url = `${API_URL}${path}`;
  return fetch(url, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...opts.headers,
    },
  });
}

export async function getProductions(params?: {
  crop?: string;
  region?: string;
  calendar?: string;
}) {
  const q = new URLSearchParams();
  if (params?.crop && params.crop !== 'all') q.set('crop', params.crop);
  if (params?.region && params.region !== 'all') q.set('region', params.region);
  if (params?.calendar && params.calendar !== 'all') q.set('calendar', params.calendar);
  const query = q.toString();
  const res = await fetchApi(`/productions${query ? `?${query}` : ''}`);
  if (!res.ok) throw new Error('Failed to fetch productions');
  return res.json();
}

export async function getProductionById(id: string) {
  const res = await fetchApi(`/productions/${id}`);
  if (!res.ok) throw new Error('Failed to fetch production');
  return res.json();
}

export async function updateProductionStage(id: string, stage: string) {
  const res = await fetchApi(`/productions/${id}/stage`, {
    method: 'PATCH',
    body: JSON.stringify({ stage }),
  });
  if (!res.ok) throw new Error('Failed to update stage');
  return res.json();
}

export async function activateValve(productionId: string, valveId?: string) {
  const res = await fetchApi(`/irrigation/${productionId}/activate-valve`, {
    method: 'POST',
    body: JSON.stringify({ valveId: valveId ?? 'default' }),
  });
  if (!res.ok) throw new Error('Failed to activate valve');
  return res.json();
}

export async function deactivateValve(productionId: string, valveId?: string) {
  const res = await fetchApi(`/irrigation/${productionId}/deactivate-valve`, {
    method: 'POST',
    body: JSON.stringify({ valveId: valveId ?? 'default' }),
  });
  if (!res.ok) throw new Error('Failed to deactivate valve');
  return res.json();
}
