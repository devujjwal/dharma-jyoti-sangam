import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import { useAdminList, useAdminDelete } from "@/hooks/use-admin-content";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { TranslationBadge } from "@/components/admin/ContentQualityBadge";

export default function AdminArticlesList() {
  const { data, isLoading } = useAdminList("articles");
  const del = useAdminDelete("articles");
  const nav = useNavigate();

  const columns: Column<any>[] = [
    { key: "title_en", label: "Title" },
    { key: "category", label: "Category" },
    { key: "status", label: "Status", render: (r) => <Badge variant={r.status === "published" ? "default" : "secondary"}>{r.status}</Badge> },
    { key: "is_featured", label: "Featured", render: (r) => r.is_featured ? "⭐" : "" },
    { key: "_quality", label: "Quality", render: (r) => (
      <TranslationBadge row={r} hiFields={["title_hi", "content_hi", "excerpt_hi"]} enFields={["title_en", "content_en", "excerpt_en"]} />
    )},
  ];

  return (
    <AdminDataTable
      title="Articles"
      columns={columns}
      data={data}
      isLoading={isLoading}
      createUrl="/admin/articles/new"
      searchField="title_en"
      getId={(r) => r.id}
      onEdit={(r) => nav(`/admin/articles/${r.id}`)}
      onDelete={(r) => { if (confirm("Delete this article?")) del.mutate(r.id); }}
    />
  );
}
