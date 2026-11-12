export const SITE_NAME = "Md Tajul Islam";
export const SITE_DESCRIPTION =
  "Software developer specializing in ML/AI, web systems, Flask apps, and RAG systems";
export const SITE_EMAIL = "md.tajul2000@gmail.com";
export const SITE_GITHUB = "https://github.com/tajul06";
export const SITE_LINKEDIN = "https://linkedin.com/in/tajul06";
export const SITE_LOCATION = "Dhaka, Bangladesh";

export interface FallbackExperience {
  id: string;
  role: string;
  company: string;
  startDate: Date | null;
  endDate: Date | null;
  bullets: string[];
  sortOrder: number;
  visible: boolean;
}

export interface FallbackEducation {
  id: string;
  institution: string;
  degree: string;
  startDate: Date | null;
  endDate: Date | null;
  details: string | null;
  sortOrder: number;
}

export interface AchievementItem {
  id: string;
  title: string;
  category: string;
  year: string;
  metric?: string;
  description: string;
  icon: "trophy" | "award" | "target" | "cpu" | "sparkles";
}

export const DEFAULT_EXPERIENCES: FallbackExperience[] = [];

export const DEFAULT_EDUCATION: FallbackEducation[] = [];

export const DEFAULT_ACHIEVEMENTS: AchievementItem[] = [];

/**
 * Converts text to a URL-friendly slug.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Strips markdown syntax (headers, bold, lists, links, backticks) for clean card previews.
 */
export function stripMarkdown(md: string): string {
  if (!md) return "";
  return md
    .replace(/^#+\s+/gm, "") // headers
    .replace(/\*\*([^*]+)\*\*/g, "$1") // bold
    .replace(/\*([^*]+)\*/g, "$1") // italics
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/```[\s\S]*?```/g, "") // code blocks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links [text](url)
    .replace(/^[-*+]\s+/gm, "") // unordered list bullets
    .replace(/^\d+\.\s+/gm, "") // numbered list items
    .replace(/https?:\/\/[^\s]+/g, "") // bare urls
    .replace(/\n+/g, " ") // newlines to single space
    .trim();
}

/**
 * Sanitizes strings that may contain placeholder markers like <REPLACE>
 * Returns a cleaned version or empty string if placeholder is detected.
 */
export function sanitizePlaceholder(text: string): string {
  if (!text) return "";
  const trimmed = text.trim();
  if (trimmed.includes("<REPLACE") || trimmed.includes("PLACEHOLDER")) {
    return "";
  }
  return trimmed;
}

/**
 * Formats a date to YYYY-MM-DD for input[type="date"].
 * Returns empty string for null.
 */
export function formatDateForInput(date: Date | string | null): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
}

/**
 * Converts a date to Year only (e.g. "2024").
 * Avoids client/server timezone hydration mismatches by extracting UTC year.
 */
export function formatYearOnly(date: Date | string | null, fallback = "Present"): string {
  if (!date) return fallback;
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return fallback;
  return String(d.getUTCFullYear());
}

/**
 * Converts a date range to Year only (e.g. "2022 — 2024" or "2024 — Present").
 */
export function formatYearRange(
  startDate: Date | string | null,
  endDate: Date | string | null
): string {
  const start = startDate ? formatYearOnly(startDate, "") : "";
  const end = endDate ? formatYearOnly(endDate, "Present") : "Present";
  if (start && end && start !== end) {
    return `${start} — ${end}`;
  }
  return end || start || "N/A";
}

/**
 * Converts a date to a human-readable string.
 */
export function formatDateReadable(date: Date | string | null, fallback = "N/A"): string {
  if (!date) return fallback;
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return fallback;
  return String(d.getUTCFullYear());
}