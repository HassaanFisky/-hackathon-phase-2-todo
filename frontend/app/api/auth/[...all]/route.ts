/**
 * Better Auth catch-all route
 * Handles all auth-related API calls
 */

import { auth } from "@/lib/auth";

const handler = auth.handler;
export { handler as GET, handler as POST };
