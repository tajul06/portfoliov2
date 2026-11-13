import Link from "next/link";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Reveal } from "@/components/reveal";
import { SITE_NAME } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const profile = await prisma.profile.findFirst().catch(() => null);
  const article = await prisma.article
    .findUnique({
      where: { slug: params.slug },
    })
    .catch(() => null);

  if (!article || !article.published) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Navbar name={profile?.name || SITE_NAME} />

        <div className="container mx-auto px-6 py-6 max-w-4xl">
          <Link
            href="/notebook"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Notebook</span>
          </Link>
        </div>

        <Reveal>
          <section className="container mx-auto px-6 py-8 max-w-4xl">
            <h1 className="hero-headline mb-4">{article.title}</h1>
            <p className="text-sm text-muted-foreground font-mono">
              {new Date(article.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </section>
        </Reveal>

        <Reveal delay={0.1}>
          <article className="container mx-auto px-6 pb-20 max-w-4xl">
            <div className="prose prose-invert prose-lg max-w-none">
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>
          </article>
        </Reveal>
      </div>

      <Footer name={profile?.name || SITE_NAME} />
    </main>
  );
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const articles = await prisma.article
    .findMany({ where: { published: true }, select: { slug: true } })
    .catch(() => []);
  return articles.map((a) => ({ slug: a.slug }));
}
