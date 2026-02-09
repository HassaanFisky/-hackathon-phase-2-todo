export const neonAuthConfig = {
  authority: process.env.NEXT_PUBLIC_NEON_AUTH_ISSUER!, // e.g. https://auth.neon.tech/...
  client_id: process.env.NEXT_PUBLIC_NEON_AUTH_CLIENT_ID!,
  redirect_uri:
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback`
      : "",
  response_type: "code", // Neon Auth (OIDC) usually supports code flow with PKCE
  scope: "openid profile email",
  post_logout_redirect_uri:
    typeof window !== "undefined" ? window.location.origin : "",
};
