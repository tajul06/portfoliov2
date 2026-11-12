import Link from "next/link";
import { prisma } from "@/lib/db";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Reveal } from "@/components/reveal";
import { SITE_NAME } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";

export default async function AnimePage() {
  const profile = await prisma.profile.findFirst();
  const animeList = await prisma.anime.findMany({
    orderBy: [{ status: "asc" }, { sortOrder: "asc" }],
  });

  const completed = animeList.filter((a) => a.status === "Completed");
  const watching = animeList.filter((a) => a.status === "Watching");
  const planToWatch = animeList.filter((a) => a.status === "Plan to Watch");

  const renderAnimeGrid = (list: typeof animeList) => (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {list.map((anime) => (
        <div
          key={anime.id}
          className="p-5 rounded-2xl border border-border bg-card flex flex-col justify-between hover:shadow-lg transition-all"
        >
          <div>
            {anime.coverUrl && (
              <div className="relative aspect-[2/3] mb-4 rounded-xl overflow-hidden border border-border/50">
                <img
                  src={anime.coverUrl}
                  alt={anime.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <h3 className="font-medium text-base mb-2">{anime.title}</h3>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border/40">
            <span className="pill text-xs">{anime.status}</span>
            {anime.rating && (
              <span className="text-xs text-muted-foreground">
                ★ {anime.rating}/10
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <main className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Navbar name={profile?.name || SITE_NAME} />

        <div className="container mx-auto px-6 py-6 max-w-5xl">
          <Link
            href="/beyond"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Beyond Code</span>
          </Link>
        </div>

        <Reveal>
          <section className="container mx-auto px-6 py-12 max-w-5xl">
            <h1 className="hero-headline mb-4">Anime Watchlist</h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Personal favorites, ongoing series, and recommended stories.
            </p>
          </section>
        </Reveal>

        <section className="container mx-auto px-6 pb-20 max-w-5xl space-y-16">
          {animeList.length === 0 ? (
            <Reveal>
              <div className="text-center py-20 rounded-3xl border border-border bg-card">
                <p className="text-muted-foreground text-lg">No anime listed yet.</p>
              </div>
            </Reveal>
          ) : (
            <>
              {watching.length > 0 && (
                <Reveal>
                  <div>
                    <h2 className="text-2xl font-light mb-6">Currently Watching</h2>
                    {renderAnimeGrid(watching)}
                  </div>
                </Reveal>
              )}

              {completed.length > 0 && (
                <Reveal>
                  <div>
                    <h2 className="text-2xl font-light mb-6">Completed</h2>
                    {renderAnimeGrid(completed)}
                  </div>
                </Reveal>
              )}

              {planToWatch.length > 0 && (
                <Reveal>
                  <div>
                    <h2 className="text-2xl font-light mb-6">Plan to Watch</h2>
                    {renderAnimeGrid(planToWatch)}
                  </div>
                </Reveal>
              )}
            </>
          )}
        </section>
      </div>

      <Footer name={profile?.name || SITE_NAME} />
    </main>
  );
}
