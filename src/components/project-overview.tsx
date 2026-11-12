import React from "react";
import { CheckCircle2, ExternalLink } from "lucide-react";

interface OverviewData {
  problem?: string;
  solution?: string;
  features?: string[];
  liveUrl?: string;
}

function parseOverview(overview: string | object | null | undefined): OverviewData | null {
  if (!overview) return null;
  if (typeof overview === "object") {
    return overview as OverviewData;
  }
  const trimmed = overview.trim();
  if (!trimmed.startsWith("{")) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

interface ProjectOverviewProps {
  overview: string | object | null | undefined;
  fallbackDescription: string;
  projectLink?: string | null;
}

import { sanitizePlaceholder } from "@/lib/constants";

export function ProjectOverview({ overview, fallbackDescription }: ProjectOverviewProps) {
  const data = parseOverview(overview);

  if (data && (data.problem || data.solution || data.features)) {
    return (
      <div className="p-8 rounded-3xl border border-border bg-card space-y-6">
        <h2 className="text-2xl font-light">Overview & Problem Statement</h2>

        {data.problem && (
          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Problem
            </span>
            <p className="text-muted-foreground leading-relaxed text-base">
              {sanitizePlaceholder(data.problem)}
            </p>
          </div>
        )}

        {data.solution && (
          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Solution
            </span>
            <p className="text-muted-foreground leading-relaxed text-base">
              {sanitizePlaceholder(data.solution)}
            </p>
          </div>
        )}

        {data.features && data.features.length > 0 && (
          <div className="space-y-3 pt-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Key Features
            </span>
            <ul className="space-y-2">
              {data.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // Fallback
  return (
    <div className="p-8 rounded-3xl border border-border bg-card space-y-4">
      <h2 className="text-2xl font-light">Overview & Problem Statement</h2>
      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-lg">
        {sanitizePlaceholder(fallbackDescription)}
      </p>
    </div>
  );
}