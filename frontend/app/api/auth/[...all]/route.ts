/**
 * Better Auth catch-all route
 * Handles all auth-related API calls
 */

import { auth } from "@/lib/auth";

export const { GET, POST } = auth.handler;
