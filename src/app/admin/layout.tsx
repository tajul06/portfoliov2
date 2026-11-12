import Link from "next/link";
import { redirect } from "next/navigation";

// Placeholder for auth check
async function checkAuth() {
  // In production, verify Supabase session and check email against allowlist
  // const { data: { session } } = await supabase.auth.getSession();
  // if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
  //   redirect("/login");
  // }
  return true;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Nav */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="font-heading font-bold text-xl">
                Portfolio CMS
              </Link>
              <nav className="hidden md:flex gap-6">
                <Link
                  href="/admin/profile"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Profile
                </Link>
                <Link
                  href="/admin/projects"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Projects
                </Link>
                <Link
                  href="/admin/experience"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Experience
                </Link>
                <Link
                  href="/admin/hobbies"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Hobbies
                </Link>
                <Link
                  href="/admin/anime"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Anime
                </Link>
                <Link
                  href="/admin/books"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Books
                </Link>
                <Link
                  href="/admin/cv-generator"
                  className="text-sm font-medium text-accent hover:text-accent/80"
                >
                  CV Generator
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                target="_blank"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                View Site ↗
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
