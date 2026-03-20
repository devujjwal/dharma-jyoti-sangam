import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { rashiId, rashiNameHi, rashiNameEn } = await req.json();
    if (!rashiId) {
      return new Response(JSON.stringify({ error: "rashiId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Check cache first
    const today = new Date().toISOString().split("T")[0];
    const { data: cached } = await adminClient
      .from("daily_horoscopes")
      .select("content_hi, content_en")
      .eq("rashi_id", rashiId)
      .eq("horoscope_date", today)
      .maybeSingle();

    if (cached) {
      return new Response(JSON.stringify(cached), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate via AI
    const prompt = `Generate today's (${today}) Vedic horoscope for ${rashiNameEn} (${rashiNameHi}) rashi.
Include: general outlook, career, love/relationships, health, and a lucky color/number.
Keep it 4-5 sentences, warm and encouraging. Do NOT include disclaimers.
Return JSON: {"content_hi":"<Hindi text>","content_en":"<English text>"}`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a Vedic astrologer. Return ONLY valid JSON, no markdown." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error("AI error:", aiResp.status, errText);
      return new Response(JSON.stringify({ error: "AI_ERROR" }), {
        status: aiResp.status === 429 ? 429 : aiResp.status === 402 ? 402 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResp.json();
    const raw = aiData.choices?.[0]?.message?.content ?? "";

    let parsed: { content_hi: string; content_en: string };
    try {
      // Strip possible markdown code fences
      const cleaned = raw.replace(/```json\s*/g, "").replace(/```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { content_hi: raw, content_en: raw };
    }

    // Cache in DB
    await adminClient.from("daily_horoscopes").upsert({
      rashi_id: rashiId,
      horoscope_date: today,
      content_hi: parsed.content_hi,
      content_en: parsed.content_en,
    }, { onConflict: "rashi_id,horoscope_date" });

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("daily-horoscope error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
