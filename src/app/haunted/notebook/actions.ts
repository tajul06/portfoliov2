"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export async function createArticle(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim().toLowerCase();
  const excerpt = (formData.get("excerpt") as string)?.trim() || null;
  const content = formData.get("content") as string;

  if (!title || !slug || !content) {
    throw new Error("Title, slug, and content are required");
  }

  await prisma.article.create({
    data: { title, slug, excerpt, content },
  });

  revalidatePath("/haunted/notebook");
  revalidatePath("/notebook");
  revalidatePath("/beyond");
  redirect("/haunted/notebook");
}

export async function deleteArticle(id: string) {
  try {
    const article = await prisma.article.findUnique({
      where: { id },
      select: { slug: true },
    });

    // deleteMany is idempotent - doesn't crash with P2025 if clicked twice
    await prisma.article.deleteMany({
      where: { id },
    });

    revalidatePath("/haunted/notebook");
    revalidatePath("/notebook");
    revalidatePath("/beyond");
    if (article?.slug) {
      revalidatePath(`/notebook/${article.slug}`);
    }

    return { success: true };
  } catch (err: any) {
    console.error("Failed to delete article:", err);
    throw new Error(err?.message || "Failed to delete article");
  }
}

export async function togglePublish(id: string, published: boolean) {
  try {
    const article = await prisma.article.update({
      where: { id },
      data: { published },
    });

    revalidatePath("/haunted/notebook");
    revalidatePath("/notebook");
    revalidatePath("/beyond");
    if (article?.slug) {
      revalidatePath(`/notebook/${article.slug}`);
    }

    return { success: true };
  } catch (err: any) {
    console.error("Failed to toggle publish status:", err);
    throw new Error(err?.message || "Failed to update article");
  }
}