"use server";

import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export async function generateCV(formData: FormData) {
  const jobTitle = formData.get("jobTitle") as string;
  const company = formData.get("company") as string;
  const jdText = formData.get("jdText") as string;

  if (!jobTitle || !company || !jdText) {
    throw new Error("All fields are required");
  }

  // Extract keywords from JD (simple implementation)
  const keywords = extractKeywords(jdText);

  // Fetch profile data
  const profile = await prisma.profile.findFirst();
  const experiences = await prisma.experience.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" },
    take: 5,
  });
  const skills = await prisma.skill.findMany({
    orderBy: { sortOrder: "asc" },
  });
  const education = await prisma.education.findMany({
    orderBy: { sortOrder: "asc" },
    take: 3,
  });
  const projects = await prisma.project.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" },
    take: 6,
  });

  // Score skills by JD relevance
  const scoredSkills = skills.map(skill => ({
    ...skill,
    relevance: keywords.some(k => skill.name.toLowerCase().includes(k) || k.includes(skill.name.toLowerCase())) ? 10 : 5,
  })).sort((a, b) => b.relevance - a.relevance);

  // Score projects by JD relevance
  const scoredProjects = projects.map(proj => ({
    ...proj,
    relevance: keywords.some(k =>
      proj.name.toLowerCase().includes(k) ||
      proj.description.toLowerCase().includes(k) ||
      proj.tags.some(t => t.toLowerCase().includes(k))
    ) ? 10 : 5,
  })).sort((a, b) => b.relevance - a.relevance);

  // Build CV JSON structure
  const cvJson = {
    profile: {
      name: profile?.name || "Md Tajul Islam",
      headline: profile?.headline || "Software Developer",
      email: profile?.email || "md.tajul2000@gmail.com",
      location: profile?.location || "Dhaka, Bangladesh",
      github: profile?.githubUrl,
      linkedin: profile?.linkedinUrl,
      phone: profile?.phone,
    },
    summary: generateSummary(profile?.bio ?? null, keywords),
    experience: experiences.map(exp => ({
      role: exp.role,
      company: exp.company,
      startDate: exp.startDate,
      endDate: exp.endDate,
      bullets: exp.bullets.slice(0, 4),
    })),
    skills: scoredSkills.slice(0, 15).map(s => s.name),
    projects: scoredProjects.slice(0, 6).map(p => ({
      name: p.name,
      description: p.description,
      tags: p.tags,
      link: p.link,
    })),
    education: education.map(edu => ({
      institution: edu.institution,
      degree: edu.degree,
      startDate: edu.startDate,
      endDate: edu.endDate,
      details: edu.details,
    })),
    keywords: keywords.slice(0, 10),
  };

  // Save to database
  const savedCV = await prisma.savedCV.create({
    data: {
      jobTitle,
      company,
      jdText,
      cvJson,
    },
  });

  redirect(`/haunted/cv/${savedCV.id}`);
}

function extractKeywords(jd: string): string[] {
  const techKeywords = [
    "python", "javascript", "typescript", "react", "node", "nextjs", "next.js",
    "flask", "django", "fastapi", "sql", "postgresql", "mongodb", "redis",
    "docker", "kubernetes", "aws", "gcp", "azure", "linux", "git",
    "machine learning", "deep learning", "ml", "ai", "nlp", "computer vision",
    "tensorflow", "pytorch", "keras", "opencv", "pandas", "numpy",
    "llm", "rag", "langchain", "openai", "anthropic", "claude",
    "rest api", "graphql", "microservices", "ci/cd",
    "agile", "scrum", "testing", "jest", "cypress",
  ];

  const jdLower = jd.toLowerCase();
  return techKeywords.filter(kw => jdLower.includes(kw));
}

function generateSummary(bio: string | null, keywords: string[]): string {
  if (!bio) {
    return "Software Developer specializing in ML/AI and web systems.";
  }

  // Simple keyword injection if not present
  const relevantKeywords = keywords.slice(0, 3);
  const baseSummary = bio.length > 200 ? bio.substring(0, 200) + "..." : bio;

  if (relevantKeywords.length > 0 && !bio.toLowerCase().includes(relevantKeywords[0])) {
    return `${baseSummary} Experienced with ${relevantKeywords.join(", ")}.`;
  }

  return baseSummary;
}
