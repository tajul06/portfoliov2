import { prisma } from "@/lib/db";
import { createAnime, deleteAnime } from "./actions";

export default async function AdminAnimePage() {
  const animeList = await prisma.anime.findMany({
    orderBy: [{ status: "asc" }, { sortOrder: "asc" }],
  });

  return (
    <div className="max-w-4xl">
      <div className="mb-8 pb-4 border-b border-border">
        <h1 className="text-3xl font-heading font-bold mb-1">Anime Tracker</h1>
        <p className="text-muted-foreground text-sm">
          Track and categorize anime you are watching, completed, or plan to watch.
        </p>
      </div>

      {/* Add New Anime Form */}
      <div className="border-2 border-primary p-6 bg-card mb-8">
        <h2 className="text-lg font-heading font-bold mb-4">+ Add Anime</h2>
        <form action={createAnime} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Anime Title *</label>
              <input
                name="title"
                required
                placeholder="e.g. Frieren: Beyond Journey's End"
                className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                defaultValue="Completed"
                className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
              >
                <option value="Watching">Watching</option>
                <option value="Completed">Completed</option>
                <option value="Plan to Watch">Plan to Watch</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium mb-1">Rating (1-10)</label>
              <input
                name="rating"
                type="number"
                min="1"
                max="10"
                placeholder="e.g. 9"
                className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Cover Image URL (optional)</label>
              <input
                name="coverUrl"
                type="url"
                placeholder="https://..."
                className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground font-medium hover:bg-primary/90 text-sm"
            >
              Add Anime
            </button>
          </div>
        </form>
      </div>

      {/* Anime List grouped by status */}
      <div className="space-y-6">
        <h2 className="text-lg font-heading font-bold">Current Anime ({animeList.length})</h2>

        {animeList.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center border border-dashed border-border">
            No anime in your list yet.
          </p>
        ) : (
          <div className="border border-border divide-y divide-border bg-card">
            {animeList.map((anime) => (
              <div
                key={anime.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  {anime.coverUrl ? (
                    <img
                      src={anime.coverUrl}
                      alt={anime.title}
                      className="w-12 h-16 object-cover border border-border"
                    />
                  ) : (
                    <div className="w-12 h-16 bg-muted flex items-center justify-center text-xs font-mono text-muted-foreground border border-border">
                      No Pic
                    </div>
                  )}
                  <div>
                    <h3 className="font-heading font-bold">{anime.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono px-2 py-0.5 bg-muted text-muted-foreground">
                        {anime.status}
                      </span>
                      {anime.rating && (
                        <span className="text-xs text-accent font-semibold">
                          ★ {anime.rating}/10
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <form
                  action={async () => {
                    "use server";
                    await deleteAnime(anime.id);
                  }}
                >
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs border border-red-500/40 text-red-600 hover:bg-red-500/10 self-end sm:self-center"
                  >
                    Delete
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
