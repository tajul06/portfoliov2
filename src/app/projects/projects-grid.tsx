"use client";

import Link from "next/link";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { slugify, stripMarkdown } from "@/lib/constants";

interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
  repoUrl: string | null;
  link: string | null;
  imageUrl: string | null;
}

interface ProjectsGridProps {
  projects: Project[];
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-20 rounded-3xl border border-border bg-card">
        <p className="text-muted-foreground text-lg">No projects added yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {projects.map((project, index) => {
        const projectSlug = slugify(project.name);
        const projectHref = `/projects/${projectSlug}`;
        const previewText = stripMarkdown(project.description);

        return (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.08,
              ease: [0.25, 0.46, 0.45, 0.94] as any,
            }}
          >
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="group p-7 rounded-2xl border border-border/80 bg-card hover:border-accent/60 hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full"
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
                  <Link
                    href={projectHref}
                    className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors"
                  >
                    {project.name}
                  </Link>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0 mt-1" />
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3 text-sm">
                  {previewText}
                </p>
              </div>

              <div>
                {/* Tech stack pills */}
                {project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <span key={tag} className="pill text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4 border-t border-border/60">
                  <Link
                    href={projectHref}
                    className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors inline-flex items-center gap-1"
                  >
                    <span>Read Overview</span>
                    <span>→</span>
                  </Link>

                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                  )}

                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
