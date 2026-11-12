import Link from "next/link";
import { prisma } from "@/lib/db";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Reveal } from "@/components/reveal";
import { SITE_NAME } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";

export default async function HobbiesPage() {
  const profile = await prisma.profile.findFirst();
  const hobbies = await prisma.hobby.findMany({
    orderBy: { sortOrder: "asc" },
  });

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
            <h1 className="hero-headline mb-4">Hobbies & Interests</h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Activities and pursuits outside of programming.
            </p>
          </section>
        </Reveal>

        <section className="container mx-auto px-6 pb-20 max-w-5xl">
          {hobbies.length === 0 ? (
            <Reveal>
              <div className="text-center py-20 rounded-3xl border border-border bg-card">
                <p className="text-muted-foreground text-lg">No hobbies listed yet.</p>
              </div>
            </Reveal>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {hobbies.map((hobby, index) => (
                <Reveal key={hobby.id} delay={index * 0.08}>
                  <div className="p-6 rounded-3xl border border-border bg-card hover:shadow-lg transition-all space-y-3">
                    {hobby.icon && (
                      <div className="text-3xl">{hobby.icon}</div>
                    )}
                    <h3 className="text-lg font-medium text-foreground">
                      {hobby.name}
                    </h3>
                  </div>
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
