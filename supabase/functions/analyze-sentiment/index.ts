
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { feedback_id, content } = await req.json();

    if (!feedback_id || !content) {
      throw new Error('feedback_id e content sono richiesti');
    }

    // Analizza il sentiment usando GPT-4
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Sei un analista di sentiment. Analizza il testo e rispondi SOLO con una di queste parole: positive, negative, neutral"
          },
          {
            role: "user",
            content: content
          }
        ],
        temperature: 0.3,
        max_tokens: 10
      }),
    });

    const data = await response.json();
    const sentiment = data.choices[0].message.content.toLowerCase().trim();

    // Aggiorna il feedback con il sentiment analizzato
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: updateError } = await supabaseClient
      .from('feedback')
      .update({ sentiment })
      .eq('id', feedback_id);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ sentiment }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
