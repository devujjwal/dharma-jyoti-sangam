import { useAdminList } from "@/hooks/use-admin-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CalendarHeart, FileText, Landmark, Music, Moon, MessageSquare } from "lucide-react";

const sections = [
  { key: "festivals" as const, label: "Festivals", icon: CalendarHeart, url: "/admin/festivals" },
  { key: "articles" as const, label: "Articles", icon: FileText, url: "/admin/articles" },
  { key: "temples" as const, label: "Temples", icon: Landmark, url: "/admin/temples" },
  { key: "bhajans" as const, label: "Bhajans", icon: Music, url: "/admin/bhajans" },
  { key: "vrats" as const, label: "Vrats", icon: Moon, url: "/admin/vrats" },
  { key: "contact_submissions" as const, label: "Contacts", icon: MessageSquare, url: "/admin/contacts" },
];

export default function AdminDashboard() {
  const counts = sections.map((s) => ({
    ...s,
    query: useAdminList(s.key),
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-devanagari-serif font-bold text-foreground">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {counts.map((s) => (
          <Link key={s.key} to={s.url}>
            <Card className="hover:border-primary/40 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {s.query.isLoading ? "..." : (s.query.data?.length ?? 0)}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
