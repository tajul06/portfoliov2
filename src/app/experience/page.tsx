import Link from "next/link";
import { prisma } from "@/lib/db";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Reveal } from "@/components/reveal";
import {
  SITE_NAME,
  DEFAULT_EXPERIENCES,
  DEFAULT_EDUCATION,
  formatYearOnly,
  formatYearRange,
} from "@/lib/constants";
import { ArrowLeft } from "lucide-react";

export default async function ExperiencePage() {
  const profile = await prisma.profile.findFirst().catch(() => null);
  const experiences = await prisma.experience
    .findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
    })
    .catch(() => []);
  const education = await prisma.education
    .findMany({
      orderBy: { sortOrder: "asc" },
    })
    .catch(() => []);

  return (
    <main className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Navbar name={profile?.name || SITE_NAME} />

        <div className="container mx-auto px-6 py-6 max-w-5xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        <Reveal>
          <section className="container mx-auto px-6 py-12 max-w-5xl">
            <h1 className="hero-headline mb-4">Experience</h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">My professional journey and educational background.</p>
          </section>
        </Reveal>

        <section className="container mx-auto px-6 pb-16 max-w-5xl">
          {experiences.length > 0 && (
            <div className="mb-16">
              <Reveal>
                <h2 className="text-2xl font-heading font-bold uppercase tracking-tight mb-6">Work Experience</h2>
              </Reveal>
              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <Reveal key={exp.id} delay={index * 0.1}>
                    <div className="border border-border p-6 bg-card hover:border-accent/50 hover:shadow-[0_0_24px_hsl(var(--accent)/0.15)] transition-all rounded-3xl">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                        <h3 className="text-xl font-heading font-bold">{exp.role}</h3>
                        <span className="text-sm font-medium text-muted-foreground font-mono whitespace-nowrap">{exp.company}</span>
                      </div>
                      <p className="text-xs font-mono text-muted-foreground mb-3">
                        {formatYearRange(exp.startDate, exp.endDate)}
                      </p>
                      {exp.bullets.length > 0 && (
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-1">
                          {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                        </ul>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div>
              <Reveal>
                <h2 className="text-2xl font-heading font-bold uppercase tracking-tight mb-6">Education</h2>
              </Reveal>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <Reveal key={edu.id} delay={index * 0.1}>
                    <div className="border border-border p-5 bg-card hover:border-accent/50 hover:shadow-[0_0_24px_hsl(var(--accent)/0.15)] transition-all rounded-2xl">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-heading font-bold">{edu.degree}</h3>
                        <span className="text-xs font-mono text-muted-foreground">{edu.institution}</span>
                      </div>
                      <p className="text-xs font-mono text-muted-foreground">
                        {formatYearOnly(edu.endDate, "Present")}
                      </p>
                      {edu.details && <p className="text-sm text-muted-foreground mt-2">{edu.details}</p>}
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      <Footer name={profile?.name || SITE_NAME} />
    </main>
  );
}