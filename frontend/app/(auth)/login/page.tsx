"use client";

import { useState } from "react";
import { authService } from "@/lib/auth-service";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.login();
    } catch (err: any) {
      setError(err.message || "Failed to redirect to login provider.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-3xl">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">
            Welcome Back
          </h1>
          <p className="text-gray-500 font-medium">
            To your Cognitive Infrastructure
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4 pt-4">
          <Button
            variant="primary"
            className="w-full h-12 text-lg"
            onClick={handleLogin}
            isLoading={isLoading}
          >
            Continue with Neon Identity
          </Button>

          <p className="text-xs text-center text-gray-400">
            By continuing, you accede to the protocol.
          </p>
        </div>
      </div>
    </div>
  );
}
