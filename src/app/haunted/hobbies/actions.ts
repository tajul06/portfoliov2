"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function createHobby(formData: FormData) {
  const name = formData.get("name") as string;
  const icon = (formData.get("icon") as string) || "🎯";
  const sortOrder = parseInt((formData.get("sortOrder") as string) || "0", 10);

  if (!name) throw new Error("Name is required");

  await prisma.hobby.create({
    data: {
      name,
      icon,
      sortOrder,
    },
  });

  revalidatePath("/hobbies");
  revalidatePath("/haunted");
  revalidatePath("/haunted/hobbies");
}

export async function updateHobby(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const icon = (formData.get("icon") as string) || "🎯";
  const sortOrder = parseInt((formData.get("sortOrder") as string) || "0", 10);

  if (!name) throw new Error("Name is required");

  await prisma.hobby.update({
    where: { id },
    data: {
      name,
      icon,
      sortOrder,
    },
  });

  revalidatePath("/hobbies");
  revalidatePath("/haunted");
  revalidatePath("/haunted/hobbies");
}

export async function deleteHobby(id: string) {
  await prisma.hobby.delete({ where: { id } });
  revalidatePath("/hobbies");
  revalidatePath("/haunted");
  revalidatePath("/haunted/hobbies");
}
