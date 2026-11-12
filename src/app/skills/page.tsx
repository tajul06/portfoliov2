import Link from "next/link";
import { prisma } from "@/lib/db";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Reveal } from "@/components/reveal";
import { SITE_NAME } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";

export default async function SkillsPage() {
  const profile = await prisma.profile.findFirst();
  const skills = await prisma.skill.findMany({
    orderBy: [{ group: "asc" }, { sortOrder: "asc" }],
  });

  const grouped: Record<string, typeof skills> = {};
  skills.forEach((s) => {
    if (!grouped[s.group]) grouped[s.group] = [];
    grouped[s.group].push(s);
  });

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
            <h1 className="hero-headline mb-4">Skills & Technologies</h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Technologies, frameworks, and domains I specialize in for machine learning and web systems.
            </p>
          </section>
        </Reveal>

        <section className="container mx-auto px-6 pb-20 max-w-5xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(grouped).map(([group, groupSkills], index) => (
              <Reveal key={group} delay={index * 0.08}>
                <div className="p-6 rounded-3xl border border-border bg-card space-y-4 hover:border-accent/50 hover:shadow-[0_0_24px_hsl(var(--accent)/0.15)] transition-all">
                  <h2 className="text-lg font-heading font-bold uppercase tracking-tight text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    <span>{group}</span>
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {groupSkills.map((skill) => (
                      <span key={skill.id} className="pill text-xs">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </div>

      <Footer name={profile?.name || SITE_NAME} />
    </main>
  );
}
