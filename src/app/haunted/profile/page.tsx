import { prisma } from "@/lib/db";
import { ProfileForm } from "./profile-form";

export default async function AdminProfilePage() {
  const profile = await prisma.profile.findFirst();

  return <ProfileForm profile={profile} />;
}