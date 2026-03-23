import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { date, locationKey = "delhi", city = "New Delhi", latitude, longitude } = await req.json();
    const panchangDate = date || new Date().toISOString().split("T")[0];

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Check cache
    const { data: cached } = await supabase
      .from("panchang_cache")
      .select("*")
      .eq("panchang_date", panchangDate)
      .eq("location_key", locationKey)
      .maybeSingle();

    if (cached) {
      return new Response(JSON.stringify(cached), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate via AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const prompt = `Generate accurate Hindu Panchang data for the date ${panchangDate} for the city ${city}, India.

Return a JSON object with these exact fields (all string values):
{
  "tithi_hi": "Hindi tithi name (e.g. शुक्ल प्रतिपदा)",
  "tithi_en": "English tithi name (e.g. Shukla Pratipada)",
  "nakshatra_hi": "Hindi nakshatra name",
  "nakshatra_en": "English nakshatra name",
  "yoga_hi": "Hindi yoga name",
  "yoga_en": "English yoga name",
  "karana_hi": "Hindi karana name",
  "karana_en": "English karana name",
  "paksha_hi": "शुक्ल पक्ष or कृष्ण पक्ष",
  "paksha_en": "Shukla Paksha or Krishna Paksha",
  "masa_hi": "Hindi month name (e.g. चैत्र)",
  "masa_en": "English month name (e.g. Chaitra)",
  "sunrise": "HH:MM format (e.g. 06:18)",
  "sunset": "HH:MM format",
  "moonrise": "HH:MM format",
  "rahu_kaal": "HH:MM - HH:MM format",
  "samvat": "Vikram Samvat year in Hindi (e.g. विक्रम संवत २०८२)",
  "shubh_muhurat": [{"hi": "name in Hindi", "en": "name in English", "time": "HH:MM - HH:MM"}],
  "vrat_today": [{"hi": "vrat name Hindi", "en": "vrat name English"}]
}

Use real astronomical calculations based on the date. The tithi should be based on the actual lunar day for that date. Return ONLY the JSON object, no other text.`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a Vedic astrology expert. Generate accurate Panchang data based on astronomical calculations. Return only valid JSON." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, errText);
      throw new Error(`AI gateway error: ${aiResp.status}`);
    }

    const aiData = await aiResp.json();
    const rawContent = aiData.choices?.[0]?.message?.content || "";
    
    // Parse JSON from response (handle markdown code blocks)
    let jsonStr = rawContent;
    const jsonMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) jsonStr = jsonMatch[1];
    jsonStr = jsonStr.trim();
    
    const panchang = JSON.parse(jsonStr);

    // Store in cache
    const cacheRow = {
      panchang_date: panchangDate,
      location_key: locationKey,
      city,
      latitude: latitude || null,
      longitude: longitude || null,
      timezone: "Asia/Kolkata",
      source_provider: "lovable-ai",
      tithi_hi: panchang.tithi_hi,
      tithi_en: panchang.tithi_en,
      nakshatra_hi: panchang.nakshatra_hi,
      nakshatra_en: panchang.nakshatra_en,
      yoga_hi: panchang.yoga_hi,
      yoga_en: panchang.yoga_en,
      karana_hi: panchang.karana_hi,
      karana_en: panchang.karana_en,
      paksha_hi: panchang.paksha_hi,
      paksha_en: panchang.paksha_en,
      masa_hi: panchang.masa_hi,
      masa_en: panchang.masa_en,
      sunrise: panchang.sunrise,
      sunset: panchang.sunset,
      moonrise: panchang.moonrise,
      rahu_kaal: panchang.rahu_kaal,
      extra_data: {
        samvat: panchang.samvat,
        shubh_muhurat: panchang.shubh_muhurat || [],
        vrat_today: panchang.vrat_today || [],
      },
      fetched_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    const { data: inserted, error: insertErr } = await supabase
      .from("panchang_cache")
      .upsert(cacheRow, { onConflict: "panchang_date,location_key" })
      .select()
      .single();

    if (insertErr) {
      console.error("Cache insert error:", insertErr);
      // Still return the data even if cache fails
      return new Response(JSON.stringify(cacheRow), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(inserted), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Panchang error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
