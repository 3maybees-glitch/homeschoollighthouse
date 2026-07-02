const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export function getMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function formatMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  if (!year || !month) return monthKey;
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

export function defaultHuddleTitle(monthKey: string) {
  return `Harbor Huddle — ${formatMonthLabel(monthKey)}`;
}

export function defaultHuddlePrompt(monthKey: string) {
  const label = formatMonthLabel(monthKey);
  return `Welcome aboard the ${label} Harbor Huddle — our monthly gathering for Lighthouse Premium families.

This is your open deck to swap curriculum wins, ask planning questions, share what is working in your homeschool harbor, and encourage other parents navigating the same waters.

To kick us off: What is one resource, routine, or mindset shift that made your homeschool smoother this month? Drop your reply below and help light the way for the fleet.`;
}
