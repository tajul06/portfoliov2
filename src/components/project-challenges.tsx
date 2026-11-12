import React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { sanitizePlaceholder } from "@/lib/constants";

interface ChallengePair {
  challenge: string;
  resolution: string;
}

interface ChallengesData {
  pairs?: ChallengePair[];
}

function parseChallenges(challenges: string | object | null | undefined): ChallengesData | null {
  if (!challenges) return null;
  if (typeof challenges === "object") {
    return challenges as ChallengesData;
  }
  const trimmed = challenges.trim();
  if (!trimmed.startsWith("{")) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

interface ProjectChallengesProps {
  challenges: string | object | null | undefined;
}

export function ProjectChallenges({ challenges }: ProjectChallengesProps) {
  const data = parseChallenges(challenges);

  const pairs = (data?.pairs || [])
    .map((pair) => ({
      challenge: sanitizePlaceholder(pair.challenge),
      resolution: sanitizePlaceholder(pair.resolution),
    }))
    .filter((pair) => pair.challenge && pair.resolution);

  if (pairs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {pairs.map((pair, index) => (
        <div key={index} className="grid gap-6 md:grid-cols-2 items-stretch relative">
          <div className="p-8 rounded-3xl border border-border bg-card space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-amber-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-semibold text-lg text-foreground">Challenge Encountered</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {pair.challenge}
              </p>
            </div>
          </div>

          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background border border-border items-center justify-center text-muted-foreground shadow-sm">
            →
          </div>

          <div className="p-8 rounded-3xl border border-border bg-card space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="font-semibold text-lg text-foreground">Resolution & Impact</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {pair.resolution}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}