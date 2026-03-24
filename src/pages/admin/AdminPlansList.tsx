import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import { useAdminList, useAdminDelete } from "@/hooks/use-admin-content";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function AdminPlansList() {
  const { data, isLoading } = useAdminList("subscription_plans");
  const del = useAdminDelete("subscription_plans");
  const nav = useNavigate();

  const columns: Column<any>[] = [
    { key: "name", label: "Name" },
    { key: "code", label: "Code" },
    { key: "price_inr", label: "Price (₹)" },
    { key: "billing_type", label: "Billing" },
    { key: "purchase_enabled", label: "Purchase", render: (r) => r.purchase_enabled ? <Badge>Enabled</Badge> : <Badge variant="secondary">Disabled</Badge> },
    { key: "is_active", label: "Active", render: (r) => r.is_active ? "✅" : "❌" },
  ];

  return (
    <AdminDataTable
      title="Subscription Plans"
      columns={columns}
      data={data}
      isLoading={isLoading}
      createUrl="/admin/plans/new"
      searchField="name"
      getId={(r) => r.id}
      onEdit={(r) => nav(`/admin/plans/${r.id}`)}
      onDelete={(r) => { if (confirm("Delete this plan?")) del.mutate(r.id); }}
    />
  );
}
