/**
 * Better Auth configuration
 * Handles user authentication with JWT tokens
 */

import { betterAuth } from "better-auth";

export const auth = betterAuth({
  // Database configuration
  database: {
    provider: "postgres",
    url: process.env.DATABASE_URL!,
  },

  // Enable email/password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Disabled for hackathon simplicity
  },

  // Social Providers
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  // Secret for signing JWT tokens (MUST match backend)
  secret: process.env.BETTER_AUTH_SECRET!,

  // Base URL of the application
  baseURL: process.env.BETTER_AUTH_URL!,

  // JWT configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update every 24 hours
  },
});

// Export session type for TypeScript
export type Session = typeof auth.$Infer.Session;
