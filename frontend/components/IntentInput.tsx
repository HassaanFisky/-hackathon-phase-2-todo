import React, { useState, useEffect } from "react";

interface IntentInputProps {
  onCommit: (task: {
    title: string;
    category: string;
    priority: string;
    due_date?: string;
  }) => void;
  isLoading?: boolean;
}

export const IntentInput: React.FC<IntentInputProps> = ({
  onCommit,
  isLoading,
}) => {
  const [text, setText] = useState("");
  const [parsedIntent, setParsedIntent] = useState<any>(null);
  const [isThinking, setIsThinking] = useState(false);

  // Debounced parsing logic
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (text.trim().length > 3) {
        setIsThinking(true);
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/intent`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
          });
          const data = await res.json();
          if (data.parsed) {
            setParsedIntent(data.data);
          }
        } catch (e) {
          console.error("Brain freeze:", e);
        } finally {
          setIsThinking(false);
        }
      } else {
        setParsedIntent(null);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [text]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    // Use parsed intent or fallback to simple text
    const taskData = parsedIntent || {
      title: text,
      category: "general",
      priority: "medium",
    };

    onCommit(taskData);
    setText("");
    setParsedIntent(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 animate-fade-in">
      <form onSubmit={handleSubmit} className="relative group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full p-6 text-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border-2 border-transparent focus:border-primary-500/50 rounded-2xl shadow-lg resize-none outline-none transition-all duration-300 min-h-[120px]"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          disabled={isLoading}
        />

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="absolute top-4 right-4">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-ping" />
          </div>
        )}
      </form>

      {/* Cognitive Feedback Layer */}
      {parsedIntent && (
        <div className="flex flex-wrap gap-2 animate-slide-up px-2">
          {parsedIntent.priority === "high" && (
            <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold uppercase tracking-wider">
              🔥 High Priority
            </span>
          )}
          {parsedIntent.due_date && (
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
              📅 Due {new Date(parsedIntent.due_date).toLocaleDateString()}
            </span>
          )}
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-bold uppercase tracking-wider">
            🏷️ {parsedIntent.category}
          </span>
        </div>
      )}
    </div>
  );
};
