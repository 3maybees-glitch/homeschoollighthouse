import { NextResponse } from "next/server";
import { getNavigatorEntitlement } from "@/lib/navigator/access";
import { buildEncouragement, buildYearPlans } from "@/lib/navigator/match";
import { computeCompletionPercent } from "@/lib/navigator/survey";
import { getSessionProfile } from "@/lib/auth/session";
import type { NavigatorProfileAnswers } from "@/types/navigator";

export async function POST(request: Request) {
  const profile = await getSessionProfile();
  const entitlement = await getNavigatorEntitlement(profile?.id);
  if (!entitlement.hasAccess) {
    return NextResponse.json({ error: "Navigator purchase required." }, { status: 403 });
  }

  const body = (await request.json()) as { answers?: NavigatorProfileAnswers };
  if (!body.answers) {
    return NextResponse.json({ error: "Missing answers." }, { status: 400 });
  }

  const yearPlans = buildYearPlans(body.answers);
  const subjectPlans = yearPlans[0]?.subjectPlans ?? [];
  const encouragement = buildEncouragement(body.answers);
  const completionPercent = computeCompletionPercent(body.answers);

  return NextResponse.json({
    yearPlans,
    subjectPlans,
    encouragement,
    completionPercent,
  });
}
