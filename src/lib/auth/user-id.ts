import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const USER_COOKIE = "hsl_user_id";

export async function getUserId() {
  const cookieStore = await cookies();
  const existing = cookieStore.get(USER_COOKIE)?.value;
  if (existing) return existing;

  const userId = `user_${randomUUID()}`;
  try {
    cookieStore.set(USER_COOKIE, userId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  } catch {
    // Called from Server Component without mutable cookies
  }
  return userId;
}
