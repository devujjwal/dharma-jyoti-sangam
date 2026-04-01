import { useParams, useNavigate } from "react-router-dom";
import { useAdminItem, useAdminUpsert } from "@/hooks/use-admin-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import AdminSlugField from "@/components/admin/AdminSlugField";
import ContentQualityBar, { QualityField } from "@/components/admin/ContentQualityBar";
import AIEditorAssistant from "@/components/admin/AIEditorAssistant";

const has = (v: any) => typeof v === "string" ? v.trim().length > 0 : !!v;

export default function AdminArticleForm() {
  const { id } = useParams();
  const isNew = id === "new" || !id;
  const { data: item, isLoading } = useAdminItem("articles", isNew ? undefined : id);
  const upsert = useAdminUpsert("articles");
  const nav = useNavigate();
  const [form, setForm] = useState<Record<string, any>>({
    slug: "", title_hi: "", title_en: "", excerpt_hi: "", excerpt_en: "",
    content_hi: "", content_en: "", category: "", tags: [],
    author_name: "", featured_image_url: "", emoji: "", color: "", read_time: "",
    status: "draft", is_featured: false, seo_title: "", seo_description: "",
  });

  useEffect(() => { if (item) setForm({ ...form, ...item }); }, [item]);
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { id: _id, created_at, updated_at, created_by, updated_by, published_at, ...values } = form;
    if (values.status === "published" && !form.published_at) {
      values.published_at = new Date().toISOString();
    }
    upsert.mutate({ id: isNew ? undefined : id, values }, { onSuccess: () => nav("/admin/articles") });
  };

  const qualityFields: QualityField[] = [
    { label: "Slug", filled: has(form.slug) },
    { label: "Title (EN)", filled: has(form.title_en) },
    { label: "Title (HI)", filled: has(form.title_hi), isTranslation: true },
    { label: "Content (EN)", filled: has(form.content_en) },
    { label: "Content (HI)", filled: has(form.content_hi), isTranslation: true },
    { label: "Excerpt (EN)", filled: has(form.excerpt_en) },
    { label: "Excerpt (HI)", filled: has(form.excerpt_hi), isTranslation: true },
    { label: "Category", filled: has(form.category) },
    { label: "Image", filled: has(form.featured_image_url) },
    { label: "SEO Title", filled: has(form.seo_title) },
    { label: "SEO Description", filled: has(form.seo_description) },
  ];

  const aiFields = [
    { key: "title_hi", label: "Title (Hindi)" },
    { key: "excerpt_hi", label: "Excerpt (Hindi)" },
    { key: "content_hi", label: "Content (Hindi)" },
    { key: "title_en", label: "Title (English)" },
    { key: "excerpt_en", label: "Excerpt (English)" },
    { key: "content_en", label: "Content (English)" },
    { key: "seo_title", label: "SEO Title" },
    { key: "seo_description", label: "SEO Description" },
  ];

  if (!isNew && isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <h1 className="text-2xl font-devanagari-serif font-bold text-foreground">
          {isNew ? "New Article" : "Edit Article"}
        </h1>
        <div className="grid grid-cols-2 gap-4">
          <AdminSlugField slug={form.slug} titleEn={form.title_en} onChange={(v) => set("slug", v)} />
          <div><Label>Category</Label><Input value={form.category ?? ""} onChange={(e) => set("category", e.target.value)} /></div>
          <div><Label>Title (Hindi)</Label><Input value={form.title_hi} onChange={(e) => set("title_hi", e.target.value)} required /></div>
          <div><Label>Title (English)</Label><Input value={form.title_en} onChange={(e) => set("title_en", e.target.value)} required /></div>
          <div className="col-span-2"><Label>Excerpt (Hindi)</Label><Textarea value={form.excerpt_hi ?? ""} onChange={(e) => set("excerpt_hi", e.target.value)} /></div>
          <div className="col-span-2"><Label>Excerpt (English)</Label><Textarea value={form.excerpt_en ?? ""} onChange={(e) => set("excerpt_en", e.target.value)} /></div>
          <div className="col-span-2"><Label>Content (Hindi)</Label><Textarea rows={6} value={form.content_hi ?? ""} onChange={(e) => set("content_hi", e.target.value)} /></div>
          <div className="col-span-2"><Label>Content (English)</Label><Textarea rows={6} value={form.content_en ?? ""} onChange={(e) => set("content_en", e.target.value)} /></div>
          <div><Label>Author</Label><Input value={form.author_name ?? ""} onChange={(e) => set("author_name", e.target.value)} /></div>
          <div><Label>Read Time</Label><Input value={form.read_time ?? ""} onChange={(e) => set("read_time", e.target.value)} placeholder="5 min" /></div>
          <div><Label>Emoji</Label><Input value={form.emoji ?? ""} onChange={(e) => set("emoji", e.target.value)} /></div>
          <div><Label>Image URL</Label><Input value={form.featured_image_url ?? ""} onChange={(e) => set("featured_image_url", e.target.value)} /></div>
          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set("status", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <Switch checked={form.is_featured} onCheckedChange={(v) => set("is_featured", v)} />
            <Label>Featured</Label>
          </div>
          <div><Label>SEO Title</Label><Input value={form.seo_title ?? ""} onChange={(e) => set("seo_title", e.target.value)} /></div>
          <div><Label>SEO Description</Label><Input value={form.seo_description ?? ""} onChange={(e) => set("seo_description", e.target.value)} /></div>
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={upsert.isPending}>{upsert.isPending ? "Saving..." : "Save"}</Button>
          <Button type="button" variant="outline" onClick={() => nav("/admin/articles")}>Cancel</Button>
        </div>
      </form>

      <aside className="space-y-4">
        <ContentQualityBar fields={qualityFields} />
        <AIEditorAssistant fields={aiFields} onApply={(k, v) => set(k, v)} />
      </aside>
    </div>
  );
}
