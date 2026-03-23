import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useIsAdmin() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["is-admin", user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .in("role", ["super_admin", "editor"]);
      if (error) return false;
      return (data?.length ?? 0) > 0;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAdminRole() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["admin-role", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) return null;
      return data?.role ?? null;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });
}
