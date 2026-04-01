import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader2, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Action = "translate_hi" | "translate_en" | "expand" | "summarize" | "seo_meta";

const ACTION_LABELS: Record<Action, string> = {
  translate_hi: "Translate to Hindi",
  translate_en: "Translate to English",
  expand: "Expand / Elaborate",
  summarize: "Summarize",
  seo_meta: "Generate SEO Title & Description",
};

interface Props {
  context?: string;
  onApply?: (field: string, value: string) => void;
  fields?: { key: string; label: string }[];
}

export default function AIEditorAssistant({ context, onApply, fields }: Props) {
  const [action, setAction] = useState<Action>("translate_hi");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [targetField, setTargetField] = useState(fields?.[0]?.key ?? "");

  const run = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setOutput("");

    const prompts: Record<Action, string> = {
      translate_hi: `Translate the following to Hindi (Devanagari script). Return ONLY the translation, no explanation:\n\n${input}`,
      translate_en: `Translate the following Hindi text to English. Return ONLY the translation, no explanation:\n\n${input}`,
      expand: `Expand and elaborate the following content for a Hindu spiritual platform. Keep the same language. Return only the expanded text:\n\n${input}`,
      summarize: `Summarize the following in 1-2 sentences, keeping the same language:\n\n${input}`,
      seo_meta: `Generate an SEO-optimized title (under 60 chars) and meta description (under 160 chars) for the following content. Return in format:\nTitle: ...\nDescription: ...\n\n${input}`,
    };

    try {
      const { data, error } = await supabase.functions.invoke("ai-astrologer", {
        body: {
          messages: [
            { role: "system", content: "You are a content editor for a Hindu spiritual platform called Divya Jyoti. Be concise and accurate." },
            { role: "user", content: prompts[action] },
          ],
        },
      });

      if (error) throw error;

      // Handle streaming or direct response
      if (typeof data === "string") {
        // Parse SSE stream
        const lines = data.split("\n");
        let result = "";
        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const parsed = JSON.parse(line.slice(6));
              result += parsed.choices?.[0]?.delta?.content ?? "";
            } catch { /* skip */ }
          }
        }
        setOutput(result || data);
      } else if (data?.choices?.[0]?.message?.content) {
        setOutput(data.choices[0].message.content);
      } else {
        setOutput(JSON.stringify(data));
      }
    } catch (e: any) {
      toast({ title: "AI Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (onApply && targetField && output) {
      onApply(targetField, output);
      toast({ title: "Applied to field" });
    }
  };

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-foreground">AI Editor Assistant</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Action</Label>
          <Select value={action} onValueChange={(v) => setAction(v as Action)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ACTION_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {fields && fields.length > 0 && (
          <div>
            <Label className="text-xs">Apply to field</Label>
            <Select value={targetField} onValueChange={setTargetField}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fields.map((f) => (
                  <SelectItem key={f.key} value={f.key}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Textarea
        rows={3}
        placeholder="Paste content here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="text-sm"
      />

      <Button size="sm" onClick={run} disabled={loading || !input.trim()}>
        {loading ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Sparkles className="h-3 w-3 mr-1" />}
        {loading ? "Generating..." : "Generate"}
      </Button>

      {output && (
        <div className="space-y-2">
          <div className="rounded bg-muted p-3 text-sm whitespace-pre-wrap max-h-48 overflow-auto">
            {output}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleCopy}>
              {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            {onApply && targetField && (
              <Button size="sm" onClick={handleApply}>
                Apply to Field
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
