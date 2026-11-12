import { prisma } from "@/lib/db";
import { BooksClient } from "./books-client";

export default async function AdminBooksPage() {
  const books = await prisma.book.findMany({
    orderBy: [{ status: "asc" }, { sortOrder: "asc" }],
  });

  const initialBooks = books.map((b) => ({
    id: b.id,
    title: b.title,
    author: b.author,
    status: b.status,
    rating: b.rating,
    coverUrl: b.coverUrl,
    sortOrder: b.sortOrder,
  }));

  return <BooksClient initialBooks={initialBooks} />;
}