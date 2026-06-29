"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Submission } from "@/types/community";

export function AdminQueue() {
  const [adminKey, setAdminKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [error, setError] = useState("");

  const load = async (key: string) => {
    setError("");
    const response = await fetch("/api/submissions?status=pending", {
      headers: { "x-admin-key": key },
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Could not load queue.");
      setAuthenticated(false);
      return;
    }
    setSubmissions(data.submissions ?? []);
    setAuthenticated(true);
  };

  useEffect(() => {
    const saved = window.localStorage.getItem("hsl_admin_key");
    if (saved) {
      setAdminKey(saved);
      load(saved);
    }
  }, []);

  const updateStatus = async (id: string, status: Submission["status"]) => {
    const response = await fetch("/api/submissions", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
      },
      body: JSON.stringify({ id, status }),
    });
    if (response.ok) {
      setSubmissions((current) => current.filter((submission) => submission.id !== id));
    }
  };

  if (!authenticated) {
    return (
      <div className="max-w-md space-y-4 rounded-3xl border bg-white/90 p-6 shadow-sm">
        <p className="text-sm text-slate-600">Enter your admin secret to moderate pending submissions.</p>
        <Input
          type="password"
          placeholder="ADMIN_SECRET"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button
          onClick={() => {
            window.localStorage.setItem("hsl_admin_key", adminKey);
            load(adminKey);
          }}
        >
          Enter Queue
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.length === 0 ? (
        <p className="rounded-3xl border bg-white/90 p-8 text-center text-slate-600">
          No pending signals in the queue.
        </p>
      ) : (
        submissions.map((submission) => (
          <article key={submission.id} className="rounded-3xl border bg-white/90 p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{submission.title}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {submission.listingType} · {new Date(submission.createdAt).toLocaleString()}
                </p>
                <a
                  href={submission.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-sm text-amber-700 hover:underline"
                >
                  {submission.websiteUrl}
                </a>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => updateStatus(submission.id, "approved")}>
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateStatus(submission.id, "rejected")}
                >
                  Reject
                </Button>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">{submission.description}</p>
            {submission.submitterEmail ? (
              <p className="mt-3 text-xs text-slate-500">Submitted by {submission.submitterEmail}</p>
            ) : null}
          </article>
        ))
      )}
    </div>
  );
}
