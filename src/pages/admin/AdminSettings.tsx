import { useAdminList, useAdminUpsert } from "@/hooks/use-admin-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminSettings() {
  const { data, isLoading, refetch } = useAdminList("site_settings", "key");
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const qc = useQueryClient();

  const handleAdd = async () => {
    if (!newKey) return;
    try {
      const val = JSON.parse(newValue || '""');
      const { error } = await supabase.from("site_settings").upsert({ key: newKey, value: val });
      if (error) throw error;
      toast({ title: "Setting saved" });
      setNewKey("");
      setNewValue("");
      refetch();
      qc.invalidateQueries({ queryKey: ["site_settings"] });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Delete setting "${key}"?`)) return;
    const { error } = await supabase.from("site_settings").delete().eq("key", key);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); refetch(); }
  };

  if (isLoading) return <Skeleton className="h-48 w-full" />;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-devanagari-serif font-bold text-foreground">Site Settings</h1>
      <div className="space-y-3">
        {data?.map((s: any) => (
          <div key={s.key} className="flex items-start gap-3 p-3 border rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-foreground">{s.key}</p>
              <pre className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap">{JSON.stringify(s.value, null, 2)}</pre>
            </div>
            <Button size="sm" variant="destructive" onClick={() => handleDelete(s.key)}>Delete</Button>
          </div>
        ))}
      </div>
      <div className="border-t pt-4 space-y-3">
        <h2 className="font-semibold text-foreground">Add / Update Setting</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Key</Label><Input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="daily_quote" /></div>
          <div />
          <div className="col-span-2"><Label>Value (JSON)</Label><Textarea value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder={'"कर्म करो..."'} /></div>
        </div>
        <Button onClick={handleAdd}>Save Setting</Button>
      </div>
    </div>
  );
}
