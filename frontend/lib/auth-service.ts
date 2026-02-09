import { UserManager, User, UserManagerSettings } from "oidc-client-ts";
import { neonAuthConfig } from "./neon-config";

const settings: UserManagerSettings = {
  authority: neonAuthConfig.authority,
  client_id: neonAuthConfig.client_id,
  redirect_uri: neonAuthConfig.redirect_uri,
  post_logout_redirect_uri: neonAuthConfig.post_logout_redirect_uri,
  response_type: neonAuthConfig.response_type,
  scope: neonAuthConfig.scope,
  // Use session storage by default (ephemeral)
};

export const userManager = new UserManager(settings);

export const authService = {
  login: async () => {
    try {
      await userManager.signinRedirect();
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  },

  handleCallback: async (): Promise<User> => {
    try {
      const user = await userManager.signinCallback();
      return user;
    } catch (err) {
      console.error("Callback handling failed:", err);
      throw err;
    }
  },

  logout: async () => {
    try {
      await userManager.signoutRedirect();
    } catch (err) {
      console.error("Logout failed:", err);
      // Fallback
      await userManager.removeUser();
      window.location.href = "/";
    }
  },

  getUser: async (): Promise<User | null> => {
    try {
      const user = await userManager.getUser();
      if (user && !user.expired) {
        return user;
      }
      return null;
    } catch (err) {
      return null;
    }
  },

  monitoring: (msg: string) => {
    // Placeholder for future monitoring
    console.log(`[Auth]: ${msg}`);
  },
};
