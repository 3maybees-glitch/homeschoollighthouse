import { NextResponse } from "next/server";
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
  if (!body.title || !body.websiteUrl || !body.description) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const submission = memoryStore.addSubmission({
    title: body.title,
    websiteUrl: body.websiteUrl,
    listingType: body.listingType ?? "other",
    description: body.description,
    submitterEmail: body.submitterEmail,
  });

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
