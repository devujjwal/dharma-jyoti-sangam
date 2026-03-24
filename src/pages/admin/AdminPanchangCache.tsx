import { useAdminList } from "@/hooks/use-admin-content";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { RefreshCw } from "lucide-react";

export default function AdminPanchangCache() {
  const { data, isLoading, refetch } = useAdminList("panchang_cache", "panchang_date");
  const [refreshDate, setRefreshDate] = useState(new Date().toISOString().split("T")[0]);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const { error } = await supabase.functions.invoke("panchang", {
        body: { date: refreshDate, city: "New Delhi", lat: 28.6139, lng: 77.209 },
      });
      if (error) throw error;
      toast({ title: "Panchang refreshed for " + refreshDate });
      refetch();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-devanagari-serif font-bold text-foreground">Panchang Cache</h1>
      <div className="flex gap-2 items-end">
        <div>
          <label className="text-sm text-muted-foreground">Refresh date</label>
          <Input type="date" value={refreshDate} onChange={(e) => setRefreshDate(e.target.value)} className="w-48" />
        </div>
        <Button onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <div className="border rounded-lg overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Tithi</TableHead>
                <TableHead>Nakshatra</TableHead>
                <TableHead>Sunrise</TableHead>
                <TableHead>Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell>{r.panchang_date}</TableCell>
                  <TableCell>{r.city || r.location_key}</TableCell>
                  <TableCell>{r.tithi_en}</TableCell>
                  <TableCell>{r.nakshatra_en}</TableCell>
                  <TableCell>{r.sunrise}</TableCell>
                  <TableCell>{r.source_provider}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
