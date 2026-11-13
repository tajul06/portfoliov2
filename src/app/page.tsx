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

export const revalidate = 60;

export default async function Home() {
  // Fetch all home page data concurrently in a single parallel round-trip
  const [
    profile,
    projects,
    totalProjectsCount,
    allProjectsTags,
    skills,
    experiences,
    education,
  ] = await Promise.all([
    prisma.profile.findFirst().catch(() => null),
    prisma.project
      .findMany({
        where: { visible: true },
        orderBy: { sortOrder: "asc" },
        take: 4,
      })
      .catch(() => []),
    prisma.project
      .count({
        where: { visible: true },
      })
      .catch(() => 0),
    prisma.project
      .findMany({
        where: { visible: true },
        select: { tags: true },
      })
      .catch(() => []),
    prisma.skill
      .findMany({
        orderBy: { sortOrder: "asc" },
      })
      .catch(() => []),
    prisma.experience
      .findMany({
        where: { visible: true },
        orderBy: { sortOrder: "asc" },
      })
      .catch(() => []),
    prisma.education
      .findMany({
        orderBy: { sortOrder: "asc" },
      })
      .catch(() => []),
  ]);

  const techStack = Array.from(
    new Set([
      ...allProjectsTags.flatMap((p) => p.tags),
      ...projects.flatMap((p) => p.tags),
    ])
  ).slice(0, 8);

  const hasExperience = experiences.length > 0 || education.length > 0;

  return (
    <main className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Navbar name={profile?.name || SITE_NAME} hasExperience={hasExperience} />
        <HomeClient
          profile={profile}
          projects={projects}
          totalProjectsCount={Math.max(totalProjectsCount, allProjectsTags.length, projects.length)}
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