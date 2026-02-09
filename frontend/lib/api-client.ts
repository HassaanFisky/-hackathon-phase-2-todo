const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

let authToken: string | null = null;

async function request(endpoint: string, options: RequestInit = {}) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }
  
  // Also check localStorage if token is missing (fallback for hydration)
  if (!authToken && typeof window !== 'undefined') {
      const stored = localStorage.getItem('auth_token');
      if (stored) {
          authToken = stored; // Cache it
          headers["Authorization"] = `Bearer ${stored}`;
      }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
        // Unauthorized - Clear token
        if (typeof window !== 'undefined') {
             localStorage.removeItem('auth_token');
        }
    }
    const errorBody = await response.text();
    throw new Error(errorBody || `API Error: ${response.status}`);
  }

  return response.json();
}

export const apiClient = {
  setToken: (token: string) => {
    authToken = token;
  },

  clearToken: () => {
    authToken = null;
  },

  getTasks: async (userId: string, filter: "all" | "pending" | "completed") => {
    return request(`/api/tasks/${userId}?filter=${filter}`);
  },

  createTask: async (userId: string, task: { title: string; description?: string }) => {
    return request(`/api/tasks/${userId}`, {
      method: "POST",
      body: JSON.stringify(task),
    });
  },

  updateTask: async (userId: string, taskId: number, updates: { title?: string; description?: string }) => {
    return request(`/api/tasks/${userId}/${taskId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  toggleComplete: async (userId: string, taskId: number) => {
    return request(`/api/tasks/${userId}/${taskId}/toggle`, {
      method: "PUT",
    });
  },

  deleteTask: async (userId: string, taskId: number) => {
    return request(`/api/tasks/${userId}/${taskId}`, {
      method: "DELETE",
    });
  },
  
  // Intent API
  processIntent: async (input: string) => {
    return request(`/api/intent`, {
        method: "POST",
        body: JSON.stringify({ input })
    });
  }
};
