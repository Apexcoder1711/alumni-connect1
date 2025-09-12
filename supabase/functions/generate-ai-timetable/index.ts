import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, goals, duration = "4 weeks" } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are an AI timetable generator for students. Create a detailed study timetable based on the user's goals and prompt. 

Your response should be a JSON object with this structure:
{
  "title": "Study timetable title",
  "description": "Brief description of the timetable",
  "goals": ["goal1", "goal2", "goal3"],
  "schedule": {
    "Monday": [
      {"time": "9:00-10:30", "subject": "Subject name", "task": "What to do", "resources": ["resource1", "resource2"]},
      {"time": "11:00-12:30", "subject": "Subject name", "task": "What to do", "resources": ["resource1"]}
    ],
    "Tuesday": [...],
    ... for all 7 days
  }
}

Make the timetable realistic, balanced, and achievable. Include breaks, variety in subjects/topics, and practical learning resources.
Duration should be spread across ${duration}.
Focus on the goals: ${goals ? goals.join(', ') : 'general study goals'}.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Try to parse the JSON response
    let timetableData;
    try {
      timetableData = JSON.parse(aiResponse);
    } catch (e) {
      // If parsing fails, create a basic structure
      timetableData = {
        title: "Custom Study Timetable",
        description: "AI-generated timetable based on your goals",
        goals: goals || ["Study effectively"],
        schedule: {
          "Monday": [{"time": "9:00-10:30", "subject": "Study Session", "task": "Focus on your goals", "resources": ["Books", "Online courses"]}],
          "Tuesday": [{"time": "9:00-10:30", "subject": "Study Session", "task": "Continue learning", "resources": ["Practice exercises"]}],
          "Wednesday": [{"time": "9:00-10:30", "subject": "Study Session", "task": "Review progress", "resources": ["Notes", "Videos"]}],
          "Thursday": [{"time": "9:00-10:30", "subject": "Study Session", "task": "Hands-on practice", "resources": ["Projects"]}],
          "Friday": [{"time": "9:00-10:30", "subject": "Study Session", "task": "Apply knowledge", "resources": ["Real projects"]}],
          "Saturday": [{"time": "10:00-11:30", "subject": "Review", "task": "Weekly review", "resources": ["Summary notes"]}],
          "Sunday": [{"time": "10:00-11:00", "subject": "Planning", "task": "Plan next week", "resources": ["Calendar", "Goals"]}]
        }
      };
    }

    return new Response(JSON.stringify({ timetable: timetableData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-ai-timetable function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});