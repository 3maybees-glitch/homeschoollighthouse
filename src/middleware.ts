import { NextResponse, type NextRequest } from "next/server";
import { canonicalOriginForHost } from "@/lib/site-url";
import { updateSession } from "@/lib/supabase/middleware";

function headerHost(value: string | null) {
  return value?.split(",")[0]?.trim().split(":")[0]?.toLowerCase() ?? "";
}

function requestHostname(request: NextRequest) {
  const host = headerHost(request.headers.get("host"));
  const forwarded = headerHost(request.headers.get("x-forwarded-host"));
  if (host === "homeschoollighthouse.com" || forwarded === "homeschoollighthouse.com") {
    return "homeschoollighthouse.com";
  }
  return forwarded || host;
}

export async function middleware(request: NextRequest) {
  const canonicalOrigin = canonicalOriginForHost(requestHostname(request));
  if (canonicalOrigin) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = "www.homeschoollighthouse.com";
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
