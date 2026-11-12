import { prisma } from "@/lib/db";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Reveal } from "@/components/reveal";
import { ProjectsGrid } from "./projects-grid";
import { SITE_NAME } from "@/lib/constants";

export const revalidate = 0;

export default async function ProjectsPage() {
  const profile = await prisma.profile.findFirst().catch(() => null);
  const projects = await prisma.project
    .findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
    })
    .catch(() => []);

  return (
    <main className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        {/* Navigation */}
        <Navbar name={profile?.name || SITE_NAME} />

        {/* Hero */}
        <Reveal>
          <section className="container mx-auto px-6 py-12 md:py-16 max-w-6xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent block mb-2">
              Portfolio Index
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-4">
              Projects &amp; Systems
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Applied machine learning applications, computer vision pipelines, voice AI, and distributed software systems.
            </p>
          </section>
        </Reveal>

        {/* Projects Grid */}
        <section className="container mx-auto px-6 pb-16 max-w-6xl">
          <ProjectsGrid projects={projects} />
        </section>
      </div>

      {/* Footer */}
      <Footer name={profile?.name || SITE_NAME} />
    </main>
  );
}
