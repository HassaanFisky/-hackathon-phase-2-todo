/**
 * Backend API client
 * Handles all communication with FastAPI backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL environment variable is not set");
}

export interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export class ApiClient {
  private token: string | null = null;

  /**
   * Set JWT token for authenticated requests
   */
  setToken(token: string) {
    this.token = token;
  }

  /**
   * Clear JWT token (for logout)
   */
  clearToken() {
    this.token = null;
  }

  /**
   * Internal method to make HTTP requests
   */
  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle different HTTP status codes
    if (response.status === 401) {
      throw new Error("Unauthorized - please log in again");
    }

    if (response.status === 403) {
      throw new Error("Forbidden - access denied");
    }

    if (response.status === 404) {
      throw new Error("Not found");
    }

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `HTTP ${response.status}`);
    }

    // 204 No Content responses have no body
    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  /**
   * Get all tasks for a user
   */
  async getTasks(userId: string, status: string = "all"): Promise<Task[]> {
    return this.request(`/api/${userId}/tasks?status=${status}`);
  }

  /**
   * Create a new task
   */
  async createTask(
    userId: string,
    data: { title: string; description?: string },
  ): Promise<Task> {
    return this.request(`/api/${userId}/tasks`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Get a specific task
   */
  async getTask(userId: string, taskId: number): Promise<Task> {
    return this.request(`/api/${userId}/tasks/${taskId}`);
  }

  /**
   * Update a task
   */
  async updateTask(
    userId: string,
    taskId: number,
    data: { title?: string; description?: string },
  ): Promise<Task> {
    return this.request(`/api/${userId}/tasks/${taskId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete a task
   */
  async deleteTask(userId: string, taskId: number): Promise<void> {
    return this.request(`/api/${userId}/tasks/${taskId}`, {
      method: "DELETE",
    });
  }

  /**
   * Toggle task completion
   */
  async toggleComplete(userId: string, taskId: number): Promise<Task> {
    return this.request(`/api/${userId}/tasks/${taskId}/complete`, {
      method: "PATCH",
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
