import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getSessionProfile } from "@/lib/auth/session";
import { getNavigatorEntitlement } from "@/lib/navigator/access";
import { buildEncouragement, buildSubjectPlans } from "@/lib/navigator/match";
import { computeCompletionPercent } from "@/lib/navigator/survey";
import { memoryStore } from "@/lib/store/memory-store";
import { createClient } from "@/lib/supabase/server";
import type { NavigatorChart, NavigatorProfileAnswers, NavigatorSubjectPlan } from "@/types/navigator";

export async function GET() {
  const profile = await getSessionProfile();
  if (!profile?.id) {
    return NextResponse.json({ error: "Sign in to load saved Navigator charts." }, { status: 401 });
  }

  const entitlement = await getNavigatorEntitlement(profile.id);
  if (!entitlement.hasAccess) {
    return NextResponse.json({ error: "Navigator purchase required." }, { status: 403 });
  }

  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase
      .from("navigator_charts")
      .select("*")
      .eq("user_id", profile.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      const chart: NavigatorChart = {
        id: data.id,
        userId: data.user_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        answers: data.answers as NavigatorProfileAnswers,
        completionPercent: data.completion_percent,
        subjectPlans: data.subject_plans as NavigatorSubjectPlan[],
        encouragement: data.encouragement ?? "",
      };
      return NextResponse.json({ chart, entitlement });
    }
  }

  const chart = memoryStore.getNavigatorChart(profile.id);
  return NextResponse.json({ chart, entitlement });
}

export async function POST(request: Request) {
  const profile = await getSessionProfile();
  if (!profile?.id) {
    return NextResponse.json({ error: "Sign in to save your Navigator chart." }, { status: 401 });
  }

  const entitlement = await getNavigatorEntitlement(profile.id);
  if (!entitlement.hasAccess) {
    return NextResponse.json({ error: "Navigator purchase required." }, { status: 403 });
  }

  const body = (await request.json()) as {
    id?: string;
    answers: NavigatorProfileAnswers;
    subjectPlans?: NavigatorSubjectPlan[];
    completionPercent?: number;
    encouragement?: string;
    regenerate?: boolean;
  };

  if (!body.answers) {
    return NextResponse.json({ error: "Missing profile answers." }, { status: 400 });
  }

  const now = new Date().toISOString();
  const completionPercent = body.completionPercent ?? computeCompletionPercent(body.answers);
  const subjectPlans =
    body.regenerate || !body.subjectPlans?.length
      ? buildSubjectPlans(body.answers)
      : body.subjectPlans;
  const encouragement = body.encouragement ?? buildEncouragement(body.answers);
  const id = body.id && body.id !== "local" ? body.id : randomUUID();

  const chart: NavigatorChart = {
    id,
    userId: profile.id,
    createdAt: now,
    updatedAt: now,
    answers: body.answers,
    completionPercent,
    subjectPlans,
    encouragement,
  };

  const supabase = await createClient();
  if (supabase) {
    const payload = {
      id: chart.id,
      user_id: profile.id,
      answers: chart.answers,
      subject_plans: chart.subjectPlans,
      completion_percent: chart.completionPercent,
      encouragement: chart.encouragement,
      updated_at: now,
    };

    const { data: existing } = await supabase
      .from("navigator_charts")
      .select("id, created_at")
      .eq("id", chart.id)
      .eq("user_id", profile.id)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from("navigator_charts")
        .update(payload)
        .eq("id", chart.id)
        .eq("user_id", profile.id)
        .select("*")
        .single();
      if (error) {
        memoryStore.saveNavigatorChart(chart);
        return NextResponse.json({ chart, warning: error.message });
      }
      return NextResponse.json({
        chart: {
          ...chart,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        },
      });
    }

    const { data, error } = await supabase
      .from("navigator_charts")
      .insert({ ...payload, created_at: now })
      .select("*")
      .single();

    if (error) {
      memoryStore.saveNavigatorChart(chart);
      return NextResponse.json({ chart, warning: error.message });
    }

    return NextResponse.json({
      chart: {
        ...chart,
        id: data.id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    });
  }

  memoryStore.saveNavigatorChart(chart);
  return NextResponse.json({ chart });
}
