const API_BASE_URL = 'http://localhost:3001/api';

// Helper function for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Module API calls
export const modulesApi = {
  // Get all modules
  getAll: () => apiCall('/modules'),

  // Get modules by type
  getByType: (type: 'groceries' | 'todo' | 'bucketlist') => 
    apiCall(`/modules/type/${type}`),

  // Get single module with items
  getById: (id: string) => apiCall(`/modules/${id}`),

  // Create new module
  create: (name: string, type: 'groceries' | 'todo' | 'bucketlist') =>
    apiCall('/modules', {
      method: 'POST',
      body: JSON.stringify({ name, type }),
    }),

  // Update module
  update: (id: string, data: { name: string; createdAt?: string }) =>
    apiCall(`/modules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Delete module
  delete: (id: string) =>
    apiCall(`/modules/${id}`, {
      method: 'DELETE',
    }),
};

// Item API calls
export const itemsApi = {
  // Get all items for a module
  getByModule: (moduleId: string) => apiCall(`/items/module/${moduleId}`),

  // Create new item
  create: (moduleId: string, text: string, timeframe?: string) =>
    apiCall('/items', {
      method: 'POST',
      body: JSON.stringify({ moduleId, text, timeframe }),
    }),

  // Update item
  update: (id: string, data: { text?: string; completed?: boolean; timeframe?: string }) =>
    apiCall(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Toggle item completion
  toggle: (id: string) =>
    apiCall(`/items/${id}/toggle`, {
      method: 'PATCH',
    }),

  // Delete single item
  delete: (id: string) =>
    apiCall(`/items/${id}`, {
      method: 'DELETE',
    }),

  // Delete all items in a module
  deleteAll: (moduleId: string) =>
    apiCall(`/items/module/${moduleId}/all`, {
      method: 'DELETE',
    }),

  // Delete completed items in a module
  deleteCompleted: (moduleId: string) =>
    apiCall(`/items/module/${moduleId}/completed`, {
      method: 'DELETE',
    }),
};

// Health check
export const healthCheck = () => apiCall('/health'); 