import { prisma } from "@/lib/db";
import { ProjectManager } from "./project-manager";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return <ProjectManager initialProjects={projects} />;
}
