"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function createProject(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const architecture = (formData.get("architecture") as string) || null;
  const link = (formData.get("link") as string) || null;
  const repoUrl = (formData.get("repoUrl") as string) || null;
  const videoUrl = (formData.get("videoUrl") as string) || null;
  const imageUrl = (formData.get("imageUrl") as string) || null;
  const tagsRaw = (formData.get("tags") as string) || "";
  const sortOrder = parseInt((formData.get("sortOrder") as string) || "0", 10);
  const visible = formData.get("visible") === "on";

  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (!name || !description) {
    throw new Error("Name and description are required");
  }

  await prisma.project.create({
    data: {
      name,
      description,
      architecture,
      link,
      repoUrl,
      videoUrl,
      imageUrl,
      tags,
      sortOrder,
      visible,
    },
  });

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/haunted");
  revalidatePath("/haunted/projects");
}

export async function updateProject(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const architecture = (formData.get("architecture") as string) || null;
  const link = (formData.get("link") as string) || null;
  const repoUrl = (formData.get("repoUrl") as string) || null;
  const videoUrl = (formData.get("videoUrl") as string) || null;
  const imageUrl = (formData.get("imageUrl") as string) || null;
  const tagsRaw = (formData.get("tags") as string) || "";
  const sortOrder = parseInt((formData.get("sortOrder") as string) || "0", 10);
  const visible = formData.get("visible") === "on";

  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  await prisma.project.update({
    where: { id },
    data: {
      name,
      description,
      architecture,
      link,
      repoUrl,
      videoUrl,
      imageUrl,
      tags,
      sortOrder,
      visible,
    },
  });

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  revalidatePath("/haunted");
  revalidatePath("/haunted/projects");
}

export async function deleteProject(id: string) {
  await prisma.project.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/haunted");
  revalidatePath("/haunted/projects");
}
