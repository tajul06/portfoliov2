import { prisma } from "@/lib/db";
import { AnimeClient } from "./anime-client";

export default async function AdminAnimePage() {
  const animeList = await prisma.anime.findMany({
    orderBy: [{ status: "asc" }, { sortOrder: "asc" }],
  });

  const initialAnime = animeList.map((a) => ({
    id: a.id,
    title: a.title,
    status: a.status,
    rating: a.rating,
    coverUrl: a.coverUrl,
    sortOrder: a.sortOrder,
  }));

  return <AnimeClient initialAnime={initialAnime} />;
}
