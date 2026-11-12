import { prisma } from "@/lib/db";
import { ExperienceManagerClient } from "./experience-client";

export default async function AdminExperiencePage() {
  const [experiences, educations] = await Promise.all([
    prisma.experience.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []),
    prisma.education.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []),
  ]);

  return (
    <ExperienceManagerClient
      initialExperiences={experiences}
      initialEducations={educations}
    />
  );
}
