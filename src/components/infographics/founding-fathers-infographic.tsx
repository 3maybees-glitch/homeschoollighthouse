import Link from "next/link";

const fathers = [
  {
    name: "George Washington",
    role: "First President",
    fact: "Tutored at home; never attended college.",
  },
  {
    name: "Thomas Jefferson",
    role: "Declaration Author",
    fact: "Home-tutored before William & Mary.",
  },
  {
    name: "James Madison",
    role: "Constitution Architect",
    fact: "Plantation tutoring with Donald Robertson.",
  },
  {
    name: "Patrick Henry",
    role: "Orator of Liberty",
    fact: "Educated at home by his father.",
  },
  {
    name: "John Quincy Adams",
    role: "6th President",
    fact: "Taught largely by Abigail Adams.",
  },
  {
    name: "Benjamin Franklin",
    role: "Inventor & Diplomat",
    fact: "Mostly self-taught after brief schooling.",
  },
] as const;

export function FoundingFathersInfographic() {
  return (
    <figure className="overflow-hidden rounded-[1.75rem] border border-[var(--color-navy)]/20 bg-[var(--color-navy-deep)] shadow-xl shadow-[rgba(0,31,63,0.25)]">
      <div className="px-6 pb-8 pt-8 text-center sm:px-10 sm:pt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
          Homeschool Lighthouse
        </p>
        <h2 className="font-display mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
          Founding Fathers Who Were Homeschooled
        </h2>
        <p className="mt-3 text-sm text-[var(--color-primary)] sm:text-base">
          Home education helped shape a nation.
        </p>
      </div>

      <ul className="space-y-3 px-4 pb-6 sm:px-8">
        {fathers.map((father, index) => (
          <li
            key={father.name}
            className="rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-cream)] px-4 py-4 sm:px-5"
          >
            <div className="flex items-start gap-4">
              <span
                aria-hidden
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-navy)] font-display text-sm font-semibold text-[var(--color-primary)]"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-display text-lg font-semibold text-[var(--color-navy-deep)]">
                  {father.name}
                </p>
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">
                  {father.role}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted-foreground)]">
                  {father.fact}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <figcaption className="border-t border-white/10 px-6 py-7 text-center sm:px-10">
        <p className="text-sm text-slate-300">Chart your family&apos;s course at</p>
        <Link
          href="https://homeschoollighthouse.com"
          className="mt-2 inline-block font-display text-xl font-semibold text-[var(--color-primary)] underline-offset-4 transition hover:text-[var(--color-beam)] hover:underline sm:text-2xl"
        >
          homeschoollighthouse.com
        </Link>
        <p className="mt-3 text-xs italic text-slate-400">
          Shining the light on trusted homeschool resources
        </p>
      </figcaption>
    </figure>
  );
}
