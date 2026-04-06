import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface Reminder {
  id: string;
  user_id: string;
  content_type: "festival" | "vrat";
  content_id: string;
  remind_date: string;
  remind_time: string;
  status: string;
  created_at: string;
}

export function useReminders() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["reminders", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("status", "pending")
        .order("remind_date", { ascending: true });
      if (error) throw error;
      return data as Reminder[];
    },
  });
}

export function useSetReminder() {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: {
      content_type: "festival" | "vrat";
      content_id: string;
      remind_date: string;
    }) => {
      if (!user) throw new Error("Login required");
      const { error } = await supabase.from("reminders").insert({
        user_id: user.id,
        content_type: input.content_type,
        content_id: input.content_id,
        remind_date: input.remind_date,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reminders"] });
      toast({ title: "Reminder set! 🔔" });
    },
    onError: (e: any) => {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    },
  });
}

export function useCancelReminder() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("reminders")
        .update({ status: "cancelled" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reminders"] });
      toast({ title: "Reminder cancelled" });
    },
  });
}
