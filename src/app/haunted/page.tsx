import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminDashboard() {
  // Get counts for dashboard overview
  const [projectsCount, experienceCount, hobbiesCount, animeCount, booksCount, cvsCount] =
    await Promise.all([
      prisma.project.count(),
      prisma.experience.count(),
      prisma.hobby.count(),
      prisma.anime.count(),
      prisma.book.count(),
      prisma.savedCV.count(),
    ]);

  const stats = [
    { label: "Projects", count: projectsCount, href: "/haunted/projects", color: "accent" },
    { label: "Experience", count: experienceCount, href: "/haunted/experience", color: "primary" },
    { label: "Hobbies", count: hobbiesCount, href: "/haunted/hobbies", color: "secondary" },
    { label: "Anime", count: animeCount, href: "/haunted/anime", color: "accent" },
    { label: "Books", count: booksCount, href: "/haunted/books", color: "primary" },
    { label: "Saved CVs", count: cvsCount, href: "/haunted/cv-generator", color: "secondary" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Manage your portfolio content</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="border-2 border-border hover:border-primary p-6 group"
          >
            <div className="text-4xl font-heading font-bold mb-2 group-hover:text-accent">
              {stat.count}
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="border-t border-border pt-8">
        <h2 className="text-xl font-heading font-bold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/haunted/projects?new=true"
            className="p-4 border border-border hover:border-primary"
          >
            <div className="font-heading font-bold mb-1">+ Add New Project</div>
            <div className="text-sm text-muted-foreground">
              Create a new project with demo video
            </div>
          </Link>
          <Link
            href="/haunted/hobbies?new=true"
            className="p-4 border border-border hover:border-primary"
          >
            <div className="font-heading font-bold mb-1">+ Add Hobby</div>
            <div className="text-sm text-muted-foreground">Add what you do for fun</div>
          </Link>
          <Link
            href="/haunted/anime?new=true"
            className="p-4 border border-border hover:border-primary"
          >
            <div className="font-heading font-bold mb-1">+ Add Anime</div>
            <div className="text-sm text-muted-foreground">
              Track anime you&apos;ve watched
            </div>
          </Link>
          <Link
            href="/haunted/books?new=true"
            className="p-4 border border-border hover:border-primary"
          >
            <div className="font-heading font-bold mb-1">+ Add Book</div>
            <div className="text-sm text-muted-foreground">
              Add to your reading list
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
