import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Cpu } from "lucide-react";
import { sanitizePlaceholder } from "@/lib/constants";

interface ArchitectureStage {
  title: string;
  items: string[];
}

interface ArchitectureData {
  stages?: ArchitectureStage[];
  techStack?: string[];
}

function isArchitectureData(v: unknown): v is ArchitectureData {
  return (
    !!v &&
    typeof v === "object" &&
    !Array.isArray(v) &&
    Array.isArray((v as any).stages)
  );
}

function parseArchitecture(
  architecture: string | object | null | undefined
): ArchitectureData | null {
  if (!architecture) return null;
  if (typeof architecture === "object") {
    return isArchitectureData(architecture) ? (architecture as ArchitectureData) : null;
  }
  const trimmed = architecture.trim();
  if (!trimmed.startsWith("{")) return null;
  try {
    const parsed = JSON.parse(trimmed);
    return isArchitectureData(parsed) ? (parsed as ArchitectureData) : null;
  } catch {
    return null;
  }
}

interface ArchitectureFlowProps {
  architecture: string | object | null | undefined;
}

export function ArchitectureFlow({ architecture }: ArchitectureFlowProps) {
  const data = parseArchitecture(architecture);

  if (data) {
    const stages = data.stages!;

    return (
      <div className="p-8 rounded-3xl border border-border bg-card space-y-6">
        <div className="flex items-center gap-3">
          <Cpu className="w-6 h-6 text-foreground" />
          <h2 className="text-2xl font-light">Architecture & Technical Approach</h2>
        </div>

        {/* Stages: stacked on mobile, horizontal row with arrows on desktop */}
        <div className="flex flex-col md:flex-row items-stretch gap-4">
          {stages.map((stage, i) => (
            <React.Fragment key={i}>
              <div className="flex-1 min-w-[180px] rounded-2xl border border-border bg-card p-5 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">
                  {stage.title}
                </h3>
                <ul className="space-y-1.5">
                  {stage.items.map((item, j) => (
                    <li
                      key={j}
                      className="text-sm text-muted-foreground leading-relaxed flex gap-2"
                    >
                      <span className="text-muted-foreground/60 mt-1.5 flex-shrink-0">
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {i < stages.length - 1 && (
                <div className="flex items-center justify-center text-muted-foreground flex-shrink-0 w-6">
                  <span className="hidden md:block">→</span>
                  <span className="block md:hidden">↓</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {data.techStack && data.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {data.techStack.map((tag) => (
              <span key={tag} className="pill text-sm">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Fallback: old markdown string rendered with GFM
  const markdown =
    typeof architecture === "string" ? architecture : "";
  if (!markdown) return null;

  const safeMarkdown = sanitizePlaceholder(markdown);
  if (!safeMarkdown) return null;

  return (
    <div className="p-8 rounded-3xl border border-border bg-card space-y-4">
      <div className="flex items-center gap-3">
        <Cpu className="w-6 h-6 text-foreground" />
        <h2 className="text-2xl font-light">Architecture & Technical Approach</h2>
      </div>
      <div className="text-muted-foreground leading-relaxed text-sm">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {safeMarkdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}