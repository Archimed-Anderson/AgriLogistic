import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { oneTap } from "better-auth/plugins";
import { Pool } from "pg";

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
  return pool;
}

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const appleClientId = process.env.APPLE_CLIENT_ID;
const appleClientSecret = process.env.APPLE_CLIENT_SECRET;

const GOOGLE_PLACEHOLDER = "your_google_client_id";
const APPLE_PLACEHOLDER = "your_apple_client_id";

/** Google OAuth : enregistré seulement si ID et Secret sont présents et non placeholder (évite erreur serveur si non configuré). */
const isGoogleConfigured =
  !!googleClientId &&
  !!googleClientSecret &&
  googleClientId.trim() !== "" &&
  googleClientSecret.trim() !== "" &&
  googleClientId !== GOOGLE_PLACEHOLDER &&
  googleClientSecret !== "your_google_client_secret";

const isAppleConfigured =
  !!appleClientId &&
  !!appleClientSecret &&
  appleClientId !== APPLE_PLACEHOLDER &&
  appleClientSecret !== "your_apple_client_secret";

export const auth = betterAuth({
  baseURL: process.env.NEXTAUTH_URL || process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: getPool(),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "Farmer",
        input: true, // Allow input during registration
      },
    },
  },
  socialProviders: {
    ...(isGoogleConfigured ? {
      google: {
        clientId: googleClientId as string,
        clientSecret: googleClientSecret as string,
      },
    } : {}),
    ...(isAppleConfigured ? {
      apple: {
        clientId: appleClientId as string,
        clientSecret: appleClientSecret as string,
      },
    } : {}),
  },
  plugins: [
    nextCookies(),
    oneTap(),
  ],
  session: {
    expiresIn: 60 * 60 * 24, // 1 day
    updateAge: 60 * 60 * 24, // Keep session alive
  },
});
