"use server";

import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export async function createPhoto(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const caption = formData.get("caption") as string;

  await prisma.photoAlbum.create({
    data: { title, description, imageUrl, caption },
  });

  redirect("/haunted/photos");
}

export async function deletePhoto(id: string) {
  await prisma.photoAlbum.delete({ where: { id } });
}
