"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Github, Linkedin, Mail } from "lucide-react";
import { SITE_NAME, SITE_GITHUB, SITE_LINKEDIN, SITE_EMAIL } from "@/lib/constants";
import { ThemeToggle } from "@/components/theme-toggle";

interface NavbarProps {
  name?: string;
  hasExperience?: boolean;
}

export default function Navbar({ name = SITE_NAME, hasExperience = false }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isProjects = pathname?.startsWith("/projects");
  const isBeyond = pathname === "/beyond";
  const isExperience = pathname?.startsWith("/experience");

  const menuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as any },
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.25,
        ease: [0.25, 0.46, 0.45, 0.94] as any,
        staggerChildren: 0.06,
        delayChildren: 0.08,
      },
    },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -16 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as any },
    },
  };

  return (
    <header id="top" className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border/70 transition-colors">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between max-w-6xl">
        {/* Brand / Name */}
        <Link
          href="/"
          className="text-lg md:text-xl font-bold tracking-tight text-foreground hover:text-accent transition-colors flex items-center gap-1.5"
          onClick={() => setMobileMenuOpen(false)}
        >
          <span>{name}</span>
        </Link>

        {/* Desktop Navigation (matching the reference layout) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium" aria-label="Main Navigation">
          <Link
            href="/"
            className={`transition-colors ${
              pathname === "/"
                ? "text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Home
          </Link>
          <Link
            href="/projects"
            aria-current={isProjects ? "page" : undefined}
            className={`transition-colors ${
              isProjects
                ? "text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Projects
          </Link>
          <Link
            href="/#about"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
          {hasExperience && (
            <Link
              href="/experience"
              aria-current={isExperience ? "page" : undefined}
              className={`transition-colors ${
                isExperience
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Experience
            </Link>
          )}
          <Link
            href="/contact"
            aria-current={pathname === "/contact" ? "page" : undefined}
            className={`transition-colors ${
              pathname === "/contact"
                ? "text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Contacts
          </Link>
          <Link
            href="/beyond"
            aria-current={isBeyond ? "page" : undefined}
            className={`px-3 py-1 rounded-full border transition-colors text-xs font-medium ${
              isBeyond
                ? "border-accent text-accent bg-accent/10 font-semibold"
                : "border-border text-foreground hover:bg-secondary"
            }`}
          >
            Beyond
          </Link>

          {/* Social Icons matching reference */}
          <div className="flex items-center gap-3 pl-3 border-l border-border/80">
            {SITE_GITHUB && (
              <a
                href={SITE_GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {SITE_LINKEDIN && (
              <a
                href={SITE_LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {SITE_EMAIL && (
              <a
                href={`mailto:${SITE_EMAIL}`}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label="Send Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Controls (<768px): ThemeToggle + Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-md overflow-hidden"
          >
            <div className="px-6 py-4 space-y-3">
              <motion.div variants={menuItemVariants}>
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base text-foreground font-medium py-1"
                >
                  Home
                </Link>
              </motion.div>
              <motion.div variants={menuItemVariants}>
                <Link
                  href="/projects"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base text-muted-foreground hover:text-foreground py-1"
                >
                  Projects
                </Link>
              </motion.div>
              <motion.div variants={menuItemVariants}>
                <Link
                  href="/#about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base text-muted-foreground hover:text-foreground py-1"
                >
                  About
                </Link>
              </motion.div>
              {hasExperience && (
                <motion.div variants={menuItemVariants}>
                  <Link
                    href="/experience"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-base text-muted-foreground hover:text-foreground py-1"
                  >
                    Experience
                  </Link>
                </motion.div>
              )}
              <motion.div variants={menuItemVariants}>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base text-muted-foreground hover:text-foreground py-1"
                >
                  Contacts
                </Link>
              </motion.div>
              <motion.div variants={menuItemVariants}>
                <Link
                  href="/beyond"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-block mt-2 px-4 py-1.5 rounded-full border border-border text-sm font-medium hover:bg-secondary"
                >
                  Beyond Code →
                </Link>
              </motion.div>

              {/* Mobile Social Links */}
              <motion.div variants={menuItemVariants} className="pt-3 border-t border-border/60 flex items-center gap-4">
                {SITE_GITHUB && (
                  <a href={SITE_GITHUB} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {SITE_LINKEDIN && (
                  <a href={SITE_LINKEDIN} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {SITE_EMAIL && (
                  <a href={`mailto:${SITE_EMAIL}`} className="text-muted-foreground hover:text-foreground">
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
