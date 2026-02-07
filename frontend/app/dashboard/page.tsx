"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient, Task } from "@/lib/api-client";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    apiClient.setToken(token);
    loadTasks();
  }, [filter, router]);

  const loadTasks = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    try {
      const data = await apiClient.getTasks(userId, filter);
      setTasks(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
      if (err instanceof Error && err.message.includes("Unauthorized")) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem("user_id");
    if (!userId || !title.trim()) return;

    try {
      await apiClient.createTask(userId, {
        title: title.trim(),
        description: description.trim() || undefined,
      });
      setTitle("");
      setDescription("");
      loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    }
  };

  const handleToggleComplete = async (taskId: number) => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    try {
      await apiClient.toggleComplete(userId, taskId);
      loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    if (!confirm("Delete this task?")) return;

    try {
      await apiClient.deleteTask(userId, taskId);
      loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    }
  };

  const handleStartEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const handleSaveEdit = async (taskId: number) => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    try {
      await apiClient.updateTask(userId, taskId, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
      setEditingId(null);
      loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_id");
    apiClient.clearToken();
    router.push("/");
  };

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center">
        <div className="glass-card p-8 flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Loading your tasks...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="glass-card p-6 mb-6 animate-slide-up">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white">
                My <span className="text-gradient">Tasks</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {tasks.length === 0
                  ? "Start adding tasks to get organized"
                  : `${pendingCount} pending • ${completedCount} completed`}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-3 glass rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 hover-lift transition-all duration-300 border-2 border-transparent hover:border-red-500/30"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 glass border-2 border-red-500/30 rounded-xl animate-slide-up bg-red-50/50 dark:bg-red-900/20">
            <p className="text-sm text-red-800 dark:text-red-200 font-medium flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </p>
          </div>
        )}

        {/* Add Task Form */}
        <div
          className="glass-card p-6 mb-6 animate-scale-in"
          style={{ animationDelay: "100ms" }}
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">✨</span>
            Create New Task
          </h2>
          <form onSubmit={handleAddTask} className="space-y-4">
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                required
                maxLength={200}
                className="input-field text-lg"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {title.length}/200 characters
              </p>
            </div>
            <div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details (optional)"
                maxLength={1000}
                rows={3}
                className="input-field resize-none"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {description.length}/1000 characters
              </p>
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-bold text-lg shadow-large hover:shadow-glow hover:scale-105 transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Task
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </form>
        </div>

        {/* Filter Tabs */}
        <div
          className="glass-card p-2 mb-6 animate-fade-in"
          style={{ animationDelay: "200ms" }}
        >
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                key: "all",
                label: "All Tasks",
                count: tasks.length,
                icon: "📋",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                key: "pending",
                label: "Pending",
                count: pendingCount,
                icon: "⏳",
                gradient: "from-amber-500 to-orange-500",
              },
              {
                key: "completed",
                label: "Completed",
                count: completedCount,
                icon: "✅",
                gradient: "from-green-500 to-emerald-500",
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                  filter === tab.key
                    ? `bg-gradient-to-r ${tab.gradient} text-white shadow-medium hover:shadow-large`
                    : "text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50"
                }`}
              >
                <span className="flex flex-col items-center gap-1">
                  <span className="text-xl">{tab.icon}</span>
                  <span className="text-sm hidden sm:inline">{tab.label}</span>
                  <span className="text-xs sm:hidden">{tab.key}</span>
                  <span className="text-xs font-black">{tab.count}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div
              className="glass-card p-12 text-center animate-scale-in"
              style={{ animationDelay: "300ms" }}
            >
              <div className="text-6xl mb-4 animate-float">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No tasks yet!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create your first task above to get started
              </p>
            </div>
          ) : (
            tasks.map((task, index) => (
              <div
                key={task.id}
                className="task-card animate-slide-up"
                style={{ animationDelay: `${300 + index * 50}ms` }}
              >
                {editingId === task.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="input-field"
                      maxLength={200}
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="input-field resize-none"
                      rows={3}
                      maxLength={1000}
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleSaveEdit(task.id)}
                        className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-large hover:scale-105 transition-all duration-300"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 py-3 glass rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-start gap-4">
                    {/* Custom Checkbox */}
                    <div className="flex-shrink-0 pt-1">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleComplete(task.id)}
                        className="checkbox-custom"
                      />
                    </div>

                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-lg font-bold mb-1 transition-all duration-300 ${
                          task.completed
                            ? "line-through text-gray-500 dark:text-gray-500"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p
                          className={`text-sm mb-2 transition-all duration-300 ${
                            task.completed
                              ? "text-gray-400 dark:text-gray-600"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {new Date(task.created_at).toLocaleDateString()}
                        </span>
                        {task.completed && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-semibold">
                            ✓ Completed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleStartEdit(task)}
                        className="p-3 glass rounded-xl hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 text-gray-600 dark:text-gray-400 transition-all duration-300 hover-lift"
                        title="Edit task"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-3 glass rounded-xl hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 text-gray-600 dark:text-gray-400 transition-all duration-300 hover-lift"
                        title="Delete task"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
