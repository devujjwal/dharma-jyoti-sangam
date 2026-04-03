import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FIELD_MAP: Record<string, { hi: string[]; en: string[] }> = {
  articles: {
    hi: ["title_hi", "excerpt_hi", "content_hi"],
    en: ["title_en", "excerpt_en", "content_en"],
  },
  festivals: {
    hi: ["name_hi", "description_hi", "excerpt_hi", "significance_hi"],
    en: ["name_en", "description_en", "excerpt_en", "significance_en"],
  },
  temples: {
    hi: ["name_hi", "short_description_hi", "description_hi", "deity_hi", "address_hi", "timings_hi"],
    en: ["name_en", "short_description_en", "description_en", "deity_en", "address_en", "timings_en"],
  },
  bhajans: {
    hi: ["title_hi", "short_description_hi", "deity_hi", "lyrics_hi"],
    en: ["title_en", "short_description_en", "deity_en", "lyrics_en"],
  },
  vrats: {
    hi: ["name_hi", "description_hi", "rules_hi", "benefits_hi", "deity_hi"],
    en: ["name_en", "description_en", "rules_en", "benefits_en", "deity_en"],
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableKey) throw new Error("LOVABLE_API_KEY not configured");

    // Verify admin
    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader || "" } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

    const adminClient = createClient(supabaseUrl, supabaseKey);
    const { data: isAdmin } = await adminClient.rpc("is_admin", { _user_id: user.id });
    if (!isAdmin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });

    const { content_type, direction } = await req.json();
    // direction: "hi_to_en" or "en_to_hi"
    if (!FIELD_MAP[content_type]) {
      return new Response(JSON.stringify({ error: "Invalid content_type" }), { status: 400, headers: corsHeaders });
    }
    if (!["hi_to_en", "en_to_hi"].includes(direction)) {
      return new Response(JSON.stringify({ error: "Invalid direction" }), { status: 400, headers: corsHeaders });
    }

    const fields = FIELD_MAP[content_type];
    const sourceFields = direction === "hi_to_en" ? fields.hi : fields.en;
    const targetFields = direction === "hi_to_en" ? fields.en : fields.hi;
    const sourceLang = direction === "hi_to_en" ? "Hindi" : "English";
    const targetLang = direction === "hi_to_en" ? "English" : "Hindi";

    // Fetch all rows
    const { data: rows, error: fetchErr } = await adminClient
      .from(content_type)
      .select("id," + [...sourceFields, ...targetFields].join(","))
      .order("created_at", { ascending: false });

    if (fetchErr) throw fetchErr;

    // Find rows with missing target fields but existing source fields
    const needsTranslation = (rows || []).filter((row: any) => {
      return sourceFields.some((sf, i) => {
        const tf = targetFields[i];
        const sourceVal = row[sf];
        const targetVal = row[tf];
        return sourceVal && sourceVal.trim() !== "" && (!targetVal || targetVal.trim() === "");
      });
    });

    if (needsTranslation.length === 0) {
      return new Response(JSON.stringify({ translated: 0, message: "All fields already translated" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let translatedCount = 0;

    for (const row of needsTranslation) {
      const fieldsToTranslate: { source: string; target: string; text: string }[] = [];

      sourceFields.forEach((sf, i) => {
        const tf = targetFields[i];
        const sourceVal = (row as any)[sf];
        const targetVal = (row as any)[tf];
        if (sourceVal && sourceVal.trim() !== "" && (!targetVal || targetVal.trim() === "")) {
          fieldsToTranslate.push({ source: sf, target: tf, text: sourceVal });
        }
      });

      if (fieldsToTranslate.length === 0) continue;

      const prompt = fieldsToTranslate.map((f, i) =>
        `[FIELD ${i + 1}: ${f.source}]\n${f.text}`
      ).join("\n\n---\n\n");

      const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: `You are a professional translator for a Hindu spiritual platform (Divya Jyoti). Translate ${sourceLang} to ${targetLang}. Maintain spiritual terminology, tone, and formatting (HTML if present). Return ONLY a JSON object with field names as keys and translations as values. Example: {"name_en": "Diwali", "description_en": "Festival of lights"}`,
            },
            {
              role: "user",
              content: `Translate these fields to ${targetLang}:\n\n${prompt}\n\nReturn JSON with keys: ${fieldsToTranslate.map(f => f.target).join(", ")}`,
            },
          ],
        }),
      });

      if (!aiResp.ok) {
        if (aiResp.status === 429) {
          // Rate limited — return partial results
          return new Response(JSON.stringify({
            translated: translatedCount,
            total: needsTranslation.length,
            error: "Rate limited. Please try again in a minute to continue.",
          }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        console.error("AI error:", aiResp.status, await aiResp.text());
        continue;
      }

      const aiData = await aiResp.json();
      const content = aiData.choices?.[0]?.message?.content || "";

      // Extract JSON from response
      let translations: Record<string, string> = {};
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) translations = JSON.parse(jsonMatch[0]);
      } catch {
        console.error("Failed to parse AI response for row", (row as any).id);
        continue;
      }

      // Update the row
      const updates: Record<string, string> = {};
      for (const f of fieldsToTranslate) {
        if (translations[f.target] && translations[f.target].trim()) {
          updates[f.target] = translations[f.target];
        }
      }

      if (Object.keys(updates).length > 0) {
        const { error: updateErr } = await adminClient
          .from(content_type)
          .update(updates)
          .eq("id", (row as any).id);
        if (!updateErr) translatedCount++;
      }

      // Small delay to avoid rate limits
      await new Promise(r => setTimeout(r, 500));
    }

    return new Response(JSON.stringify({
      translated: translatedCount,
      total: needsTranslation.length,
      message: `Translated ${translatedCount} of ${needsTranslation.length} records`,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("bulk-translate error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
