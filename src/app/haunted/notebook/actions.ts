"use server";

import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export async function createArticle(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;

  await prisma.article.create({
    data: { title, slug, excerpt, content },
  });

  redirect("/haunted/notebook");
}

export async function deleteArticle(id: string) {
  await prisma.article.delete({ where: { id } });
}

export async function togglePublish(id: string, published: boolean) {
  await prisma.article.update({ where: { id }, data: { published } });
}