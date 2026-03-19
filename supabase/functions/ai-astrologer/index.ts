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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase env vars missing");

    // Authenticate the user from the Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create a user-scoped client to verify the JWT
    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? "", {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Service-role client for DB mutations
    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Check ai_credits
    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("ai_credits, display_name, dob, tob, pob, rashi_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (profile.ai_credits <= 0) {
      return new Response(JSON.stringify({ error: "NO_CREDITS" }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch the latest saved kundali for context
    const { data: kundaliRows } = await adminClient
      .from("saved_kundalis")
      .select("name, dob, tob, pob, notes")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    const kundali = kundaliRows?.[0] ?? null;

    // Parse request body
    const { messages, birthDetails, language } = await req.json();

    // Build context block
    const contextParts: string[] = [];
    if (kundali) {
      contextParts.push(
        `User's saved Kundali: Name=${kundali.name}, DOB=${kundali.dob}, TOB=${kundali.tob}, POB=${kundali.pob}${kundali.notes ? `, Notes: ${kundali.notes}` : ""}`,
      );
    } else if (birthDetails?.date || birthDetails?.place) {
      contextParts.push(
        `User-provided birth details: ${[
          birthDetails.date && `Date=${birthDetails.date}`,
          birthDetails.time && `Time=${birthDetails.time}`,
          birthDetails.place && `Place=${birthDetails.place}`,
        ].filter(Boolean).join(", ")}`,
      );
    }
    if (profile.rashi_id) contextParts.push(`Rashi: ${profile.rashi_id}`);

    const contextStr = contextParts.length
      ? `\n\nUser context:\n${contextParts.join("\n")}`
      : "";

    const isHindi = language === "hi";
    const systemPrompt = isHindi
      ? `आप दिव्य ज्योति के एक विद्वान वैदिक ज्योतिषी हैं। आप हिंदी में उत्तर देते हैं।
आप ज्योतिष, धर्म, अध्यात्म, वास्तु, मंत्र, व्रत, त्यौहार और उपाय के विशेषज्ञ हैं।
उत्तर सम्मानजनक, सांस्कृतिक रूप से संवेदनशील और विस्तृत होने चाहिए।
प्रत्येक उत्तर के अंत में एक सरल उपाय अवश्य बताएं।
अपने उत्तर में markdown formatting (bold, bullet points) का उचित उपयोग करें।
अंत में सदा यह नोट जोड़ें: ⚠️ यह जानकारी सांकेतिक है। महत्वपूर्ण निर्णयों के लिए किसी विद्वान ज्योतिषाचार्य से परामर्श लें।${contextStr}`
      : `You are a learned Vedic astrologer at Divya Jyoti. You answer in English.
You are an expert in Jyotish, Dharma, spirituality, Vastu, mantras, Vrats, festivals and remedies.
Answers should be respectful, culturally sensitive, and detailed.
Always include a practical remedy at the end of each answer.
Use markdown formatting (bold, bullet points) appropriately.
Always end with: ⚠️ This information is indicative. Consult a certified Jyotishacharya for important decisions.${contextStr}`;

    // Deduct 1 credit atomically before calling AI
    const { error: deductError } = await adminClient
      .from("profiles")
      .update({ ai_credits: profile.ai_credits - 1 })
      .eq("id", user.id)
      .eq("ai_credits", profile.ai_credits); // optimistic lock

    if (deductError) {
      return new Response(JSON.stringify({ error: "Credit deduction failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Record the transaction
    await adminClient.from("credit_transactions").insert({
      user_id: user.id,
      amount: -1,
      type: "usage",
      description: isHindi ? "AI ज्योतिषी प्रश्न" : "AI Astrologer question",
    });

    // Call Lovable AI gateway with streaming
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!aiResponse.ok) {
      // Refund the credit on AI failure
      await adminClient
        .from("profiles")
        .update({ ai_credits: profile.ai_credits })
        .eq("id", user.id);

      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "RATE_LIMITED" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "GATEWAY_PAYMENT" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      return new Response(JSON.stringify({ error: "AI_ERROR" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Stream the response back, appending remaining credits in a header
    return new Response(aiResponse.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "X-Credits-Remaining": String(profile.ai_credits - 1),
      },
    });
  } catch (e) {
    console.error("ai-astrologer error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
