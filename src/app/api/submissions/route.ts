import { NextResponse } from "next/server";
import {
  enrichSubmissionWithGeocode,
  validateSubmissionInput,
} from "@/lib/listings/submission-validation";
import { memoryStore } from "@/lib/store/memory-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as "pending" | "approved" | "rejected" | null;
  const adminKey = request.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_SECRET && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const submissions = memoryStore.listSubmissions(status ?? undefined);
  return NextResponse.json({ submissions });
}

export async function POST(request: Request) {
  const body = await request.json();
  const validated = validateSubmissionInput(body);

  if ("error" in validated) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const enriched = await enrichSubmissionWithGeocode(validated.data);
  const submission = memoryStore.addSubmission(enriched);

  return NextResponse.json({ submission }, { status: 201 });
}

export async function PATCH(request: Request) {
  const adminKey = request.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const submission = memoryStore.updateSubmissionStatus(body.id, body.status);
  if (!submission) {
    return NextResponse.json({ error: "Submission not found." }, { status: 404 });
  }

  return NextResponse.json({ submission });
}
