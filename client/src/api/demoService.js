const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Helper to handle fetch responses and propagate API error messages
 */
const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
};

export const demoService = {
  /**
   * Fetch all demos with optional search, filter type, and sort
   */
  async getDemos(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.type && params.type !== 'all') query.append('type', params.type);
    if (params.sort) query.append('sort', params.sort);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${API_BASE}/demos${queryString}`);
    return handleResponse(res);
  },

  /**
   * Fetch single demo by ID
   */
  async getDemoById(id) {
    const res = await fetch(`${API_BASE}/demos/${id}`);
    return handleResponse(res);
  },

  /**
   * Create a new demo
   */
  async createDemo(payload) {
    const res = await fetch(`${API_BASE}/demos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  /**
   * Update an existing demo
   */
  async updateDemo(id, payload) {
    const res = await fetch(`${API_BASE}/demos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  /**
   * Delete demo by ID
   */
  async deleteDemo(id) {
    const res = await fetch(`${API_BASE}/demos/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  },

  /**
   * Reset / re-seed default 3 demos
   */
  async resetSeedDemos() {
    const res = await fetch(`${API_BASE}/demos/seed`, {
      method: 'POST'
    });
    return handleResponse(res);
  },

  /**
   * Check backend health and MongoDB connectivity status
   */
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse(res);
  }
};
