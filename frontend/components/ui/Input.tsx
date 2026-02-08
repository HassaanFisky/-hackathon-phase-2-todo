import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isTextArea?: boolean;
  rows?: number;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  isTextArea = false,
  className = "",
  ...props
}) => {
  const inputStyles = `w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/30 font-medium ${
    error
      ? "border-red-500"
      : "border-gray-200 dark:border-gray-700 focus:border-primary-500"
  } ${className}`;

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
          {label}
        </label>
      )}
      {isTextArea ? (
        <textarea
          className={`${inputStyles} resize-none`}
          // Cast props efficiently to avoid complexity
          {...(props as any)}
        />
      ) : (
        <input className={inputStyles} {...props} />
      )}
      {error && (
        <p className="text-xs font-semibold text-red-500 ml-1 animate-slide-up">
          {error}
        </p>
      )}
    </div>
  );
};
