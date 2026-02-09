"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input"; // Used for editing, not creating
import { IntentInput } from "@/components/IntentInput";
import { authService } from "@/lib/auth-service";

export default function DashboardPage() {
  const router = useRouter();
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
  const { data: tasks = [], isLoading } = useSWR(
    userId ? `/tasks/${userId}/${filter}` : null,
    () => apiClient.getTasks(userId!, filter),
    {
      revalidateOnFocus: true,
      dedupingInterval: 2000,
    },
  );

  const handleAddTask = async (intent: {
    title: string;
    category: string;
    priority: string;
    due_date?: string;
  }) => {
    if (!userId) return;

    setIsSubmitting(true);
    try {
      // Store metadata in description for now since DB is simple
      const metaDescription = JSON.stringify({
        category: intent.category,
        priority: intent.priority,
        due: intent.due_date,
      });

      await apiClient.createTask(userId, {
        title: intent.title,
        description: metaDescription,
      });

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
    if (!userId || !confirm("Delete this thread?")) return;
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

  const handleLogout = async () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_id");
    apiClient.clearToken();
    await authService.logout();
  };

  const pendingCount = tasks.filter((t) => !t.completed).length;

  if (isLoading && tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500 font-sans">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Header - Minimalist */}
        <header className="flex justify-between items-center animate-fade-in">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white">
              Focus Stream
            </h1>
            <p className="text-gray-400 font-medium tracking-wide">
              {pendingCount} active threads
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-xs uppercase tracking-widest font-bold opacity-50 hover:opacity-100"
          >
            Disengage
          </Button>
        </header>

        {/* The Brain (Input) */}
        <section className="sticky top-6 z-50">
          <IntentInput onCommit={handleAddTask} isLoading={isSubmitting} />
        </section>

        {/* The Stream (Task Feed) */}
        <main className="space-y-8 pb-20">
          {/* Subtle Filters */}
          <div className="flex gap-6 border-b border-gray-200 dark:border-gray-800 pb-4 mb-8 overflow-x-auto no-scrollbar">
            {[
              { id: "all", label: "Everything" },
              { id: "pending", label: "Active" },
              { id: "completed", label: "Archived" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  filter === tab.id
                    ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-500"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="py-20 text-center opacity-30">
                <p className="text-2xl font-light">Zero State.</p>
              </div>
            ) : (
              tasks.map((task, idx) => (
                <article
                  key={task.id}
                  className="group relative bg-white dark:bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 animate-slide-up hover:shadow-lg"
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
                          Save Thought
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
                    <div className="flex items-start gap-5">
                      <button
                        onClick={() => handleToggleComplete(task.id)}
                        className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          task.completed
                            ? "bg-emerald-500 border-emerald-500"
                            : "border-gray-300 dark:border-gray-600 hover:border-primary-500 hover:scale-110"
                        }`}
                      >
                        {task.completed && (
                          <span className="text-white text-xs font-bold">
                            ✓
                          </span>
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-xl font-medium leading-snug transition-all ${task.completed ? "line-through text-gray-400 decoration-2" : "text-gray-900 dark:text-white"}`}
                        >
                          {task.title}
                        </h3>

                        {/* Intelligent Metadata Rendering */}
                        <div className="mt-3 flex flex-wrap gap-2 items-center">
                          <span className="text-[10px] font-mono text-gray-300 dark:text-gray-600">
                            #{task.id}
                          </span>

                          {task.description && task.description.startsWith("{")
                            ? (() => {
                                try {
                                  const meta = JSON.parse(task.description);
                                  return (
                                    <>
                                      {meta.priority === "high" && (
                                        <span className="px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-wider">
                                          High Priority
                                        </span>
                                      )}
                                      {meta.category && (
                                        <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                                          {meta.category}
                                        </span>
                                      )}
                                      {meta.due && (
                                        <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                                          Due{" "}
                                          {new Date(
                                            meta.due,
                                          ).toLocaleDateString(undefined, {
                                            month: "short",
                                            day: "numeric",
                                          })}
                                        </span>
                                      )}
                                    </>
                                  );
                                } catch {
                                  return (
                                    <span className="text-gray-500 text-sm">
                                      {task.description}
                                    </span>
                                  );
                                }
                              })()
                            : task.description && (
                                <span className="text-gray-500 text-sm">
                                  {task.description}
                                </span>
                              )}
                        </div>
                      </div>

                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEditingId(task.id);
                            setEditTitle(task.title);
                            setEditDescription(task.description || "");
                          }}
                          className="p-2 text-gray-400 hover:text-primary-500 transition-colors"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          ×
                        </button>
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
  );
}
