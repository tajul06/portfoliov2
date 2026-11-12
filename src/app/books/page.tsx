import Link from "next/link";
import { prisma } from "@/lib/db";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Reveal } from "@/components/reveal";
import { SITE_NAME } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";

export default async function BooksPage() {
  const profile = await prisma.profile.findFirst().catch(() => null);
  const books = await prisma.book
    .findMany({
      orderBy: [{ status: "asc" }, { sortOrder: "asc" }],
    })
    .catch(() => []);

  const read = books.filter((b) => b.status === "Read");
  const reading = books.filter((b) => b.status === "Reading");
  const wantToRead = books.filter((b) => b.status === "Want to Read");

  const renderBookGrid = (bookList: typeof books) => (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {bookList.map((book) => (
        <div
          key={book.id}
          className="p-5 rounded-2xl border border-border bg-card flex flex-col justify-between hover:shadow-lg transition-all"
        >
          <div>
            {book.coverUrl && (
              <div className="relative aspect-[2/3] mb-4 rounded-xl overflow-hidden border border-border/50">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <h3 className="font-medium text-base mb-1">{book.title}</h3>
            <p className="text-muted-foreground text-xs mb-3">by {book.author}</p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border/40">
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
            <h1 className="hero-headline mb-4">Reading List</h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Books on software architecture, machine learning, philosophy, and creative writing.
            </p>
          </section>
        </Reveal>

        <section className="container mx-auto px-6 pb-20 max-w-5xl space-y-16">
          {books.length === 0 ? (
            <Reveal>
              <div className="text-center py-20 rounded-3xl border border-border bg-card">
                <p className="text-muted-foreground text-lg">No books listed yet.</p>
              </div>
            </Reveal>
          ) : (
            <>
              {reading.length > 0 && (
                <Reveal>
                  <div>
                    <h2 className="text-2xl font-light mb-6">Currently Reading</h2>
                    {renderBookGrid(reading)}
                  </div>
                </Reveal>
              )}

              {read.length > 0 && (
                <Reveal>
                  <div>
                    <h2 className="text-2xl font-light mb-6">Read & Recommended</h2>
                    {renderBookGrid(read)}
                  </div>
                </Reveal>
              )}

              {wantToRead.length > 0 && (
                <Reveal>
                  <div>
                    <h2 className="text-2xl font-light mb-6">Want to Read</h2>
                    {renderBookGrid(wantToRead)}
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
