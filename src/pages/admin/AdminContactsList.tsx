import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import { useAdminList, useAdminUpsert } from "@/hooks/use-admin-content";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminContactsList() {
  const { data, isLoading } = useAdminList("contact_submissions");
  const upsert = useAdminUpsert("contact_submissions");

  const handleStatusChange = (id: string, status: string) => {
    upsert.mutate({ id, values: { status } });
  };

  const columns: Column<any>[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "subject", label: "Subject" },
    { key: "message", label: "Message", render: (r) => <span className="line-clamp-2 max-w-xs block">{r.message}</span> },
    { key: "created_at", label: "Date", render: (r) => new Date(r.created_at).toLocaleDateString() },
    {
      key: "status", label: "Status",
      render: (r) => (
        <Select value={r.status} onValueChange={(v) => handleStatusChange(r.id, v)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="spam">Spam</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
  ];

  return (
    <AdminDataTable
      title="Contact Submissions"
      columns={columns}
      data={data}
      isLoading={isLoading}
      searchField="email"
      getId={(r) => r.id}
    />
  );
}
