import { AuthForm } from "@/components/auth/auth-form";
import { brand } from "@/lib/brand-vocabulary";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const nextPath = params.next ?? "/account";
  const authError =
    params.error === "auth_callback"
      ? "Sign-in could not be completed (email link or Google). Please try again — or use email and password below."
      : null;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-14 sm:px-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to your {brand.siteName} Captain&apos;s Log.</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="login" nextPath={nextPath} authError={authError} />
        </CardContent>
      </Card>
    </div>
  );
}
