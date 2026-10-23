/**
 * UPGW API Client Service
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      let errMsg = `Request failed: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.detail) errMsg = errorData.detail;
      } catch (e) {}
      throw new Error(errMsg);
    }
    if (response.status === 204) return null;
    return await response.json();
  } catch (err) {
    console.error(`[API Error] ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Health
  getHealth: () => request('/health'),

  // Projects
  createProject: (name = 'New Generative Project', description = '') =>
    request('/projects', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    }),

  listProjects: (page = 1, pageSize = 20) =>
    request(`/projects?page=${page}&page_size=${pageSize}`),

  getProject: (projectId) => request(`/projects/${projectId}`),

  updateProject: (projectId, data) =>
    request(`/projects/${projectId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteProject: (projectId) =>
    request(`/projects/${projectId}`, { method: 'DELETE' }),

  // Chat & Generation
  sendMessage: (projectId, content, sessionId = 'default_session') =>
    request(`/projects/${projectId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, session_id: sessionId }),
    }),

  getMessages: (projectId) => request(`/projects/${projectId}/messages`),

  // UI Specs
  getUISpec: (projectId) => request(`/projects/${projectId}/ui`),

  updateUISpec: (projectId, spec) =>
    request(`/projects/${projectId}/ui`, {
      method: 'PUT',
      body: JSON.stringify(spec),
    }),

  // Revisions
  listRevisions: (projectId) => request(`/projects/${projectId}/revisions`),

  restoreRevision: (projectId, revisionId) =>
    request(`/projects/${projectId}/revisions/${revisionId}/restore`, {
      method: 'POST',
    }),

  // Actions
  executeAction: (actionId, payload = {}, projectId = null) =>
    request(`/actions/${actionId}/execute`, {
      method: 'POST',
      body: JSON.stringify({ action_id: actionId, payload, project_id: projectId }),
    }),

  // Preferences
  getPreferences: (sessionId = 'default_session') =>
    request(`/preferences?session_id=${sessionId}`),

  updatePreferences: (data, sessionId = 'default_session') =>
    request(`/preferences?session_id=${sessionId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deletePreferences: (sessionId = 'default_session') =>
    request(`/preferences?session_id=${sessionId}`, { method: 'DELETE' }),
};
