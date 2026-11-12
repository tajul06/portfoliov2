import Link from "next/link";
import { prisma } from "@/lib/db";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Reveal } from "@/components/reveal";
import { SITE_NAME } from "@/lib/constants";
import { ArrowLeft, Github, Linkedin, Mail, MapPin, MessageCircle, Facebook } from "lucide-react";

export default async function ContactPage() {
  const profile = await prisma.profile.findFirst().catch(() => null);

  return (
    <main className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Navbar name={profile?.name || SITE_NAME} />

        <div className="container mx-auto px-6 py-6 max-w-5xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Hero */}
        <Reveal>
          <section className="container mx-auto px-6 py-12 max-w-5xl">
            <h1 className="hero-headline mb-4">Contact</h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Open to collaborations, machine learning projects, and engineering opportunities.
            </p>
          </section>
        </Reveal>

        {/* Contact Details */}
        <Reveal delay={0.1}>
          <section className="container mx-auto px-6 pb-20 max-w-5xl">
            <div className="p-8 md:p-12 rounded-3xl border border-border bg-card hover:border-accent/40 transition-colors max-w-2xl space-y-8">
              <h2 className="text-2xl font-heading font-bold uppercase tracking-tight">Get in Touch</h2>

              <div className="space-y-6 text-base">
                {profile?.email && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center text-foreground flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block uppercase tracking-wider">Email</span>
                      <a
                        href={`mailto:${profile.email}`}
                        className="text-foreground hover:text-accent font-medium transition-colors"
                      >
                        {profile.email}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center text-foreground flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block uppercase tracking-wider">Location</span>
                    <span className="text-foreground font-medium">
                      {profile?.location || "Dhaka, Bangladesh"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
                {profile?.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                )}
                {profile?.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary inline-flex items-center gap-2"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {profile?.discordUrl && (
                  <a
                    href={profile.discordUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary inline-flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Discord</span>
                  </a>
                )}
                {profile?.facebookUrl && (
                  <a
                    href={profile.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary inline-flex items-center gap-2"
                  >
                    <Facebook className="w-4 h-4" />
                    <span>Facebook</span>
                  </a>
                )}
              </div>
            </div>
          </section>
        </Reveal>
      </div>

      <Footer name={profile?.name || SITE_NAME} />
    </main>
  );
}
