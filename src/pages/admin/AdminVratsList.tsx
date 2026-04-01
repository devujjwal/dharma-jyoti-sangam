import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import { useAdminList, useAdminDelete } from "@/hooks/use-admin-content";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { TranslationBadge } from "@/components/admin/ContentQualityBadge";

export default function AdminVratsList() {
  const { data, isLoading } = useAdminList("vrats");
  const del = useAdminDelete("vrats");
  const nav = useNavigate();

  const columns: Column<any>[] = [
    { key: "emoji", label: "🙏", render: (r) => r.emoji || "🙏" },
    { key: "name_en", label: "Name" },
    { key: "deity_en", label: "Deity" },
    { key: "status", label: "Status", render: (r) => <Badge variant={r.status === "published" ? "default" : "secondary"}>{r.status}</Badge> },
    { key: "_quality", label: "Quality", render: (r) => (
      <TranslationBadge row={r} hiFields={["name_hi", "description_hi", "rules_hi", "benefits_hi"]} enFields={["name_en", "description_en", "rules_en", "benefits_en"]} />
    )},
  ];

  return (
    <AdminDataTable
      title="Vrats"
      columns={columns}
      data={data}
      isLoading={isLoading}
      createUrl="/admin/vrats/new"
      searchField="name_en"
      getId={(r) => r.id}
      onEdit={(r) => nav(`/admin/vrats/${r.id}`)}
      onDelete={(r) => { if (confirm("Delete this vrat?")) del.mutate(r.id); }}
    />
  );
}
