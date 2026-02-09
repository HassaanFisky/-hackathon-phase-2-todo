"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth-service";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if code or token is present in URL
    if (
      window.location.search.includes("code=") ||
      window.location.hash.includes("access_token=")
    ) {
      authService
        .handleCallback()
        .then((user) => {
          // Store token in local storage for API client usage if needed (though User Manager handles it)
          // But API Client needs raw token.
          if (user?.access_token) {
            localStorage.setItem("auth_token", user.access_token);
            // Also store user ID (sub)
            localStorage.setItem("user_id", user.profile.sub);
          }
          router.push("/dashboard");
        })
        .catch((err) => {
          console.error("Callback error", err);
          setError("Authentication failed. " + err.message);
        });
    } else {
      // No code?
      setError("No authorization code found.");
    }
  }, [router]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-800 p-8">
        <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
        <p>{error}</p>
        <button
          onClick={() => router.push("/login")}
          className="mt-6 px-4 py-2 bg-red-600 text-white rounded"
        >
          Retry Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50/50 backdrop-blur-xl">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      <p className="mt-4 text-gray-500 font-medium animate-pulse">
        Completing Secure Handshake...
      </p>
    </div>
  );
}
