import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type TableName = "festivals" | "articles" | "temples" | "bhajans" | "vrats" | "subscription_plans" | "contact_submissions" | "vrat_occurrences" | "site_settings" | "panchang_cache";

export function useAdminList(table: TableName, orderBy = "created_at") {
  return useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order(orderBy, { ascending: false })
        .limit(500);
      if (error) throw error;
      return data as any[];
    },
    staleTime: 1000 * 60,
  });
}

export function useAdminItem(table: TableName, id: string | undefined) {
  return useQuery({
    queryKey: ["admin", table, id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase.from(table).select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data as any;
    },
    enabled: !!id,
  });
}

export function useAdminUpsert(table: TableName) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id?: string; values: Record<string, any> }) => {
      if (id) {
        const { error } = await supabase.from(table).update(values as any).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(table).insert(values as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", table] });
      qc.invalidateQueries({ queryKey: [table] });
      toast({ title: "Saved successfully" });
    },
    onError: (e: Error) => {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    },
  });
}

export function useAdminDelete(table: TableName) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", table] });
      qc.invalidateQueries({ queryKey: [table] });
      toast({ title: "Deleted" });
    },
    onError: (e: Error) => {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    },
  });
}
