import { prisma } from "@/lib/db";
import { NotebookClient } from "./notebook-client";

export default async function AdminNotebookPage() {
  const articles = await prisma.article
    .findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    })
    .catch(() => []);

  const initialArticles = articles.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    content: a.content,
    published: a.published,
    sortOrder: a.sortOrder,
    createdAt: a.createdAt.toISOString(),
  }));

  return <NotebookClient initialArticles={initialArticles} />;
}