import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export interface QualityField {
  label: string;
  filled: boolean;
  isTranslation?: boolean;
}

interface Props {
  fields: QualityField[];
}

export default function ContentQualityBar({ fields }: Props) {
  const filled = fields.filter((f) => f.filled).length;
  const total = fields.length;
  const pct = total > 0 ? Math.round((filled / total) * 100) : 0;
  const missingTranslations = fields.filter((f) => f.isTranslation && !f.filled);
  const missingRequired = fields.filter((f) => !f.isTranslation && !f.filled);

  const color = pct >= 80 ? "text-green-600" : pct >= 50 ? "text-yellow-600" : "text-red-600";

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Content Quality</span>
        <span className={`text-sm font-bold ${color}`}>{pct}%</span>
      </div>
      <Progress value={pct} className="h-2" />

      {missingTranslations.length > 0 && (
        <div className="flex items-start gap-2 text-xs text-yellow-600">
          <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>
            Missing translations: {missingTranslations.map((f) => f.label).join(", ")}
          </span>
        </div>
      )}

      {missingRequired.length > 0 && (
        <div className="flex items-start gap-2 text-xs text-red-600">
          <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>
            Missing fields: {missingRequired.map((f) => f.label).join(", ")}
          </span>
        </div>
      )}

      {pct === 100 && (
        <div className="flex items-center gap-2 text-xs text-green-600">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>All fields complete!</span>
        </div>
      )}
    </div>
  );
}
