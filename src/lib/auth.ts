import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

export async function getSession() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function requireAuth() {
  const session = await getSession();
  const allowedEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!session || !session.user) {
    redirect("/login");
  }

  if (allowedEmail && session.user.email?.toLowerCase() !== allowedEmail.toLowerCase()) {
    redirect("/login");
  }

  return session;
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}