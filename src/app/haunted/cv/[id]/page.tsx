import Link from "next/link";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function CVDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const cv = await prisma.savedCV.findUnique({
    where: { id: params.id },
  });

  if (!cv) {
    notFound();
  }

  const cvData = cv.cvJson as any;

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex justify-between items-center pb-4 border-b border-border">
        <div>
          <Link
            href="/haunted/cv"
            className="text-accent hover:text-accent/80 text-sm mb-1 inline-block"
          >
            ← Back to CVs
          </Link>
          <h1 className="text-3xl font-heading font-bold">{cv.jobTitle}</h1>
          <p className="text-muted-foreground text-sm">Tailored for {cv.company}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 border border-border bg-background hover:bg-muted text-sm font-medium"
          >
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* CV Preview */}
      <div className="border-2 border-border p-8 bg-card shadow-sm print:border-none print:shadow-none print:p-0">
        {/* Header */}
        <div className="border-b border-border pb-6 mb-6">
          <h2 className="text-3xl font-heading font-bold">{cvData.profile?.name}</h2>
          <p className="text-lg text-muted-foreground mb-3">{cvData.profile?.headline}</p>
          <div className="flex flex-wrap gap-4 text-xs font-mono text-muted-foreground">
            {cvData.profile?.email && <span>{cvData.profile.email}</span>}
            {cvData.profile?.location && <span>• {cvData.profile.location}</span>}
            {cvData.profile?.github && (
              <span>
                • <a href={cvData.profile.github} className="hover:underline">GitHub</a>
              </span>
            )}
            {cvData.profile?.linkedin && (
              <span>
                • <a href={cvData.profile.linkedin} className="hover:underline">LinkedIn</a>
              </span>
            )}
          </div>
        </div>

        {/* Summary */}
        {cvData.summary && (
          <div className="mb-6">
            <h3 className="text-sm font-heading font-bold uppercase tracking-wider text-accent mb-2">
              Professional Summary
            </h3>
            <p className="text-sm text-foreground/90">{cvData.summary}</p>
          </div>
        )}

        {/* Skills */}
        {cvData.skills?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-heading font-bold uppercase tracking-wider text-accent mb-2">
              Technical Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {cvData.skills.map((skill: string, i: number) => (
                <span
                  key={i}
                  className="px-2 py-0.5 border border-border bg-background text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {cvData.experience?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-heading font-bold uppercase tracking-wider text-accent mb-3">
              Work Experience
            </h3>
            <div className="space-y-4">
              {cvData.experience.map((exp: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-heading font-bold text-base">{exp.role}</h4>
                    <span className="text-xs font-mono text-muted-foreground">
                      {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : "N/A"} —{" "}
                      {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Present"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{exp.company}</p>
                  {exp.bullets?.length > 0 && (
                    <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                      {exp.bullets.map((bullet: string, j: number) => (
                        <li key={j}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {cvData.projects?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-heading font-bold uppercase tracking-wider text-accent mb-3">
              Relevant Projects
            </h3>
            <div className="space-y-3">
              {cvData.projects.map((proj: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-heading font-bold text-sm">{proj.name}</h4>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-accent hover:underline"
                      >
                        Demo ↗
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{proj.description}</p>
                  {proj.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {proj.tags.map((tag: string, j: number) => (
                        <span key={j} className="text-[10px] text-muted-foreground font-mono">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {cvData.education?.length > 0 && (
          <div>
            <h3 className="text-sm font-heading font-bold uppercase tracking-wider text-accent mb-2">
              Education
            </h3>
            <div className="space-y-2">
              {cvData.education.map((edu: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-heading font-bold text-sm">{edu.degree}</h4>
                    <span className="text-xs font-mono text-muted-foreground">
                      {edu.startDate ? new Date(edu.startDate).toLocaleDateString() : "N/A"} —{" "}
                      {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : "Present"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{edu.institution}</p>
                  {edu.details && (
                    <p className="text-xs text-muted-foreground mt-0.5">{edu.details}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
