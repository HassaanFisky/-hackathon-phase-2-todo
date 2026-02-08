"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { apiClient, Task } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function DashboardPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  // Mature Auth Check & Hydration Fix
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const storedUserId = localStorage.getItem("user_id");

    if (!token || !storedUserId) {
      router.push("/login");
      return;
    }

    apiClient.setToken(token);
    setUserId(storedUserId);
  }, [router]);

  // SWR Fetcher - Only fetch when userId is available
  const {
    data: tasks = [],
    error,
    isLoading,
  } = useSWR(
    userId ? `/tasks/${userId}/${filter}` : null,
    () => apiClient.getTasks(userId!, filter),
    {
      revalidateOnFocus: true,
      dedupingInterval: 2000,
    },
  );

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !title.trim()) return;

    setIsSubmitting(true);
    try {
      await apiClient.createTask(userId, {
        title: title.trim(),
        description: description.trim() || undefined,
      });
      setTitle("");
      setDescription("");
      // Optimistic mutate
      mutate(`/tasks/${userId}/${filter}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleComplete = async (taskId: number) => {
    if (!userId) return;
    try {
      await apiClient.toggleComplete(userId, taskId);
      mutate(`/tasks/${userId}/${filter}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!userId || !confirm("Delete this task?")) return;
    try {
      await apiClient.deleteTask(userId, taskId);
      mutate(`/tasks/${userId}/${filter}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEdit = async (taskId: number) => {
    if (!userId) return;
    try {
      await apiClient.updateTask(userId, taskId, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
      setEditingId(null);
      mutate(`/tasks/${userId}/${filter}`);
    } catch (err) {
      console.error(err);
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

  if (isLoading && tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center">
        <div className="glass-card p-12 flex flex-col items-center gap-6 animate-pulse">
          <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-xl font-bold text-gray-700 dark:text-gray-300">
            Synchronizing tasks...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header - Professional Grade */}
        <header className="glass-card p-8 mb-8 flex flex-col md:flex-row justify-between items-center gap-6 animate-slide-up">
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-black tracking-tight">
              My <span className="text-gradient">Tasks</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">
              {tasks.length === 0
                ? "Inbox is empty"
                : `${pendingCount} open • ${completedCount} resolved`}
            </p>
          </div>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar / Filters */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="glass-card p-4 space-y-2">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">
                Views
              </h3>
              {[
                { id: "all", label: "All Tasks", icon: "📋" },
                { id: "pending", label: "Pending", icon: "⏳" },
                { id: "completed", label: "Completed", icon: "✅" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as any)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all duration-300 ${
                    filter === tab.id
                      ? "bg-primary-500 text-white shadow-glow"
                      : "text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </span>
                  <span
                    className={`text-xs ${filter === tab.id ? "text-white/70" : "text-gray-400"}`}
                  >
                    {
                      tasks.filter((t) =>
                        tab.id === "all"
                          ? true
                          : tab.id === "completed"
                            ? t.completed
                            : !t.completed,
                      ).length
                    }
                  </span>
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9 space-y-6">
            {/* Create Task Card */}
            <section className="glass-card p-8 animate-scale-in">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-sm">
                  ＋
                </span>
                Draft New Task
              </h2>
              <form onSubmit={handleAddTask} className="space-y-6">
                <Input
                  placeholder="Task title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <Input
                  isTextArea
                  placeholder="Add context or notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full"
                >
                  Create Task
                </Button>
              </form>
            </section>

            {/* Task Feed */}
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <div className="glass-card p-20 text-center animate-fade-in">
                  <div className="text-6xl mb-6">🏜️</div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                    Nothing to see here
                  </h3>
                  <p className="text-gray-500">
                    Your task list for this view is empty.
                  </p>
                </div>
              ) : (
                tasks.map((task, idx) => (
                  <article
                    key={task.id}
                    className="task-card group animate-slide-up"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {editingId === task.id ? (
                      <div className="space-y-4">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                        <Input
                          isTextArea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="primary"
                            onClick={() => handleSaveEdit(task.id)}
                            className="flex-1"
                          >
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => setEditingId(null)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleComplete(task.id)}
                          className="checkbox-custom mt-1.5"
                        />
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`text-lg font-black transition-all ${task.completed ? "line-through text-gray-400" : "text-gray-900 dark:text-white"}`}
                          >
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-gray-500 text-sm truncate mt-1">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-3">
                            <span className="text-[10px] font-black uppercase text-gray-400 border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded">
                              ID #{task.id}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium">
                              Added{" "}
                              {new Date(task.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            className="p-2 min-w-0"
                            onClick={() => {
                              setEditingId(task.id);
                              setEditTitle(task.title);
                              setEditDescription(task.description || "");
                            }}
                          >
                            ✏️
                          </Button>
                          <Button
                            variant="danger"
                            className="p-2 min-w-0"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            🗑️
                          </Button>
                        </div>
                      </div>
                    )}
                  </article>
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
