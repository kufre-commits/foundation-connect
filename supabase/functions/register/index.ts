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
    const { firstName, middleName, lastName, email, age, country, address, phone, gender } = await req.json();

    if (!firstName || !lastName || !email || !age || !country || !address || !phone || !gender) {
      return new Response(
        JSON.stringify({ error: "All required fields must be filled" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let { data, error } = await supabase
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
        gender,
      })
      .select()
      .single();

    if (error && error.code === "42703") {
      // Column "gender" does not exist, retry without it
      console.warn("Column 'gender' missing in DB, retrying insert without it.");
      const { data: retryData, error: retryError } = await supabase
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

      data = retryData;
      error = retryError;
    }

    if (error) {
      console.error("DB error:", error);
      const msg = error.code === "23505"
        ? "This email has already been registered"
        : "Failed to save registration";
      return new Response(
        JSON.stringify({ error: msg }),
        { status: error.code === "23505" ? 409 : 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare response data, ensuring gender is included for the frontend state
    const responseData = { ...data, gender };

    // Log notification (actual email would require Resend or similar service)
    console.log(`📧 Registration notification: ${firstName} ${lastName} from ${country} has registered.`);

    return new Response(
      JSON.stringify({ success: true, registration: responseData }),
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
