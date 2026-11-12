import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Reveal } from "@/components/reveal";
import { SITE_NAME } from "@/lib/constants";

export default async function BeyondCodePage() {
  const profile = await prisma.profile.findFirst().catch(() => null);
  const photos = await prisma.photoAlbum
    .findMany({
      orderBy: { sortOrder: "asc" },
      take: 12,
    })
    .catch(() => []);

  const articles = await prisma.article
    .findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
      },
    })
    .catch(() => []);

  const books = await prisma.book
    .findMany({
      orderBy: { sortOrder: "asc" },
      take: 8,
    })
    .catch(() => []);

  const anime = await prisma.anime
    .findMany({
      orderBy: { sortOrder: "asc" },
      take: 8,
    })
    .catch(() => []);

  const hobbies = await prisma.hobby
    .findMany({
      orderBy: { sortOrder: "asc" },
    })
    .catch(() => []);

  return (
    <main className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        {/* Header */}
        <Navbar name={profile?.name || SITE_NAME} />

        {/* Hero */}
        <Reveal>
          <section className="container mx-auto px-6 py-12 md:py-16 max-w-5xl">
            <h1 className="hero-headline mb-4">Beyond Code</h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              A curated collection of personal interests, creative writing, and moments outside of programming.
            </p>
          </section>
        </Reveal>

        {/* Photography */}
        {photos.length > 0 && (
          <Reveal>
            <section className="container mx-auto px-6 pb-16 max-w-5xl">
              <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase tracking-tight mb-8">Photography</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative aspect-square rounded-2xl overflow-hidden group border border-border hover:border-accent/50 transition-colors"
                  >
                    <Image
                      src={photo.imageUrl}
                      alt={photo.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* Poetry & Stories */}
        {articles.length > 0 && (
          <Reveal>
            <section className="container mx-auto px-6 pb-16 max-w-5xl">
              <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase tracking-tight mb-8">Poetry &amp; Stories</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {articles.map((article) => {
                  const preview =
                    article.excerpt ||
                    article.content.split("\n").slice(0, 3).join("\n").substring(0, 200) + "...";

                  return (
                    <Link
                      key={article.id}
                      href={`/notebook/${article.slug}`}
                      className="block p-6 rounded-2xl border border-border hover:border-accent/50 hover:shadow-[0_0_24px_hsl(var(--accent)/0.15)] transition-all group bg-card"
                    >
                      <h3 className="text-xl font-heading font-bold mb-3 group-hover:text-accent transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-sm whitespace-pre-line line-clamp-3">
                        {preview}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          </Reveal>
        )}

        {/* Books */}
        {books.length > 0 && (
          <Reveal>
            <section className="container mx-auto px-6 pb-16 max-w-5xl">
              <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase tracking-tight mb-8">Reading List</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {books.map((book) => (
                  <div
                    key={book.id}
                    className="p-5 rounded-2xl border border-border hover:border-accent/40 transition-colors bg-card flex flex-col justify-between"
                  >
                    <div>
                      {book.coverUrl && (
                        <div className="relative aspect-[2/3] mb-3 rounded-xl overflow-hidden border border-border/50">
                          <Image
                            src={book.coverUrl}
                            alt={book.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <h3 className="font-heading font-bold text-base mb-1">{book.title}</h3>
                      <p className="text-muted-foreground text-xs mb-3">{book.author}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="pill text-xs">{book.status}</span>
                      {book.rating && (
                        <span className="text-xs text-muted-foreground">
                          ★ {book.rating}/10
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* Anime */}
        {anime.length > 0 && (
          <Reveal>
            <section className="container mx-auto px-6 pb-16 max-w-5xl">
              <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase tracking-tight mb-8">Anime Watchlist</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {anime.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl border border-border hover:border-accent/40 transition-colors bg-card flex flex-col justify-between"
                  >
                    <div>
                      {item.coverUrl && (
                        <div className="relative aspect-[2/3] mb-3 rounded-xl overflow-hidden border border-border/50">
                          <Image
                            src={item.coverUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <h3 className="font-heading font-bold text-base mb-2">{item.title}</h3>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="pill text-xs">{item.status}</span>
                      {item.rating && (
                        <span className="text-xs text-muted-foreground">
                          ★ {item.rating}/10
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* Hobbies */}
        {hobbies.length > 0 && (
          <Reveal>
            <section className="container mx-auto px-6 pb-20 max-w-5xl">
              <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase tracking-tight mb-8">Hobbies &amp; Interests</h2>
              <div className="flex flex-wrap gap-3">
                {hobbies.map((hobby) => (
                  <div
                    key={hobby.id}
                    className="px-6 py-3 rounded-full border border-border hover:border-accent/50 transition-colors bg-card"
                  >
                    <span className="text-sm font-medium">{hobby.name}</span>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}
      </div>

      {/* Footer */}
      <Footer name={profile?.name || SITE_NAME} />
    </main>
  );
}
