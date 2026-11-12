import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { VideoPlayer } from "@/components/video-player";
import { ArchitectureFlow } from "@/components/architecture-flow";
import { ProjectOverview } from "@/components/project-overview";
import { ProjectChallenges } from "@/components/project-challenges";
import { Reveal } from "@/components/reveal";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { slugify, SITE_NAME } from "@/lib/constants";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const profile = await prisma.profile.findFirst();

  // Try to find project by slug (slugified name), fallback to UUID lookup
  let project = await prisma.project.findFirst({
    where: {
      OR: [
        { name: { equals: params.slug, mode: 'insensitive' } },
        { id: params.slug } // fallback to UUID for backward compatibility
      ]
    },
  });

  // If not found by slug, try exact name match
  if (!project) {
    // Convert slug back to name-like for searching
    const allProjects = await prisma.project.findMany({
      where: { visible: true },
      select: { id: true, name: true }
    });

    const matched = allProjects.find(p => slugify(p.name) === params.slug);
    if (matched) {
      project = await prisma.project.findUnique({
        where: { id: matched.id },
      });
    }
  }

  if (!project || !project.visible) {
    notFound();
  }

  // Live URL: overview.liveUrl takes precedence, project.link as fallback
  let liveUrl = project.link;
  if (project.overview) {
    try {
      const parsed = JSON.parse(project.overview);
      if (parsed && typeof parsed.liveUrl === "string") liveUrl = parsed.liveUrl;
    } catch {
      // not structured JSON — keep project.link
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Navbar name={profile?.name || SITE_NAME} />

        {/* Breadcrumb */}
        <div className="container mx-auto px-6 py-4 max-w-4xl">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </Link>
        </div>

        {/* Hero */}
        <Reveal>
          <section className="container mx-auto px-6 py-8 md:py-12 max-w-4xl">
            <h1 className="hero-headline mb-4">{project.name}</h1>
            {project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map((tag) => (
                  <span key={tag} className="pill text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <span>Live Demo</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  <span>Source Code</span>
                </a>
              )}
            </div>
          </section>
        </Reveal>

        {/* Main Content */}
        <section className="container mx-auto px-6 pb-16 max-w-4xl space-y-12">
          {/* Project Video / Image */}
          {project.videoUrl && (
            <Reveal>
              <div className="rounded-3xl overflow-hidden border border-border bg-card p-4">
                <h2 className="text-xl font-medium mb-3 px-2">Project Demo</h2>
                <VideoPlayer url={project.videoUrl} title={`${project.name} Demo`} />
              </div>
            </Reveal>
          )}

          {project.imageUrl && (
            <Reveal>
              <div className="rounded-3xl overflow-hidden border border-border aspect-video">
                <img
                  src={project.imageUrl}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </Reveal>
          )}

          {/* Overview & Problem Statement */}
          <Reveal>
            <ProjectOverview overview={project.overview} fallbackDescription={project.description} />
          </Reveal>

          {project.architecture && (
            <Reveal>
              <ArchitectureFlow architecture={project.architecture} />
            </Reveal>
          )}

          {/* Engineering Challenges */}
          <Reveal>
            <ProjectChallenges challenges={project.challenges} />
          </Reveal>
        </section>
      </div>

      <Footer name={profile?.name || SITE_NAME} />
    </main>
  );
}