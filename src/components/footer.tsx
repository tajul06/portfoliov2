import Link from "next/link";
import { SITE_NAME, SITE_EMAIL, SITE_GITHUB, SITE_LINKEDIN, SITE_LOCATION } from "@/lib/constants";
import { Mail, Github, Linkedin } from "lucide-react";

interface FooterProps {
  name?: string;
  hasExperience?: boolean;
}

export default function Footer({ name = SITE_NAME, hasExperience = false }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/80 bg-background/85 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-6 py-12 md:py-20 max-w-6xl">
        <div className="grid gap-10 md:grid-cols-4 md:gap-12">
          {/* Column 1: Brand + Status */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold tracking-tight text-foreground flex items-center gap-1.5">
                <span>{name}</span>
              </span>
              <span className="status-live">Open for Opportunities</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Applied ML &amp; systems builder. I turn data into real products — from local RAG pipelines to computer vision systems.
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-accent"></span>
                {SITE_LOCATION}
              </span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">Navigate</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/#about"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Projects
                </Link>
              </li>
              {hasExperience && (
                <li>
                  <Link
                    href="/experience"
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    Experience & Education
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/skills"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Skills
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Beyond Code */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">Beyond Code</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/beyond"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Beyond Code
                </Link>
              </li>
              <li>
                <Link
                  href="/notebook"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Notebook
                </Link>
              </li>
              <li>
                <Link
                  href="/hobbies"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Hobbies
                </Link>
              </li>
              <li>
                <Link
                  href="/anime"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Anime Tracker
                </Link>
              </li>
              <li>
                <Link
                  href="/photos"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Photography
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">Connect</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <div className="flex flex-col">
                  <a
                    href={`mailto:${SITE_EMAIL}`}
                    className="text-sm font-medium text-foreground hover:text-accent transition-colors"
                  >
                    Email
                  </a>
                  <span className="text-xs text-muted-foreground">{SITE_EMAIL}</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <a
                  href={SITE_GITHUB}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-3"
                >
                  <Github className="w-4 h-4 shrink-0" />
                  GitHub
                </a>
              </li>
              <li className="flex items-center gap-3">
                <a
                  href={SITE_LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-3"
                >
                  <Linkedin className="w-4 h-4 shrink-0" />
                  LinkedIn
                </a>
              </li>
              <li className="text-xs text-muted-foreground">
                Built with Next.js · TypeScript · Tailwind CSS
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {name}. All rights reserved.
          </p>
          <a
            href="#top"
            className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-2"
            aria-label="Back to top"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
