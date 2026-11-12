"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function createExperience(formData: FormData) {
  const role = formData.get("role") as string;
  const company = formData.get("company") as string;
  const startDateRaw = formData.get("startDate") as string;
  const startDate = startDateRaw ? new Date(startDateRaw) : null;
  const endDateRaw = formData.get("endDate") as string;
  const endDate = endDateRaw ? new Date(endDateRaw) : null;
  const bulletsRaw = (formData.get("bullets") as string) || "";
  const sortOrder = parseInt((formData.get("sortOrder") as string) || "0", 10);
  const visible = formData.get("visible") === "on";

  const bullets = bulletsRaw
    .split("\n")
    .map((b) => b.trim())
    .filter(Boolean);

  if (!role || !company) throw new Error("Role and company are required");

  await prisma.experience.create({
    data: {
      role,
      company,
      startDate,
      endDate,
      bullets,
      sortOrder,
      visible,
    },
  });

  revalidatePath("/");
  revalidatePath("/experience");
  revalidatePath("/haunted/experience");
}

export async function updateExperience(id: string, formData: FormData) {
  const role = formData.get("role") as string;
  const company = formData.get("company") as string;
  const startDateRaw = formData.get("startDate") as string;
  const startDate = startDateRaw ? new Date(startDateRaw) : null;
  const endDateRaw = formData.get("endDate") as string;
  const endDate = endDateRaw ? new Date(endDateRaw) : null;
  const bulletsRaw = (formData.get("bullets") as string) || "";
  const sortOrder = parseInt((formData.get("sortOrder") as string) || "0", 10);
  const visible = formData.get("visible") === "on";

  const bullets = bulletsRaw
    .split("\n")
    .map((b) => b.trim())
    .filter(Boolean);

  if (!role || !company) throw new Error("Role and company are required");

  await prisma.experience.update({
    where: { id },
    data: {
      role,
      company,
      startDate,
      endDate,
      bullets,
      sortOrder,
      visible,
    },
  });

  revalidatePath("/");
  revalidatePath("/experience");
  revalidatePath("/haunted/experience");
}

export async function deleteExperience(id: string) {
  await prisma.experience.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/experience");
  revalidatePath("/haunted/experience");
}

export async function createEducation(formData: FormData) {
  const institution = formData.get("institution") as string;
  const degree = formData.get("degree") as string;
  const startDateRaw = formData.get("startDate") as string;
  const startDate = startDateRaw ? new Date(startDateRaw) : null;
  const endDateRaw = formData.get("endDate") as string;
  const endDate = endDateRaw ? new Date(endDateRaw) : null;
  const details = (formData.get("details") as string) || null;
  const sortOrder = parseInt((formData.get("sortOrder") as string) || "0", 10);

  if (!institution || !degree) throw new Error("Institution and degree are required");

  await prisma.education.create({
    data: {
      institution,
      degree,
      startDate,
      endDate,
      details,
      sortOrder,
    },
  });

  revalidatePath("/");
  revalidatePath("/experience");
  revalidatePath("/haunted/experience");
}

export async function updateEducation(id: string, formData: FormData) {
  const institution = formData.get("institution") as string;
  const degree = formData.get("degree") as string;
  const startDateRaw = formData.get("startDate") as string;
  const startDate = startDateRaw ? new Date(startDateRaw) : null;
  const endDateRaw = formData.get("endDate") as string;
  const endDate = endDateRaw ? new Date(endDateRaw) : null;
  const details = (formData.get("details") as string) || null;
  const sortOrder = parseInt((formData.get("sortOrder") as string) || "0", 10);

  if (!institution || !degree) throw new Error("Institution and degree are required");

  await prisma.education.update({
    where: { id },
    data: {
      institution,
      degree,
      startDate,
      endDate,
      details,
      sortOrder,
    },
  });

  revalidatePath("/");
  revalidatePath("/experience");
  revalidatePath("/haunted/experience");
}

export async function deleteEducation(id: string) {
  await prisma.education.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/experience");
  revalidatePath("/haunted/experience");
}