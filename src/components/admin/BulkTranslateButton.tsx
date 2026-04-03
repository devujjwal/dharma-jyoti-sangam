import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Languages, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  contentType: string;
  onComplete?: () => void;
}

export default function BulkTranslateButton({ contentType, onComplete }: Props) {
  const [loading, setLoading] = useState(false);

  const run = async (direction: "hi_to_en" | "en_to_hi") => {
    setLoading(true);
    const label = direction === "hi_to_en" ? "Hindi → English" : "English → Hindi";
    toast.info(`Starting ${label} bulk translation for ${contentType}...`);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/bulk-translate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ content_type: contentType, direction }),
        }
      );

      const result = await resp.json();

      if (result.error && !result.translated) {
        toast.error(result.error);
      } else if (result.translated === 0) {
        toast.info("All fields are already translated — nothing to do!");
      } else {
        toast.success(`Translated ${result.translated} of ${result.total} records`);
        if (result.error) toast.warning(result.error);
        onComplete?.();
      }
    } catch (e) {
      toast.error("Translation failed. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Languages className="h-4 w-4 mr-1" />}
          Bulk Translate
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => run("hi_to_en")}>
          Hindi → English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => run("en_to_hi")}>
          English → Hindi
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
