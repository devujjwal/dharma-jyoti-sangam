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

export default function AdminBhajanForm() {
  const { id } = useParams();
  const isNew = id === "new" || !id;
  const { data: item, isLoading } = useAdminItem("bhajans", isNew ? undefined : id);
  const upsert = useAdminUpsert("bhajans");
  const nav = useNavigate();
  const [form, setForm] = useState<Record<string, any>>({
    slug: "", title_hi: "", title_en: "", deity_hi: "", deity_en: "",
    short_description_hi: "", short_description_en: "", lyrics_hi: "", lyrics_en: "",
    audio_url: "", image_url: "", duration_seconds: null, duration_display: "",
    category: "", status: "published", is_featured: false, is_free: true, sort_order: 0,
    seo_title: "", seo_description: "",
  });

  useEffect(() => { if (item) setForm({ ...form, ...item }); }, [item]);
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { id: _id, created_at, updated_at, created_by, updated_by, play_count, ...values } = form;
    upsert.mutate({ id: isNew ? undefined : id, values }, { onSuccess: () => nav("/admin/bhajans") });
  };

  const qualityFields: QualityField[] = [
    { label: "Slug", filled: has(form.slug) },
    { label: "Title (EN)", filled: has(form.title_en) },
    { label: "Title (HI)", filled: has(form.title_hi), isTranslation: true },
    { label: "Lyrics (EN)", filled: has(form.lyrics_en) },
    { label: "Lyrics (HI)", filled: has(form.lyrics_hi), isTranslation: true },
    { label: "Audio URL", filled: has(form.audio_url) },
    { label: "Image", filled: has(form.image_url) },
    { label: "Deity (EN)", filled: has(form.deity_en) },
    { label: "Deity (HI)", filled: has(form.deity_hi), isTranslation: true },
  ];

  const aiFields = [
    { key: "title_hi", label: "Title (Hindi)" },
    { key: "lyrics_hi", label: "Lyrics (Hindi)" },
    { key: "short_description_hi", label: "Desc (Hindi)" },
    { key: "title_en", label: "Title (English)" },
    { key: "lyrics_en", label: "Lyrics (English)" },
    { key: "short_description_en", label: "Desc (English)" },
  ];

  if (!isNew && isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <h1 className="text-2xl font-devanagari-serif font-bold text-foreground">
          {isNew ? "New Bhajan" : "Edit Bhajan"}
        </h1>
        <div className="grid grid-cols-2 gap-4">
          <AdminSlugField slug={form.slug} titleEn={form.title_en} onChange={(v) => set("slug", v)} />
          <div><Label>Category</Label><Input value={form.category ?? ""} onChange={(e) => set("category", e.target.value)} /></div>
          <div><Label>Title (Hindi)</Label><Input value={form.title_hi} onChange={(e) => set("title_hi", e.target.value)} required /></div>
          <div><Label>Title (English)</Label><Input value={form.title_en} onChange={(e) => set("title_en", e.target.value)} required /></div>
          <div><Label>Deity (Hindi)</Label><Input value={form.deity_hi ?? ""} onChange={(e) => set("deity_hi", e.target.value)} /></div>
          <div><Label>Deity (English)</Label><Input value={form.deity_en ?? ""} onChange={(e) => set("deity_en", e.target.value)} /></div>
          <div className="col-span-2"><Label>Lyrics (Hindi)</Label><Textarea rows={5} value={form.lyrics_hi ?? ""} onChange={(e) => set("lyrics_hi", e.target.value)} /></div>
          <div className="col-span-2"><Label>Lyrics (English)</Label><Textarea rows={5} value={form.lyrics_en ?? ""} onChange={(e) => set("lyrics_en", e.target.value)} /></div>
          <div><Label>Audio URL</Label><Input value={form.audio_url ?? ""} onChange={(e) => set("audio_url", e.target.value)} /></div>
          <div><Label>Image URL</Label><Input value={form.image_url ?? ""} onChange={(e) => set("image_url", e.target.value)} /></div>
          <div><Label>Duration Display</Label><Input value={form.duration_display ?? ""} onChange={(e) => set("duration_display", e.target.value)} placeholder="4:32" /></div>
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
          <div className="flex items-center gap-2">
            <Switch checked={form.is_free} onCheckedChange={(v) => set("is_free", v)} />
            <Label>Free</Label>
          </div>
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={upsert.isPending}>{upsert.isPending ? "Saving..." : "Save"}</Button>
          <Button type="button" variant="outline" onClick={() => nav("/admin/bhajans")}>Cancel</Button>
        </div>
      </form>

      <aside className="space-y-4">
        <ContentQualityBar fields={qualityFields} />
        <AIEditorAssistant fields={aiFields} onApply={(k, v) => set(k, v)} />
      </aside>
    </div>
  );
}
