"use client";

import { useMemo, useState } from "react";
import { Download, Plus, Printer, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  buildTranscriptCsv,
  createCourseId,
  defaultYearCourses,
  downloadCsv,
  formatCredits,
  formatGpa,
  gradeOptions,
  highSchoolYears,
  subjectCatalog,
  subjectCategories,
  summarizeCourse,
  summarizeTranscript,
  type CourseEntry,
  type SubjectCategory,
  type YearKey,
} from "@/lib/tools/credit-hours";

const categoryOrder: SubjectCategory[] = [
  "math",
  "science",
  "english",
  "social_studies",
  "foreign_language",
  "elective",
];

export function CreditLogbook() {
  const [studentName, setStudentName] = useState("");
  const [schoolName, setSchoolName] = useState("Homeschool");
  const [yearCourses, setYearCourses] = useState<Record<YearKey, CourseEntry[]>>(() => ({
    freshman: [...defaultYearCourses.freshman],
    sophomore: [...defaultYearCourses.sophomore],
    junior: [...defaultYearCourses.junior],
    senior: [...defaultYearCourses.senior],
  }));

  const summary = useMemo(() => summarizeTranscript(yearCourses), [yearCourses]);

  function updateCourse(yearKey: YearKey, courseId: string, patch: Partial<CourseEntry>) {
    setYearCourses((current) => ({
      ...current,
      [yearKey]: current[yearKey].map((course) =>
        course.id === courseId ? { ...course, ...patch } : course,
      ),
    }));
  }

  function addCourse(yearKey: YearKey) {
    setYearCourses((current) => ({
      ...current,
      [yearKey]: [
        ...current[yearKey],
        { id: createCourseId(yearKey), subjectId: "literature", grade: "IP" },
      ],
    }));
  }

  function removeCourse(yearKey: YearKey, courseId: string) {
    setYearCourses((current) => ({
      ...current,
      [yearKey]: current[yearKey].filter((course) => course.id !== courseId),
    }));
  }

  function handlePrint() {
    window.print();
  }

  function handleExport() {
    const csv = buildTranscriptCsv(studentName, schoolName, yearCourses);
    const slug = (studentName || "transcript").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    downloadCsv(`${slug || "transcript"}-credit-logbook.csv`, csv);
  }

  return (
    <div className="credit-logbook-print mt-8 space-y-8">
      <section className="no-print rounded-3xl border border-[var(--color-border)] bg-white/90 p-6 shadow-sm">
        <h2 className="font-display text-xl font-semibold text-slate-950">Student Information</h2>
        <p className="mt-2 text-sm text-slate-600">
          Optional details for your printed transcript or exported spreadsheet.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="student-name">Student Name</Label>
            <Input
              id="student-name"
              value={studentName}
              onChange={(event) => setStudentName(event.target.value)}
              placeholder="Student name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="school-name">School / Program Name</Label>
            <Input
              id="school-name"
              value={schoolName}
              onChange={(event) => setSchoolName(event.target.value)}
              placeholder="Homeschool"
            />
          </div>
        </div>
      </section>

      <section className="no-print flex flex-wrap gap-3">
        <Button type="button" onClick={handlePrint} variant="outline">
          <Printer className="h-4 w-4" aria-hidden="true" />
          Print Transcript
        </Button>
        <Button type="button" onClick={handleExport}>
          <Download className="h-4 w-4" aria-hidden="true" />
          Export Spreadsheet
        </Button>
      </section>

      <div className="print-only mb-6 hidden border-b border-slate-300 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Homeschool Lighthouse — The Credit Logbook
        </p>
        <h2 className="font-display mt-2 text-3xl font-semibold text-slate-950">
          High School Transcript Summary
        </h2>
        <div className="mt-3 grid gap-1 text-sm text-slate-700 sm:grid-cols-2">
          <p>
            <span className="font-semibold">Student:</span> {studentName || "________________"}
          </p>
          <p>
            <span className="font-semibold">School:</span> {schoolName || "Homeschool"}
          </p>
          <p>
            <span className="font-semibold">Cumulative GPA:</span> {formatGpa(summary.cumulativeGpa)}
          </p>
          <p>
            <span className="font-semibold">Total Earned Credits:</span>{" "}
            {formatCredits(summary.totalEarnedCredits)}
          </p>
        </div>
      </div>

      {highSchoolYears.map((year) => {
        const yearSummary = summary.years.find((item) => item.year.key === year.key);
        const courses = yearCourses[year.key];

        return (
          <section
            key={year.key}
            className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white/90 shadow-sm"
          >
            <div className="border-b border-[var(--color-border)] bg-[var(--color-cream)] px-6 py-5">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted-foreground)]">
                    {year.gradeLabel}
                  </p>
                  <h2 className="font-display mt-1 text-2xl font-semibold text-slate-950">
                    {year.label}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-2">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Year GPA</p>
                    <p className="font-semibold text-slate-900">
                      {formatGpa(yearSummary?.yearGpa ?? null)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-2">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Earned Credits</p>
                    <p className="font-semibold text-slate-900">
                      {formatCredits(yearSummary?.earnedCredits ?? 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Subject / Course</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Grade</th>
                    <th className="px-4 py-3 font-semibold">Course Credits</th>
                    <th className="px-4 py-3 font-semibold">Earned Credits</th>
                    <th className="no-print px-4 py-3 font-semibold">
                      <span className="sr-only">Remove course</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => {
                    const subject = subjectCatalog.find((item) => item.id === course.subjectId);
                    const courseSummary = summarizeCourse(course);

                    return (
                      <tr key={course.id} className="border-t border-[var(--color-border)]">
                        <td className="px-4 py-3 align-top">
                          <Select
                            value={course.subjectId}
                            onValueChange={(value) =>
                              updateCourse(year.key, course.id, { subjectId: value })
                            }
                          >
                            <SelectTrigger className="min-w-[220px]">
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent className="max-h-72">
                              {subjectCatalog.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.label} · {subjectCategories[item.category]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-3 align-top text-slate-600">
                          {subject ? subjectCategories[subject.category] : "—"}
                        </td>
                        <td className="px-4 py-3 align-top">
                          <Select
                            value={course.grade}
                            onValueChange={(value) =>
                              updateCourse(year.key, course.id, { grade: value })
                            }
                          >
                            <SelectTrigger className="min-w-[180px]">
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                            <SelectContent>
                              {gradeOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-3 align-top font-medium text-slate-800">
                          {formatCredits(subject?.defaultCredits ?? 1)}
                        </td>
                        <td className="px-4 py-3 align-top font-semibold text-[var(--color-navy-deep)]">
                          {formatCredits(courseSummary.earnedCredits)}
                        </td>
                        <td className="no-print px-4 py-3 align-top">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeCourse(year.key, course.id)}
                            aria-label={`Remove ${subject?.label ?? "course"}`}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="no-print border-t border-[var(--color-border)] px-6 py-4">
              <Button type="button" variant="outline" onClick={() => addCourse(year.key)}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add Course
              </Button>
            </div>
          </section>
        );
      })}

      <section className="rounded-3xl border border-[var(--color-navy)]/15 bg-[var(--color-navy)] text-white shadow-lg">
        <div className="px-6 py-6 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-beam)]">
            Transcript Totals
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-300">Cumulative GPA</p>
              <p className="font-display mt-1 text-3xl font-semibold">
                {formatGpa(summary.cumulativeGpa)}
              </p>
              <p className="mt-2 text-xs text-slate-300">Weighted by course credit on a 4.0 scale</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-300">Total Earned Credits</p>
              <p className="font-display mt-1 text-3xl font-semibold">
                {formatCredits(summary.totalEarnedCredits)}
              </p>
              <p className="mt-2 text-xs text-slate-300">
                {formatCredits(summary.totalAttemptedCredits)} attempted across four years
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-300">Graduation Benchmark</p>
              <p className="font-display mt-1 text-3xl font-semibold">24+</p>
              <p className="mt-2 text-xs text-slate-300">
                Typical Carnegie units for high school completion
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categoryOrder.map((category) => (
              <div
                key={category}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
              >
                <span className="text-slate-200">{subjectCategories[category]}</span>
                <span className="font-semibold text-[var(--color-beam)]">
                  {formatCredits(summary.creditsByCategory[category])}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs leading-relaxed text-slate-300">
            Credit hours follow standard Carnegie units: most full-year courses count as 1.0 credit,
            semester courses as 0.5. Passing letter grades (D and above) earn full course credit; F
            and In Progress earn 0. Pass grades earn credit but do not affect GPA.
          </p>
        </div>
      </section>
    </div>
  );
}
