import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import { useAdminList, useAdminDelete } from "@/hooks/use-admin-content";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function AdminBhajansList() {
  const { data, isLoading } = useAdminList("bhajans");
  const del = useAdminDelete("bhajans");
  const nav = useNavigate();

  const columns: Column<any>[] = [
    { key: "title_en", label: "Title" },
    { key: "deity_en", label: "Deity" },
    { key: "play_count", label: "Plays" },
    { key: "status", label: "Status", render: (r) => <Badge variant={r.status === "published" ? "default" : "secondary"}>{r.status}</Badge> },
  ];

  return (
    <AdminDataTable
      title="Bhajans"
      columns={columns}
      data={data}
      isLoading={isLoading}
      createUrl="/admin/bhajans/new"
      searchField="title_en"
      getId={(r) => r.id}
      onEdit={(r) => nav(`/admin/bhajans/${r.id}`)}
      onDelete={(r) => { if (confirm("Delete this bhajan?")) del.mutate(r.id); }}
    />
  );
}
