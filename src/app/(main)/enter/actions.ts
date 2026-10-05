"use server";

import { cookies } from "next/headers";

export async function verifyPassword(formData: FormData) {
  const password = formData.get("password") as string;
  const expectedPassword = process.env.SITE_PASSWORD;

  if (!expectedPassword) {
    return { success: false, error: "Configuration serveur manquante" };
  }

  if (password === expectedPassword) {
    const cookieStore = await cookies();
    cookieStore.set("access_granted", "true", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return { success: true };
  }

  return { success: false, error: "Mot de passe incorrect" };
}