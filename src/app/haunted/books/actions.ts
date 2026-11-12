"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function createBook(formData: FormData) {
  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const status = (formData.get("status") as string) || "Want to Read";
  const ratingRaw = formData.get("rating") as string;
  const rating = ratingRaw ? parseInt(ratingRaw, 10) : null;
  const coverUrl = (formData.get("coverUrl") as string) || null;
  const sortOrder = parseInt((formData.get("sortOrder") as string) || "0", 10);

  if (!title || !author) throw new Error("Title and Author are required");

  await prisma.book.create({
    data: {
      title,
      author,
      status,
      rating,
      coverUrl,
      sortOrder,
    },
  });

  revalidatePath("/books");
  revalidatePath("/admin");
  revalidatePath("/admin/books");
}

export async function updateBook(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const status = (formData.get("status") as string) || "Want to Read";
  const ratingRaw = formData.get("rating") as string;
  const rating = ratingRaw ? parseInt(ratingRaw, 10) : null;
  const coverUrl = (formData.get("coverUrl") as string) || null;
  const sortOrder = parseInt((formData.get("sortOrder") as string) || "0", 10);

  if (!title || !author) throw new Error("Title and Author are required");

  await prisma.book.update({
    where: { id },
    data: {
      title,
      author,
      status,
      rating,
      coverUrl,
      sortOrder,
    },
  });

  revalidatePath("/books");
  revalidatePath("/admin");
  revalidatePath("/admin/books");
}

export async function deleteBook(id: string) {
  await prisma.book.delete({
    where: { id },
  });

  revalidatePath("/books");
  revalidatePath("/admin");
  revalidatePath("/admin/books");
}
