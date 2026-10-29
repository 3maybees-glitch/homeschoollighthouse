import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { brand } from "@/lib/brand-vocabulary";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = pageMetadata({
  title: "Create a Homeschool Lighthouse Account",
  description:
    "Create a free Homeschool Lighthouse account to save resources, submit a listing, and keep your family's homeschool path in one place.",
  path: "/signup",
});

export default async function SignupPage({
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
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Join {brand.siteName} to submit resources and save favorites.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="signup" nextPath={nextPath} />
        </CardContent>
      </Card>
    </div>
  );
}
