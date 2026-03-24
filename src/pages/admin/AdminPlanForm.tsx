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

export default function AdminPlanForm() {
  const { id } = useParams();
  const isNew = id === "new" || !id;
  const { data: item, isLoading } = useAdminItem("subscription_plans", isNew ? undefined : id);
  const upsert = useAdminUpsert("subscription_plans");
  const nav = useNavigate();
  const [form, setForm] = useState<Record<string, any>>({
    code: "", name: "", description: "", price_inr: 0, credit_amount: null,
    billing_type: "one_time", is_active: true, is_featured: false,
    sort_order: 0, purchase_enabled: false, badge: "",
    features_hi: [], features_en: [],
  });
  const [featHi, setFeatHi] = useState("");
  const [featEn, setFeatEn] = useState("");

  useEffect(() => {
    if (item) {
      setForm({ ...form, ...item });
      setFeatHi((item.features_hi || []).join("\n"));
      setFeatEn((item.features_en || []).join("\n"));
    }
  }, [item]);
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { id: _id, created_at, updated_at, ...values } = form;
    values.features_hi = featHi.split("\n").filter(Boolean);
    values.features_en = featEn.split("\n").filter(Boolean);
    upsert.mutate({ id: isNew ? undefined : id, values }, { onSuccess: () => nav("/admin/plans") });
  };

  if (!isNew && isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-devanagari-serif font-bold text-foreground">
        {isNew ? "New Plan" : "Edit Plan"}
      </h1>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Code</Label><Input value={form.code} onChange={(e) => set("code", e.target.value)} required /></div>
        <div><Label>Name</Label><Input value={form.name} onChange={(e) => set("name", e.target.value)} required /></div>
        <div className="col-span-2"><Label>Description</Label><Textarea value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} /></div>
        <div><Label>Price (₹)</Label><Input type="number" value={form.price_inr} onChange={(e) => set("price_inr", Number(e.target.value))} /></div>
        <div><Label>Credits</Label><Input type="number" value={form.credit_amount ?? ""} onChange={(e) => set("credit_amount", e.target.value ? Number(e.target.value) : null)} /></div>
        <div><Label>Badge</Label><Input value={form.badge ?? ""} onChange={(e) => set("badge", e.target.value)} placeholder="Popular, Best Value..." /></div>
        <div>
          <Label>Billing Type</Label>
          <Select value={form.billing_type} onValueChange={(v) => set("billing_type", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="one_time">One Time</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} /></div>
        <div className="col-span-2"><Label>Features (Hindi, one per line)</Label><Textarea rows={4} value={featHi} onChange={(e) => setFeatHi(e.target.value)} /></div>
        <div className="col-span-2"><Label>Features (English, one per line)</Label><Textarea rows={4} value={featEn} onChange={(e) => setFeatEn(e.target.value)} /></div>
        <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={(v) => set("is_active", v)} /><Label>Active</Label></div>
        <div className="flex items-center gap-2"><Switch checked={form.is_featured} onCheckedChange={(v) => set("is_featured", v)} /><Label>Featured</Label></div>
        <div className="flex items-center gap-2"><Switch checked={form.purchase_enabled} onCheckedChange={(v) => set("purchase_enabled", v)} /><Label>Purchase Enabled</Label></div>
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={upsert.isPending}>{upsert.isPending ? "Saving..." : "Save"}</Button>
        <Button type="button" variant="outline" onClick={() => nav("/admin/plans")}>Cancel</Button>
      </div>
    </form>
  );
}
