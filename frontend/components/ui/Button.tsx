import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  isLoading,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "relative px-6 py-3 rounded-xl font-bold transition-all duration-300 overflow-hidden flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-large hover:shadow-glow hover:scale-[1.02]",
    secondary:
      "glass text-gray-700 dark:text-gray-300 border-2 border-transparent hover:border-primary-500/30",
    danger:
      "bg-red-500/10 text-red-600 border-2 border-transparent hover:border-red-500/30 hover:bg-red-500/20",
    ghost:
      "text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-3 border-current/30 border-t-current rounded-full animate-spin" />
      ) : (
        children
      )}
      {variant === "primary" && !disabled && !isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </button>
  );
};
