import { prisma } from "@/lib/db";
import { HobbiesClient } from "./hobbies-client";

export default async function AdminHobbiesPage() {
  const hobbies = await prisma.hobby.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const initialHobbies = hobbies.map((h) => ({
    id: h.id,
    name: h.name,
    icon: h.icon,
    sortOrder: h.sortOrder,
  }));

  return <HobbiesClient initialHobbies={initialHobbies} />;
}
