import { prisma } from "@/lib/db";
import { createArticle, deleteArticle, togglePublish } from "./actions";

export default async function AdminNotebookPage() {
  const articles = await prisma.article.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="max-w-4xl">
      <div className="mb-8 pb-4 border-b border-border">
        <h1 className="text-3xl font-heading font-bold mb-1">Notebook / Articles</h1>
        <p className="text-muted-foreground text-sm">Write and manage your articles.</p>
      </div>

      <div className="border-2 border-primary p-6 bg-card mb-8">
        <h2 className="text-lg font-heading font-bold mb-4">+ New Article</h2>
        <form action={createArticle} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Title *</label><input name="title" required placeholder="Article title" className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Slug *</label><input name="slug" required placeholder="my-article-slug" className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Excerpt</label><input name="excerpt" placeholder="Short description for listing" className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Content (Markdown supported) *</label><textarea name="content" required rows={10} placeholder="Write your article content here..." className="w-full px-3 py-2 border border-border bg-background focus:border-primary outline-none font-mono text-sm" /></div>
          <div className="flex justify-end"><button type="submit" className="px-6 py-2 bg-primary text-primary-foreground font-medium hover:bg-primary/90 text-sm">Publish Article</button></div>
        </form>
      </div>

      <h2 className="text-lg font-heading font-bold mb-3">Articles ({articles.length})</h2>
      <div className="space-y-3">
        {articles.map((article) => (
          <div key={article.id} className="border border-border p-4 bg-card flex justify-between items-start">
            <div>
              <h3 className="font-heading font-bold">{article.title}</h3>
              <p className="text-xs text-muted-foreground">/{article.slug} • {new Date(article.createdAt).toLocaleDateString()}</p>
              {article.excerpt && <p className="text-xs text-muted-foreground mt-1">{article.excerpt}</p>}
              <span className={`inline-block text-xs px-2 py-0.5 mt-2 ${article.published ? "bg-green-500/20 text-green-600" : "bg-yellow-500/20 text-yellow-600"}`}>{article.published ? "Published" : "Draft"}</span>
            </div>
            <div className="flex gap-2">
              <form action={async () => { "use server"; await togglePublish(article.id, !article.published); }}>
                <button type="submit" className="text-xs border border-border hover:border-primary px-2 py-1">{article.published ? "Unpublish" : "Publish"}</button>
              </form>
              <a href={`/notebook/${article.slug}`} target="_blank" className="text-xs border border-border hover:border-primary px-2 py-1">View</a>
              <form action={async () => { "use server"; await deleteArticle(article.id); }}><button type="submit" className="text-xs border border-red-500/40 text-red-600 hover:bg-red-500/10 px-2 py-1">Delete</button></form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}