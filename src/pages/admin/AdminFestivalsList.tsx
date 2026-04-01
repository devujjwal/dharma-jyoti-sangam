import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import { useAdminList, useAdminDelete } from "@/hooks/use-admin-content";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { TranslationBadge } from "@/components/admin/ContentQualityBadge";

export default function AdminFestivalsList() {
  const { data, isLoading } = useAdminList("festivals");
  const del = useAdminDelete("festivals");
  const nav = useNavigate();

  const columns: Column<any>[] = [
    { key: "emoji", label: "🎪", render: (r) => r.emoji || "🎉" },
    { key: "name_en", label: "Name" },
    { key: "festival_date", label: "Date" },
    { key: "status", label: "Status", render: (r) => <Badge variant={r.status === "published" ? "default" : "secondary"}>{r.status}</Badge> },
    { key: "is_featured", label: "Featured", render: (r) => r.is_featured ? "⭐" : "" },
    { key: "_quality", label: "Quality", render: (r) => (
      <TranslationBadge row={r} hiFields={["name_hi", "description_hi", "excerpt_hi"]} enFields={["name_en", "description_en", "excerpt_en"]} />
    )},
  ];

  return (
    <AdminDataTable
      title="Festivals"
      columns={columns}
      data={data}
      isLoading={isLoading}
      createUrl="/admin/festivals/new"
      searchField="name_en"
      getId={(r) => r.id}
      onEdit={(r) => nav(`/admin/festivals/${r.id}`)}
      onDelete={(r) => { if (confirm("Delete this festival?")) del.mutate(r.id); }}
    />
  );
}
