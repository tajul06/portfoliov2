"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Reveal } from "@/components/reveal";
import { slugify, stripMarkdown, formatYearOnly, formatYearRange } from "@/lib/constants";
import { Github, Linkedin, Mail, MessageCircle, Facebook, ArrowUpRight, ArrowRight } from "lucide-react";

interface Profile {
  name: string | null;
  photoUrl: string | null;
  headline: string | null;
  bio: string | null;
  email: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  discordUrl: string | null;
  facebookUrl: string | null;
  resumeUrl: string | null;
}

interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
  repoUrl: string | null;
  link: string | null;
  imageUrl?: string | null;
}

interface Experience {
  id: string;
  role: string;
  company: string;
  startDate: Date | null;
  endDate: Date | null;
  bullets: string[];
  sortOrder: number;
  visible: boolean;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: Date | null;
  endDate: Date | null;
  details: string | null;
  sortOrder: number;
}

interface AchievementItem {
  id: string;
  title: string;
  category: string;
  year: string;
  metric?: string;
  description: string;
  icon: string;
}

interface HomeClientProps {
  profile: Profile | null;
  projects: Project[];
  totalProjectsCount?: number;
  skills: { id: string; name: string }[];
  techStack: string[];
  experiences?: Experience[];
  education?: Education[];
  achievements?: AchievementItem[];
}

const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any },
  },
};

