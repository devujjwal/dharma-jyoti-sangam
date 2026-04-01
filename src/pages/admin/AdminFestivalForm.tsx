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

export default function AdminFestivalForm() {
  const { id } = useParams();
  const isNew = id === "new" || !id;
  const { data: item, isLoading } = useAdminItem("festivals", isNew ? undefined : id);
  const upsert = useAdminUpsert("festivals");
  const nav = useNavigate();
  const [form, setForm] = useState<Record<string, any>>({
    slug: "", name_hi: "", name_en: "", excerpt_hi: "", excerpt_en: "",
    description_hi: "", description_en: "", significance_hi: "", significance_en: "",
    festival_date: "", end_date: "", category: "", emoji: "", color: "",
    image_url: "", status: "published", is_featured: false, sort_order: 0,
    seo_title: "", seo_description: "",
  });

  useEffect(() => { if (item) setForm({ ...form, ...item }); }, [item]);
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { id: _id, created_at, updated_at, created_by, updated_by, ...values } = form;
    upsert.mutate({ id: isNew ? undefined : id, values }, { onSuccess: () => nav("/admin/festivals") });
  };

  const qualityFields: QualityField[] = [
    { label: "Slug", filled: has(form.slug) },
    { label: "Name (EN)", filled: has(form.name_en) },
    { label: "Name (HI)", filled: has(form.name_hi), isTranslation: true },
    { label: "Description (EN)", filled: has(form.description_en) },
    { label: "Description (HI)", filled: has(form.description_hi), isTranslation: true },
    { label: "Excerpt (EN)", filled: has(form.excerpt_en) },
    { label: "Excerpt (HI)", filled: has(form.excerpt_hi), isTranslation: true },
    { label: "Date", filled: has(form.festival_date) },
    { label: "Emoji", filled: has(form.emoji) },
    { label: "Image", filled: has(form.image_url) },
    { label: "SEO Title", filled: has(form.seo_title) },
    { label: "SEO Description", filled: has(form.seo_description) },
  ];

  const aiFields = [
    { key: "name_hi", label: "Name (Hindi)" },
    { key: "description_hi", label: "Desc (Hindi)" },
    { key: "excerpt_hi", label: "Excerpt (Hindi)" },
    { key: "significance_hi", label: "Significance (Hindi)" },
    { key: "name_en", label: "Name (English)" },
    { key: "description_en", label: "Desc (English)" },
    { key: "seo_title", label: "SEO Title" },
    { key: "seo_description", label: "SEO Description" },
  ];

  if (!isNew && isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <h1 className="text-2xl font-devanagari-serif font-bold text-foreground">
          {isNew ? "New Festival" : "Edit Festival"}
        </h1>
        <div className="grid grid-cols-2 gap-4">
          <AdminSlugField slug={form.slug} titleEn={form.name_en} onChange={(v) => set("slug", v)} />
          <div><Label>Date</Label><Input type="date" value={form.festival_date} onChange={(e) => set("festival_date", e.target.value)} required /></div>
          <div><Label>Name (Hindi)</Label><Input value={form.name_hi} onChange={(e) => set("name_hi", e.target.value)} required /></div>
          <div><Label>Name (English)</Label><Input value={form.name_en} onChange={(e) => set("name_en", e.target.value)} required /></div>
          <div className="col-span-2"><Label>Excerpt (Hindi)</Label><Textarea value={form.excerpt_hi ?? ""} onChange={(e) => set("excerpt_hi", e.target.value)} /></div>
          <div className="col-span-2"><Label>Excerpt (English)</Label><Textarea value={form.excerpt_en ?? ""} onChange={(e) => set("excerpt_en", e.target.value)} /></div>
          <div className="col-span-2"><Label>Description (Hindi)</Label><Textarea rows={4} value={form.description_hi ?? ""} onChange={(e) => set("description_hi", e.target.value)} /></div>
          <div className="col-span-2"><Label>Description (English)</Label><Textarea rows={4} value={form.description_en ?? ""} onChange={(e) => set("description_en", e.target.value)} /></div>
          <div><Label>Emoji</Label><Input value={form.emoji ?? ""} onChange={(e) => set("emoji", e.target.value)} /></div>
          <div><Label>Color</Label><Input value={form.color ?? ""} onChange={(e) => set("color", e.target.value)} /></div>
          <div><Label>Category</Label><Input value={form.category ?? ""} onChange={(e) => set("category", e.target.value)} /></div>
          <div><Label>Image URL</Label><Input value={form.image_url ?? ""} onChange={(e) => set("image_url", e.target.value)} /></div>
          <div><Label>End Date</Label><Input type="date" value={form.end_date ?? ""} onChange={(e) => set("end_date", e.target.value || null)} /></div>
          <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} /></div>
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
          <Button type="button" variant="outline" onClick={() => nav("/admin/festivals")}>Cancel</Button>
        </div>
      </form>

      <aside className="space-y-4">
        <ContentQualityBar fields={qualityFields} />
        <AIEditorAssistant fields={aiFields} onApply={(k, v) => set(k, v)} />
      </aside>
    </div>
  );
}
