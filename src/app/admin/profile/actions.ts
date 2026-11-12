"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function updateProfile(formData: FormData) {
  const name = formData.get("name") as string;
  const headline = formData.get("headline") as string;
  const bio = formData.get("bio") as string;
  const email = formData.get("email") as string;
  const githubUrl = (formData.get("githubUrl") as string) || null;
  const linkedinUrl = (formData.get("linkedinUrl") as string) || null;
  const location = (formData.get("location") as string) || null;
  const phone = (formData.get("phone") as string) || null;

  const existingProfile = await prisma.profile.findFirst();

  if (existingProfile) {
    await prisma.profile.update({
      where: { id: existingProfile.id },
      data: {
        name,
        headline,
        bio,
        email,
        githubUrl,
        linkedinUrl,
        location,
        phone,
      },
    });
  } else {
    await prisma.profile.create({
      data: {
        name,
        headline,
        bio,
        email,
        githubUrl,
        linkedinUrl,
        location,
        phone,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/profile");
}
