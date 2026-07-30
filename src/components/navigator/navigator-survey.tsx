"use client";

import { useMemo } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  careerTradeOptions,
  coreSubjectOptions,
  deliveryOptions,
  faithPreferenceOptions,
  gradeLevelOptions,
  gradingStyleOptions,
  groupStyleOptions,
  interestSubjectOptions,
  isStepComplete,
  learningStyleOptions,
  personalityTraitOptions,
  priceRangeOptions,
  strengthImprovementOptions,
  surveySteps,
  techPreferenceOptions,
  writingLevelOptions,
} from "@/lib/navigator/survey";
import type { NavigatorProfileAnswers } from "@/types/navigator";
import { useState } from "react";

function toggleValue<T extends string>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-left text-sm transition ${
        selected
          ? "border-[var(--color-seafoam)] bg-[var(--color-seafoam)]/15 text-[var(--color-navy-deep)]"
          : "border-[var(--color-border)] bg-white text-[var(--color-muted-foreground)] hover:border-[var(--color-seafoam)]/50"
      }`}
    >
      {selected ? <Check className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

export function NavigatorSurvey({
  answers,
  onChange,
  onComplete,
  completion,
}: {
  answers: NavigatorProfileAnswers;
  onChange: (answers: NavigatorProfileAnswers) => void;
  onComplete: (answers: NavigatorProfileAnswers) => void;
  completion: number;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = surveySteps[stepIndex]!;
  const stepDone = useMemo(() => isStepComplete(step, answers), [step, answers]);

  const setField = <K extends keyof NavigatorProfileAnswers>(
    key: K,
    value: NavigatorProfileAnswers[K],
  ) => {
    onChange({ ...answers, [key]: value });
  };

  const goNext = () => {
    if (stepIndex < surveySteps.length - 1) {
      setStepIndex((current) => current + 1);
      return;
    }
    onComplete(answers);
  };

  return (
    <div className="rounded-[2rem] border border-[var(--color-border)] bg-white/95 p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex flex-wrap gap-2">
        {surveySteps.map((item, index) => {
          const done = isStepComplete(item, answers);
          const active = index === stepIndex;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setStepIndex(index)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                active
                  ? "bg-[var(--color-navy)] text-white"
                  : done
                    ? "bg-teal-100 text-teal-900"
                    : "bg-slate-100 text-slate-500"
              }`}
            >
              {index + 1}. {item.title}
            </button>
          );
        })}
      </div>

      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-seafoam)]">
        Step {stepIndex + 1} of {surveySteps.length} · {completion}% charted
      </p>
      <h3 className="font-display mt-2 text-3xl font-semibold text-[var(--color-navy-deep)]">
        {step.title}
      </h3>
      <p className="mt-2 max-w-2xl text-[var(--color-muted-foreground)]">{step.subtitle}</p>

      <div className="mt-8 space-y-6">
        {step.id === "student" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-[var(--color-navy)]">First name</span>
              <input
                className="w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5"
                value={answers.firstName}
                onChange={(e) => setField("firstName", e.target.value)}
                placeholder="Sailor's first name"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-[var(--color-navy)]">Age</span>
              <input
                className="w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5"
                value={answers.age}
                onChange={(e) => setField("age", e.target.value)}
                placeholder="e.g. 15"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-[var(--color-navy)]">Grade level</span>
              <select
                className="w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5"
                value={answers.gradeLevel}
                onChange={(e) =>
                  setField("gradeLevel", e.target.value as NavigatorProfileAnswers["gradeLevel"])
                }
              >
                <option value="">Select grade</option>
                {gradeLevelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-[var(--color-navy)]">
                Years / grades remaining until 12th-grade graduation
              </span>
              <input
                className="w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5"
                value={answers.semestersUntilGraduation}
                onChange={(e) => setField("semestersUntilGraduation", e.target.value)}
                placeholder="e.g. 8 years, or 4 semesters"
              />
            </label>
          </div>
        ) : null}

        {step.id === "core" ? (
          <div className="flex flex-wrap gap-2">
            {coreSubjectOptions.map((option) => (
              <Chip
                key={option.value}
                selected={answers.coreSubjects.includes(option.value)}
                onClick={() => setField("coreSubjects", toggleValue(answers.coreSubjects, option.value))}
              >
                {option.label}
              </Chip>
            ))}
          </div>
        ) : null}

        {step.id === "interests" ? (
          <div className="flex flex-wrap gap-2">
            {interestSubjectOptions.map((option) => (
              <Chip
                key={option.value}
                selected={answers.interestSubjects.includes(option.value)}
                onClick={() =>
                  setField("interestSubjects", toggleValue(answers.interestSubjects, option.value))
                }
              >
                {option.label}
              </Chip>
            ))}
          </div>
        ) : null}

        {step.id === "learning" ? (
          <>
            <div>
              <p className="mb-2 text-sm font-medium text-[var(--color-navy)]">Learning styles</p>
              <div className="flex flex-wrap gap-2">
                {learningStyleOptions.map((option) => (
                  <Chip
                    key={option.value}
                    selected={answers.learningStyles.includes(option.value)}
                    onClick={() =>
                      setField("learningStyles", toggleValue(answers.learningStyles, option.value))
                    }
                  >
                    {option.label}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-[var(--color-navy)]">
                Delivery: online, hybrid, in-home, co-op
              </p>
              <div className="flex flex-wrap gap-2">
                {deliveryOptions.map((option) => (
                  <Chip
                    key={option.value}
                    selected={answers.deliveryModes.includes(option.value)}
                    onClick={() =>
                      setField("deliveryModes", toggleValue(answers.deliveryModes, option.value))
                    }
                  >
                    {option.label}
                  </Chip>
                ))}
              </div>
            </div>
          </>
        ) : null}

        {step.id === "budget" ? (
          <div className="flex flex-wrap gap-2">
            {priceRangeOptions.map((option) => (
              <Chip
                key={option.value}
                selected={answers.priceRange === option.value}
                onClick={() => setField("priceRange", option.value)}
              >
                {option.label}
              </Chip>
            ))}
          </div>
        ) : null}

        {step.id === "strengths" ? (
          <>
            <div>
              <p className="mb-2 text-sm font-medium text-[var(--color-navy)]">Subject strengths</p>
              <div className="flex flex-wrap gap-2">
                {strengthImprovementOptions.map((option) => (
                  <Chip
                    key={`str-${option}`}
                    selected={answers.subjectStrengths.includes(option)}
                    onClick={() =>
                      setField("subjectStrengths", toggleValue(answers.subjectStrengths, option))
                    }
                  >
                    {option}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-[var(--color-navy)]">
                Areas of improvement
              </p>
              <div className="flex flex-wrap gap-2">
                {strengthImprovementOptions.map((option) => (
                  <Chip
                    key={`imp-${option}`}
                    selected={answers.subjectImprovements.includes(option)}
                    onClick={() =>
                      setField(
                        "subjectImprovements",
                        toggleValue(answers.subjectImprovements, option),
                      )
                    }
                  >
                    {option}
                  </Chip>
                ))}
              </div>
            </div>
          </>
        ) : null}

        {step.id === "path" ? (
          <>
            <div>
              <p className="mb-2 text-sm font-medium text-[var(--color-navy)]">
                Career / trade potentials
              </p>
              <div className="flex flex-wrap gap-2">
                {careerTradeOptions.map((option) => (
                  <Chip
                    key={option}
                    selected={answers.careerTradePotentials.includes(option)}
                    onClick={() =>
                      setField(
                        "careerTradePotentials",
                        toggleValue(answers.careerTradePotentials, option),
                      )
                    }
                  >
                    {option}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-[var(--color-navy)]">Personality traits</p>
              <div className="flex flex-wrap gap-2">
                {personalityTraitOptions.map((option) => (
                  <Chip
                    key={option}
                    selected={answers.personalityTraits.includes(option)}
                    onClick={() =>
                      setField("personalityTraits", toggleValue(answers.personalityTraits, option))
                    }
                  >
                    {option}
                  </Chip>
                ))}
              </div>
            </div>
          </>
        ) : null}

        {step.id === "style" ? (
          <div className="grid gap-6">
            <div>
              <p className="mb-2 text-sm font-medium">Self-grading vs instructor grading</p>
              <div className="flex flex-wrap gap-2">
                {gradingStyleOptions.map((option) => (
                  <Chip
                    key={option.value}
                    selected={answers.gradingStyle === option.value}
                    onClick={() => setField("gradingStyle", option.value)}
                  >
                    {option.label}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Writing level</p>
              <div className="flex flex-wrap gap-2">
                {writingLevelOptions.map((option) => (
                  <Chip
                    key={option.value}
                    selected={answers.writingLevel === option.value}
                    onClick={() => setField("writingLevel", option.value)}
                  >
                    {option.label}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Computer / tech vs paper-offline</p>
              <div className="flex flex-wrap gap-2">
                {techPreferenceOptions.map((option) => (
                  <Chip
                    key={option.value}
                    selected={answers.techPreference === option.value}
                    onClick={() => setField("techPreference", option.value)}
                  >
                    {option.label}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">
                Multiple children / group subjects vs one-on-one
              </p>
              <div className="flex flex-wrap gap-2">
                {groupStyleOptions.map((option) => (
                  <Chip
                    key={option.value}
                    selected={answers.groupStyle === option.value}
                    onClick={() => setField("groupStyle", option.value)}
                  >
                    {option.label}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {step.id === "faith" ? (
          <div className="flex flex-wrap gap-2">
            {faithPreferenceOptions.map((option) => (
              <Chip
                key={option.value}
                selected={answers.faithPreference === option.value}
                onClick={() => setField("faithPreference", option.value)}
              >
                {option.label}
              </Chip>
            ))}
          </div>
        ) : null}

        {step.id === "goals" ? (
          <div className="grid gap-4">
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-[var(--color-navy)]">
                College / career goals
              </span>
              <textarea
                className="min-h-28 w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5"
                value={answers.collegeGoals}
                onChange={(e) => setField("collegeGoals", e.target.value)}
                placeholder="e.g. Growing a joyful reader this year; aiming for high school credits later; Christian university like Liberty; dual enrollment; nursing pathway…"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-[var(--color-navy)]">
                Anything else the Navigator should know?
              </span>
              <textarea
                className="min-h-24 w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5"
                value={answers.additionalNotes}
                onChange={(e) => setField("additionalNotes", e.target.value)}
                placeholder="Special needs, pacing, sibling sharing, sports schedule…"
              />
            </label>
          </div>
        ) : null}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-6">
        <Button
          variant="outline"
          disabled={stepIndex === 0}
          onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
        >
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          Back
        </Button>
        <div className="text-sm text-[var(--color-muted-foreground)]">
          {stepDone ? "This harbor is charted — fair winds ahead." : "Answer to raise your % complete."}
        </div>
        <Button onClick={goNext}>
          {stepIndex === surveySteps.length - 1 ? "Generate my chart" : "Continue"}
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
