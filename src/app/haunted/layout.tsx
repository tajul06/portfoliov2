import Link from "next/link";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import LoginForm from "./login-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { ShieldCheck, ExternalLink, LogOut } from "lucide-react";

async function checkAuth() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {}
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const allowedEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL;

  if (!user || (allowedEmail && user.email?.toLowerCase() !== allowedEmail.toLowerCase())) {
    return null;
  }

  return user;
}

export default async function HauntedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await checkAuth();

  if (!user) {
    return (
      <div className="admin-theme min-h-screen bg-background text-foreground">
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="admin-theme min-h-screen bg-background text-foreground transition-colors">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-card/90 backdrop-blur-md">
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-8 min-w-0">
              <Link
                href="/haunted"
                className="font-bold text-lg text-foreground hover:text-accent transition-colors flex items-center gap-2 flex-shrink-0"
              >
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span>Haunted CMS</span>
              </Link>

              <nav className="hidden lg:flex items-center gap-1 overflow-x-auto text-xs font-medium">
                <Link href="/haunted/profile" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">Profile</Link>
                <Link href="/haunted/projects" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">Projects</Link>
                <Link href="/haunted/experience" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">Experience</Link>
                <Link href="/haunted/skills" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">Skills</Link>
                <Link href="/haunted/hobbies" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">Hobbies</Link>
                <Link href="/haunted/anime" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">Anime</Link>
                <Link href="/haunted/books" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">Books</Link>
                <Link href="/haunted/cv" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">CV Generator</Link>
                <Link href="/haunted/photos" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">Photos</Link>
                <Link href="/haunted/notebook" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">Notebook</Link>
                <Link href="/haunted/security" className="px-3 py-1.5 rounded-lg text-accent hover:bg-accent/10 transition-colors font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>2FA Security</span>
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <ThemeToggle />
              <Link
                href="/"
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors"
              >
                <span>Live Site</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
              <form action="/api/auth/sign-out">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Secondary Mobile Nav Ribbon */}
        <div className="lg:hidden border-t border-border/60 bg-secondary/30 px-4 py-2 overflow-x-auto flex gap-1 text-xs">
          <Link href="/haunted/profile" className="px-2.5 py-1 rounded text-muted-foreground hover:text-foreground whitespace-nowrap">Profile</Link>
          <Link href="/haunted/projects" className="px-2.5 py-1 rounded text-muted-foreground hover:text-foreground whitespace-nowrap">Projects</Link>
          <Link href="/haunted/experience" className="px-2.5 py-1 rounded text-muted-foreground hover:text-foreground whitespace-nowrap">Experience</Link>
          <Link href="/haunted/skills" className="px-2.5 py-1 rounded text-muted-foreground hover:text-foreground whitespace-nowrap">Skills</Link>
          <Link href="/haunted/hobbies" className="px-2.5 py-1 rounded text-muted-foreground hover:text-foreground whitespace-nowrap">Hobbies</Link>
          <Link href="/haunted/anime" className="px-2.5 py-1 rounded text-muted-foreground hover:text-foreground whitespace-nowrap">Anime</Link>
          <Link href="/haunted/books" className="px-2.5 py-1 rounded text-muted-foreground hover:text-foreground whitespace-nowrap">Books</Link>
          <Link href="/haunted/security" className="px-2.5 py-1 rounded text-accent whitespace-nowrap">Security</Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
