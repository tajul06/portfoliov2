"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function createAnime(formData: FormData) {
  const title = formData.get("title") as string;
  const status = (formData.get("status") as string) || "Plan to Watch";
  const ratingRaw = formData.get("rating") as string;
  const rating = ratingRaw ? parseInt(ratingRaw, 10) : null;
  const coverUrl = (formData.get("coverUrl") as string) || null;
  const sortOrder = parseInt((formData.get("sortOrder") as string) || "0", 10);

  if (!title) throw new Error("Title is required");

  await prisma.anime.create({
    data: {
      title,
      status,
      rating,
      coverUrl,
      sortOrder,
    },
  });

  revalidatePath("/anime");
  revalidatePath("/admin");
  revalidatePath("/admin/anime");
}

export async function updateAnimeStatus(id: string, status: string, rating?: number | null) {
  await prisma.anime.update({
    where: { id },
    data: {
      status,
      ...(rating !== undefined ? { rating } : {}),
    },
  });

  revalidatePath("/anime");
  revalidatePath("/admin");
  revalidatePath("/admin/anime");
}

export async function updateAnime(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const status = (formData.get("status") as string) || "Plan to Watch";
  const ratingRaw = formData.get("rating") as string;
  const rating = ratingRaw ? parseInt(ratingRaw, 10) : null;
  const coverUrl = (formData.get("coverUrl") as string) || null;
  const sortOrder = parseInt((formData.get("sortOrder") as string) || "0", 10);

  if (!title) throw new Error("Title is required");

  await prisma.anime.update({
    where: { id },
    data: {
      title,
      status,
      rating,
      coverUrl,
      sortOrder,
    },
  });

  revalidatePath("/anime");
  revalidatePath("/admin");
  revalidatePath("/admin/anime");
}

export async function deleteAnime(id: string) {
  await prisma.anime.delete({
    where: { id },
  });

  revalidatePath("/anime");
  revalidatePath("/admin");
  revalidatePath("/admin/anime");
}
