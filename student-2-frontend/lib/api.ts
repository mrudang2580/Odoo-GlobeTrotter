const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('gt_token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    throw new Error(`API Error: ${res.statusText}`);
  }
  return res.json();
}

export const api = {
  getTrips: () => fetchApi('/trips'),
  getTrip: (id: string) => fetchApi(`/trips/${id}`),
  createTrip: (data: any) => fetchApi('/trips', { method: 'POST', body: JSON.stringify(data) }),
  getCities: (params = '') => fetchApi(`/cities${params}`),
  getActivities: (params = '') => fetchApi(`/activities${params}`),
  getBudget: (tripId: string) => fetchApi(`/trips/${tripId}/budget`),
  getAdminStats: () => fetchApi('/admin/stats'),
};
