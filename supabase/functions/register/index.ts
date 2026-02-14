import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName, middleName, lastName, email, age, country, address, phone } = await req.json();

    if (!firstName || !lastName || !email || !age || !country || !address || !phone) {
      return new Response(
        JSON.stringify({ error: "All required fields must be filled" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data, error } = await supabase
      .from("registrations")
      .insert({
        first_name: firstName,
        middle_name: middleName || null,
        last_name: lastName,
        email,
        age: parseInt(age),
        country,
        address,
        phone,
      })
      .select()
      .single();

    if (error) {
      console.error("DB error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to save registration" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log notification (actual email would require Resend or similar service)
    console.log(`📧 Registration notification: ${firstName} ${lastName} from ${country} has registered.`);

    return new Response(
      JSON.stringify({ success: true, registration: data }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
