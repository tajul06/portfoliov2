"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function createSkill(formData: FormData) {
  const name = formData.get("name") as string;
  const group = formData.get("group") as string;
  const sortOrder = parseInt((formData.get("sortOrder") as string) || "0", 10);

  if (!name || !group) throw new Error("Name and group are required");

  await prisma.skill.create({
    data: { name, group, sortOrder },
  });

  revalidatePath("/");
  revalidatePath("/skills");
  revalidatePath("/haunted/skills");
}

export async function deleteSkill(id: string) {
  await prisma.skill.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/skills");
  revalidatePath("/haunted/skills");
}