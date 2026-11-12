import { prisma } from "@/lib/db";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { HomeClient } from "./home-client";
import {
  SITE_NAME,
  DEFAULT_ACHIEVEMENTS,
  DEFAULT_EXPERIENCES,
  DEFAULT_EDUCATION,
} from "@/lib/constants";

export default async function Home() {
  const profile = await prisma.profile.findFirst().catch(() => null);
  const projects = await prisma.project
    .findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
      take: 4,
    })
    .catch(() => []);

  const skills = await prisma.skill
    .findMany({
      orderBy: { sortOrder: "asc" },
    })
    .catch(() => []);

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

  const techStack = Array.from(
    new Set(projects.flatMap((p) => p.tags))
  ).slice(0, 8);

  const hasExperience = experiences.length > 0 || education.length > 0;

  return (
    <main className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Navbar name={profile?.name || SITE_NAME} hasExperience={hasExperience} />
        <HomeClient
          profile={profile}
          projects={projects}
          skills={skills}
          techStack={techStack}
          experiences={experiences}
          education={education}
          achievements={DEFAULT_ACHIEVEMENTS}
        />
      </div>
      <Footer name={profile?.name || SITE_NAME} hasExperience={hasExperience} />
    </main>
  );
}