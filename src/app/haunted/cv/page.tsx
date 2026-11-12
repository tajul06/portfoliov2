import Link from "next/link";
import { prisma } from "@/lib/db";
import { generateCV } from "./actions";

export default async function CVGeneratorPage() {
  const savedCVs = await prisma.savedCV.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div className="max-w-4xl">
      <div className="mb-8 pb-4 border-b border-border">
        <h1 className="text-3xl font-heading font-bold mb-1">CV Generator</h1>
        <p className="text-muted-foreground text-sm">
          Generate tailored CVs from job descriptions. Admin only — not public.
        </p>
      </div>

      {/* Generator Form */}
      <div className="border-2 border-primary p-6 bg-card mb-8">
        <h2 className="text-xl font-heading font-bold mb-4">+ Generate New CV</h2>
        <form action={generateCV} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Job Title *</label>
              <input
                name="jobTitle"
                required
                placeholder="e.g. Senior Software Engineer"
                className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company *</label>
              <input
                name="company"
                required
                placeholder="e.g. Google"
                className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Job Description *</label>
            <textarea
              name="jdText"
              required
              rows={8}
              placeholder="Paste the full job description here..."
              className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none font-mono text-xs"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground font-medium hover:bg-primary/90 text-sm"
            >
              Generate CV
            </button>
          </div>
        </form>
      </div>

      {/* Saved CVs */}
      <h2 className="text-lg font-heading font-bold mb-3">Saved CVs ({savedCVs.length})</h2>
      {savedCVs.length === 0 ? (
        <p className="text-muted-foreground py-6 text-center border border-dashed border-border text-sm">
          No CVs generated yet.
        </p>
      ) : (
        <div className="space-y-3">
          {savedCVs.map((cv) => (
            <div key={cv.id} className="border border-border p-5 bg-card">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-heading font-bold">{cv.jobTitle}</h3>
                  <p className="text-sm text-muted-foreground">{cv.company}</p>
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  {new Date(cv.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                <a
                  href={`/haunted/cv/${cv.id}`}
                  className="px-3 py-1 text-xs border border-border hover:border-primary"
                >
                  View/Edit
                </a>
                <a
                  href={`/api/cv/${cv.id}/pdf`}
                  className="px-3 py-1 text-xs border border-border hover:border-primary"
                >
                  Download PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
