import Link from "next/link";
import { prisma } from "@/lib/db";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { SITE_NAME } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";

export default async function PhotosPage() {
  const profile = await prisma.profile.findFirst().catch(() => null);
  const photos = await prisma.photoAlbum
    .findMany({
      orderBy: { sortOrder: "asc" },
    })
    .catch(() => []);

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

        <section className="container mx-auto px-6 py-12 max-w-5xl">
          <h1 className="hero-headline mb-4">Photo Album</h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Personal moments captured over time.
          </p>
        </section>

        <section className="container mx-auto px-6 pb-20 max-w-5xl">
          {photos.length === 0 ? (
            <div className="text-center py-20 rounded-3xl border border-border bg-card">
              <p className="text-muted-foreground text-lg">No photos yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-base mb-1">{photo.title}</h3>
                    {photo.caption && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{photo.caption}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer name={profile?.name || SITE_NAME} />
    </main>
  );
}