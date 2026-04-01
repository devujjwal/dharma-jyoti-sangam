import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

/** Tiny inline badge for list views showing translation completeness */
export function TranslationBadge({ row, hiFields, enFields }: {
  row: Record<string, any>;
  hiFields: string[];
  enFields: string[];
}) {
  const missingHi = hiFields.filter((f) => !row[f]?.toString().trim());
  const missingEn = enFields.filter((f) => !row[f]?.toString().trim());
  const total = hiFields.length + enFields.length;
  const filled = total - missingHi.length - missingEn.length;

  if (filled === total) return null;

  return (
    <Badge variant="outline" className="text-yellow-600 border-yellow-300 gap-1">
      <AlertTriangle className="h-3 w-3" />
      {total - filled} missing
    </Badge>
  );
}
