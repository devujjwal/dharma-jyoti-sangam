import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import { useAdminList, useAdminDelete } from "@/hooks/use-admin-content";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function AdminTemplesList() {
  const { data, isLoading } = useAdminList("temples");
  const del = useAdminDelete("temples");
  const nav = useNavigate();

  const columns: Column<any>[] = [
    { key: "emoji", label: "🛕", render: (r) => r.emoji || "🛕" },
    { key: "name_en", label: "Name" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "status", label: "Status", render: (r) => <Badge variant={r.status === "published" ? "default" : "secondary"}>{r.status}</Badge> },
  ];

  return (
    <AdminDataTable
      title="Temples"
      columns={columns}
      data={data}
      isLoading={isLoading}
      createUrl="/admin/temples/new"
      searchField="name_en"
      getId={(r) => r.id}
      onEdit={(r) => nav(`/admin/temples/${r.id}`)}
      onDelete={(r) => { if (confirm("Delete this temple?")) del.mutate(r.id); }}
    />
  );
}
