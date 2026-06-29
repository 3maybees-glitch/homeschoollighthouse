import { AuthForm } from "@/components/auth/auth-form";
import { brand } from "@/lib/brand-vocabulary";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const nextPath = params.next ?? "/account";

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-14 sm:px-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to your {brand.siteName} Captain&apos;s Log.</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="login" nextPath={nextPath} />
        </CardContent>
      </Card>
    </div>
  );
}
