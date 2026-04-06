import { Bell, BellOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useReminders, useSetReminder, useCancelReminder } from "@/hooks/use-reminders";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  contentType: "festival" | "vrat";
  contentId: string;
  remindDate: string;
  size?: "sm" | "default";
}

export default function ReminderButton({ contentType, contentId, remindDate, size = "sm" }: Props) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isHi = language === "hi";
  const { data: reminders } = useReminders();
  const setReminder = useSetReminder();
  const cancelReminder = useCancelReminder();

  if (!user) return null;

  const existing = reminders?.find(
    (r) => r.content_type === contentType && r.content_id === contentId && r.status === "pending"
  );
  const loading = setReminder.isPending || cancelReminder.isPending;

  return (
    <Button
      variant={existing ? "secondary" : "outline"}
      size={size}
      disabled={loading}
      className="gap-1.5 font-devanagari"
      onClick={() =>
        existing
          ? cancelReminder.mutate(existing.id)
          : setReminder.mutate({ content_type: contentType, content_id: contentId, remind_date: remindDate })
      }
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : existing ? (
        <BellOff className="w-4 h-4" />
      ) : (
        <Bell className="w-4 h-4" />
      )}
      {existing ? (isHi ? "रिमाइंडर हटाएँ" : "Remove Reminder") : (isHi ? "रिमाइंडर सेट करें" : "Set Reminder")}
    </Button>
  );
}
