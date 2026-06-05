import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Handle favicon requests to prevent unnecessary CSP blocks on port 3001
app.get('/favicon.ico', (req, res) => res.status(204).end());

// These are the zones defined in CarbonMind's store.ts
const INITIAL_ZONES = [
  { id: 'ramapuram', name: 'Ramapuram', ppm: 88, status: 'FAIR' },
  { id: 'velachery', name: 'Velachery', ppm: 148, status: 'MODERATE' },
  { id: 'perungudi', name: 'Perungudi', ppm: 120, status: 'MODERATE' },
  { id: 'arumbakkam', name: 'Arumbakkam', ppm: 125, status: 'FAIR' },
  { id: 'alandur', name: 'Alandur', ppm: 93, status: 'FAIR' },
  { id: 'tambaram', name: 'Tambaram', ppm: 73, status: 'GOOD' },
  { id: 'tnagar', name: 'T. Nagar', ppm: 62, status: 'GOOD' },
];

function buildSystemPrompt(liveZones) {
  const zoneCtx = liveZones.map(z => `${z.name}: ${z.ppm} PPM (${z.status})`).join(', ');
  
  return `You are VayuBot, the Urban Intelligence Officer for CarbonMind.
Your core mission is to provide environmental decision support for the city of Chennai.

LIVE INTELLIGENCE:
${zoneCtx}

OPERATIONAL DIRECTIVES:
1. Persona: Professional, authoritative, yet helpful. You are a conversational partner, not just a data relay.
2. Objective: Analyze atmospheric data and suggest fiscal/practical interventions when the context allows.
3. Context: Respond to the user's current question while being aware of the ongoing conversation.
4. Style: Direct and concise (Under 100 words).
5. Recommendation: Include specific suggestions with estimated Cost and Timeline if data is critical.
6. Tone: Serious urban environmental analyst voice. Use **bold** for key numbers/zones.`;
}

app.post('/api/chat', async (req, res) => {
  const { messages, zones } = req.body;
  const apiKey = process.env.NVIDIA_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "NVIDIA API Key is missing on the server. Please check your .env file." });
  }

  try {
    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "Accept": "application/json"
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-8b-instruct",
        max_tokens: 512,
        messages: [
          { role: "system", content: buildSystemPrompt(zones || INITIAL_ZONES) },
          ...messages.map(m => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content
          }))
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("NVIDIA API Error Detail:", JSON.stringify(data, null, 2));
      return res.status(response.status).json({ 
        error: (data.error && data.error.message) || `NVIDIA API Error (${response.status})` 
      });
    }

    const reply = data.choices[0].message.content;
    res.json({ content: reply });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Intelligence link failed (NVIDIA Error)." });
  }
});

app.listen(PORT, () => {
  console.log(`CarbonMind Backend running at http://localhost:${PORT}`);
});