export function HomeClient({
  profile,
  projects,
  totalProjectsCount,
  skills,
  techStack,
  experiences = [],
  education = [],
  achievements = [],
}: HomeClientProps) {
  // Use "Tajul" as the friendly calling name (handling "Md. Tajul Islam")
  const displayName = (() => {
    if (!profile?.name) return "Tajul";
    const parts = profile.name.trim().split(/\s+/);
    if (parts[0].toLowerCase().replace(".", "") === "md" && parts.length > 1) {
      return parts[1]; // "Tajul"
    }
    return parts[0] || "Tajul";
  })();

  return (
    <div className="relative overflow-hidden">
      {/* ─────────────────────────────────────────────────────────────
          HERO SECTION (Emadalmagedy Reference - Clean, Bold, Atmospheric)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center py-16 md:py-24">
        {/* Smoky watercolor & ink backdrop layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="smoke-ink-backdrop w-[420px] h-[420px] md:w-[680px] md:h-[680px] -right-20 top-1/4 opacity-70" />
          <div className="smoke-cloud-layer inset-0" />
        </div>

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <motion.div
            className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center"
            initial="hidden"
            animate="visible"
            variants={heroVariants}
          >
            {/* Left Column: Greeting, Massive Headline, Bio, Underline CTA */}
            <div className="lg:col-span-7 space-y-6">
              {/* Friendly greeting line */}
              <motion.div variants={heroItemVariants}>
                <span className="text-xl sm:text-2xl font-medium text-muted-foreground block">
                  Hi , I&apos;m {displayName},
                </span>
              </motion.div>

              {/* Bold Headline matching "I'M A WEB DESIGNER" */}
              <motion.h1
                variants={heroItemVariants}
                className="hero-headline text-foreground text-left"
              >
                I&apos;M A SOFTWARE &amp; AI DEVELOPER
              </motion.h1>

              {/* Descriptive Elevator Pitch */}
              <motion.p
                variants={heroItemVariants}
                className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl font-normal"
              >
                {profile?.headline ||
                  profile?.bio ||
                  "Building machine learning systems, computer vision architectures, and robust web applications with pragmatic, production-focused engineering."}
              </motion.p>

              {/* Primary Signature Call to Action (The Underline CTA from Reference) */}
              <motion.div variants={heroItemVariants} className="pt-2 flex flex-col sm:flex-row sm:items-center gap-6">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 text-xl font-bold text-foreground hover:text-accent pb-1 border-b-2 border-foreground hover:border-accent transition-all duration-200 group self-start"
                >
                  <span>View My Projects</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </Link>

                <div className="flex items-center gap-3">
                  <Link
                    href="#about"
                    className="px-5 py-2.5 rounded-full border border-border text-sm font-medium hover:bg-secondary text-foreground transition-colors"
                  >
                    About Me
                  </Link>
                  {profile?.resumeUrl && (
                    <a
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-full border border-border text-sm font-medium hover:bg-secondary text-foreground transition-colors"
                    >
                      Resume
                    </a>
                  )}
                </div>
              </motion.div>

              {/* Tech Stack Chips */}
              <motion.div variants={heroItemVariants} className="pt-4 flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span key={tech} className="pill">
                    {tech}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right Column: Character Portrait with Smoky Aura */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
              <motion.div
                variants={heroItemVariants}
                className="relative z-10 w-full max-w-[340px] sm:max-w-[400px]"
              >
                {/* Smoky halo behind character */}
                <div className="absolute -inset-4 sm:-inset-8 rounded-full bg-accent/15 blur-3xl pointer-events-none" />

                {profile?.photoUrl ? (
                  <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-border/80 bg-card/60 backdrop-blur-md shadow-2xl">
                    <Image
                      src={profile.photoUrl}
                      alt={profile.name || "Md. Tajul Islam"}
                      fill
                      className="object-cover object-top"
                      priority
                    />
                    {/* Soft bottom gradient to blend with the canvas */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent pointer-events-none" />
                  </div>
                ) : (
                  /* Stylized developer portrait artwork with warm orange collar matching reference */
                  <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-border/80 bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-md shadow-2xl flex flex-col justify-end p-6">
                    {/* Silhouette / Avatar Illustration */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 rounded-full bg-accent/20 blur-2xl absolute" />
                      <div className="relative w-44 h-44 rounded-full border-2 border-accent/40 bg-secondary/80 flex items-center justify-center">
                        <span className="text-5xl font-black text-foreground">
                          {displayName[0]}
                        </span>
                      </div>
                    </div>

                    <div className="relative z-10 bg-background/80 backdrop-blur-md p-4 rounded-2xl border border-border/60">
                      <div className="text-sm font-bold text-foreground">{profile?.name || "Md. Tajul Islam"}</div>
                      <div className="text-xs text-accent font-medium">Machine Learning &amp; Systems</div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          PROJECTS SECTION (Clean, spacious, high-contrast cards)
      ───────────────────────────────────────────────────────────── */}
      <Reveal>
        <section id="projects" className="container mx-auto px-6 py-20 max-w-6xl border-t border-border/70">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-accent block mb-2">
                Portfolio Showcase
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
                Featured Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="text-sm font-semibold text-accent hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View All Projects ({totalProjectsCount ?? projects.length})</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1] as any,
                }}
              >
                <Link
                  href={`/projects/${slugify(project.name)}`}
                  className="group block p-7 rounded-2xl border border-border/80 bg-card hover:border-accent/60 hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between"
                >
                  <div>
                    {project.imageUrl && (
                      <div className="mb-5 rounded-xl overflow-hidden aspect-video border border-border/50">
                        <img
                          src={project.imageUrl}
                          alt={project.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-accent transition-colors">
                        {project.name}
                      </h3>
                      <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0 mt-1" />
                    </div>

                    <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed text-sm">
                      {stripMarkdown(project.description)}
                    </p>
                  </div>

                  <div>
                    {/* Tech stack pills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="pill text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Quick Links */}
                    <div className="flex gap-4 text-xs font-semibold pt-3 border-t border-border/60 text-muted-foreground">
                      {project.repoUrl && (
                        <span className="hover:text-foreground transition-colors">
                          GitHub Repo →
                        </span>
                      )}
                      {project.link && (
                        <span className="hover:text-accent transition-colors">
                          Live Demo →
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-base font-bold text-foreground hover:text-accent pb-1 border-b-2 border-foreground hover:border-accent transition-all duration-200"
            >
              <span>Explore All Shipped Work</span>
              <span>→</span>
            </Link>
          </div>
        </section>
      </Reveal>

      {/* ─────────────────────────────────────────────────────────────
          EXPERIENCE & EDUCATION (Conditional)
      ───────────────────────────────────────────────────────────── */}
      {(experiences.length > 0 || education.length > 0) && (
        <Reveal>
          <section id="experience" className="container mx-auto px-6 py-20 max-w-6xl border-t border-border/70">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-accent block mb-2">
                  Timeline
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
                  Experience &amp; Education
                </h2>
              </div>
              <Link
                href="/experience"
                className="text-sm font-semibold text-accent hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
              >
                <span>Full Timeline View</span>
                <span>→</span>
              </Link>
            </div>

            <div className="max-w-3xl mx-auto space-y-12">
              {/* Experience items */}
              {experiences.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent inline-block" />
                    Work &amp; Research Experience
                  </h3>
                  <div className="space-y-6 pl-4 border-l-2 border-border/70">
                    {[...experiences]
                      .sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0))
                      .map((exp) => (
                        <div key={exp.id} className="relative pl-6 group">
                          <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-accent ring-4 ring-background" />
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-1">
                            <h4 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                              {exp.role}
                            </h4>
                            <span className="text-xs font-mono font-medium text-muted-foreground self-start sm:self-auto">
                              {formatYearRange(exp.startDate, exp.endDate)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{exp.company}</p>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                            {exp.bullets.map((bullet) => (
                              <li key={bullet} className="leading-relaxed">{bullet}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Education items */}
              {education.length > 0 && (
                <div className="space-y-6 pt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald inline-block" />
                    Academic Background
                  </h3>
                  <div className="space-y-6 pl-4 border-l-2 border-border/70">
                    {[...education]
                      .sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0))
                      .map((edu) => (
                        <div key={edu.id} className="relative pl-6 group">
                          <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-emerald ring-4 ring-background" />
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-1">
                            <h4 className="text-lg font-bold text-foreground group-hover:text-emerald transition-colors">
                              {edu.degree}
                            </h4>
                            <span className="text-xs font-mono font-medium text-muted-foreground self-start sm:self-auto">
                              {formatYearOnly(edu.endDate, "Present")}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{edu.institution}</p>
                          {edu.details && (
                            <p className="text-sm text-muted-foreground leading-relaxed">{edu.details}</p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </Reveal>
      )}

      {/* ─────────────────────────────────────────────────────────────
          ABOUT SECTION
      ───────────────────────────────────────────────────────────── */}
      <Reveal>
        <section
          id="about"
          className="container mx-auto px-6 py-20 max-w-6xl border-t border-border/70"
        >
          <div className="grid md:grid-cols-[1fr_2fr] gap-10 items-start">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-accent block mb-2">
                Personal Bio
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
                About Me
              </h2>
            </div>
            <div className="space-y-6">
              <p className="text-lg sm:text-xl text-foreground font-medium leading-relaxed">
                Focused on applied machine learning, distributed backend architectures, and developer tooling.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {profile?.bio ||
                  "I'm a software developer specializing in ML/AI, web systems, Flask apps, and RAG systems. I focus on building pragmatic solutions that solve real problems."}
              </p>

              {/* Stats overview */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border/60">
                <div>
                  <div className="text-3xl md:text-4xl font-extrabold text-foreground">{totalProjectsCount ?? projects.length}</div>
                  <div className="text-xs text-muted-foreground mt-1">Projects Built</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-extrabold text-foreground">{skills.length}</div>
                  <div className="text-xs text-muted-foreground mt-1">Core Skills</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-extrabold text-foreground">{techStack.length}</div>
                  <div className="text-xs text-muted-foreground mt-1">Tech Stack</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ─────────────────────────────────────────────────────────────
          CONTACT SECTION
      ───────────────────────────────────────────────────────────── */}
      <Reveal>
        <section id="contact" className="container mx-auto px-6 py-20 max-w-6xl border-t border-border/70">
          <div className="p-8 md:p-12 rounded-3xl border border-border/80 bg-card relative overflow-hidden shadow-xl">
            <div className="max-w-2xl space-y-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent block">
                Let&apos;s Connect
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
                Have a Project or Idea in Mind?
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Open to collaborations, engineering roles, and innovative ML application developments. Feel free to reach out directly.
              </p>

              {profile?.email && (
                <div className="pt-2">
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-2 text-xl md:text-2xl font-bold text-foreground hover:text-accent pb-1 border-b-2 border-foreground hover:border-accent transition-colors"
                  >
                    <span>{profile.email}</span>
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              )}

              <div className="flex flex-wrap gap-4 pt-6 border-t border-border/60">
                {profile?.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="btn-accent inline-flex items-center gap-2 text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Send Message</span>
                  </a>
                )}
                {profile?.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary inline-flex items-center gap-2 text-sm"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                )}
                {profile?.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary inline-flex items-center gap-2 text-sm"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {profile?.discordUrl && (
                  <a
                    href={profile.discordUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary inline-flex items-center gap-2 text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Discord</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
