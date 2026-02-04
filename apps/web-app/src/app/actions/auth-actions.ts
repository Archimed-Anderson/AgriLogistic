"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UserRole } from "@/types/auth";

/** Résolution au moment de l'appel pour permettre le mock en tests (Jest). */
function getAuth() {
  return require("@/auth").auth;
}

/** Normalise le rôle pour Better Auth (Farmer, Admin, Buyer, Transporter). */
function normalizeRoleForAuth(rawRole: string): string {
  const normalized = Object.values(UserRole).find(
    (v) => v.toLowerCase() === String(rawRole || "").toLowerCase()
  );
  return normalized ?? UserRole.FARMER;
}

export async function signUpEmail(formData: FormData) {
  const email = (formData.get("email") as string)?.trim() ?? "";
  const password = (formData.get("password") as string) ?? "";
  const name = (formData.get("name") as string)?.trim() ?? "";
  const rawRole = (formData.get("role") as string) || "farmer";
  const role = normalizeRoleForAuth(rawRole);

  try {
    const user = await getAuth().api.signUpEmail({
      body: {
        email,
        password,
        name,
        role,
      },
      asResponse: false,
    });

    return { success: true, user };
  } catch (error: unknown) {
    console.error("Sign up error:", error);

    let errorMessage = "Échec de la création du compte. Veuillez réessayer.";

    const err = error as { message?: string; status?: number; code?: string };
    const msg = (err?.message ?? "").toLowerCase();

    if (
      msg.includes("already exists") ||
      msg.includes("unique") ||
      msg.includes("duplicate") ||
      msg.includes("already_exists") ||
      msg.includes("email_already_exists")
    ) {
      errorMessage = "Cet email est déjà utilisé.";
    } else if (err?.status === 400 || msg.includes("invalid") || msg.includes("validation")) {
      errorMessage = "Données d'inscription invalides. Vérifiez email, mot de passe et nom.";
    } else if (
      (msg.includes("relation") && (msg.includes("does not exist") || msg.includes("n'existe pas"))) ||
      (msg.includes("table") && msg.includes("does not exist")) ||
      msg.includes("relation \"user\"") ||
      msg.includes("relation 'user'")
    ) {
      errorMessage =
        "Base de données non migrée. Exécutez la migration Better Auth (voir README – Configuration Auth).";
    } else if (err?.status === 500 || msg.includes("database") || msg.includes("connection") || msg.includes("econnrefused")) {
      errorMessage = "Erreur serveur ou base de données. Réessayez plus tard.";
    } else if (err?.message && err.message !== "TIMEOUT") {
      errorMessage = err.message;
    }

    return { success: false, error: errorMessage };
  }
}

export async function signInEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await getAuth().api.signInEmail({
      body: {
        email,
        password,
      },
      asResponse: false,
    });
    
    if (response.user) {
        redirect("/");
    }
    
    return { success: true };
  } catch (error) {
    console.error("Sign in error", error);
    return { success: false, error: "Invalid credentials" };
  }
}

export async function signInSocial(provider: "google" | "apple") {
    try {
        const data = await auth.api.signInSocial({
            body: {
                provider: provider,
                callbackURL: "/", // Redirect after login
            },
        });
        
        if (data.url) {
            redirect(data.url);
        }
        
    } catch (error) {
        console.error("Social sign in error", error);
        throw error;
    }
}

export async function signOut() {
    await getAuth().api.signOut({
        headers: await headers(),
    });
    redirect("/auth/signin");
}
