import Link from "next/link";
import { prisma } from "@/lib/db";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Reveal } from "@/components/reveal";
import { SITE_NAME } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";

export default async function NotebookPage() {
  const profile = await prisma.profile.findFirst().catch(() => null);
  const articles = await prisma.article
    .findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
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

        <Reveal>
          <section className="container mx-auto px-6 py-12 max-w-5xl">
            <h1 className="hero-headline mb-4">Notebook</h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Thoughts, tutorials, and writing on software engineering and machine learning.
            </p>
          </section>
        </Reveal>

        <section className="container mx-auto px-6 pb-20 max-w-5xl">
          {articles.length === 0 ? (
            <Reveal>
              <div className="text-center py-20 rounded-3xl border border-border bg-card">
                <p className="text-muted-foreground text-lg">No articles yet.</p>
              </div>
            </Reveal>
          ) : (
            <div className="space-y-8">
              {articles.map((article, index) => (
                <Reveal key={article.id} delay={index * 0.08}>
                  <article
                    className="pb-8 border-b border-border"
                  >
                    <Link href={`/notebook/${article.slug}`} className="group block">
                      <h2 className="text-2xl font-medium mb-2 group-hover:text-accent transition-colors">
                        {article.title}
                      </h2>
                    </Link>
                    <p className="text-xs text-muted-foreground mb-3">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </p>
                    {article.excerpt && (
                      <p className="text-muted-foreground leading-relaxed">
                        {article.excerpt}
                      </p>
                    )}
                    <Link
                      href={`/notebook/${article.slug}`}
                      className="text-sm text-accent hover:underline mt-2 inline-block"
                    >
                      Read more →
                    </Link>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer name={profile?.name || SITE_NAME} />
    </main>
  );
}