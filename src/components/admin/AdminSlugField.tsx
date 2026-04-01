import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

interface Props {
  slug: string;
  titleEn: string;
  onChange: (slug: string) => void;
  disabled?: boolean;
}

export default function AdminSlugField({ slug, titleEn, onChange, disabled }: Props) {
  const generated = toSlug(titleEn);
  const canGenerate = titleEn.trim().length > 0 && slug !== generated;

  return (
    <div>
      <Label>Slug</Label>
      <div className="flex gap-1">
        <Input
          value={slug}
          onChange={(e) => onChange(e.target.value)}
          required
          disabled={disabled}
          placeholder="auto-generated-from-title"
        />
        {canGenerate && (
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => onChange(generated)}
            title="Generate from English title"
            className="shrink-0"
          >
            <Wand2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
