import Link from "next/link";
import { getSessionProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export async function AuthNav() {
  const profile = await getSessionProfile();
  const supabase = await createClient();
  const hasAuth = Boolean(supabase);

  if (profile?.email) {
    return (
      <div className="hidden items-center gap-3 md:flex">
        <span className="text-sm text-slate-600">{profile.email}</span>
        {hasAuth ? (
          <form action="/auth/signout" method="post">
            <Button type="submit" variant="outline" size="sm">
              Sign Out
            </Button>
          </form>
        ) : null}
      </div>
    );
  }

  if (!hasAuth) return null;

  return (
    <div className="hidden items-center gap-3 md:flex">
      <Link href="/login" className="text-sm font-medium text-slate-700 hover:text-amber-700">
        Sign In
      </Link>
      <Button asChild size="sm" variant="outline">
        <Link href="/signup">Sign Up</Link>
      </Button>
    </div>
  );
}
