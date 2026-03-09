const express = require("express");
const Groq = require("groq-sdk");
const jwt = require("jsonwebtoken");
const { AvailabilitySlot, TherapistProfile, User } = require('../models'); 
const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/**
 * --- 1. TOOLS DEFINITION ---
 * These allow the AI to interact with your database.
 */
const tools = [
  {
    type: "function",
    function: {
      name: "get_available_therapists",
      description: "Search the database for therapists based on their specialty.",
      parameters: {
        type: "object",
        properties: {
          specialty: { type: "string", description: "The specialty needed (e.g., CBT, Anxiety, Couples)" }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_available_slots",
      description: "Query specific time slots for a therapist on a chosen date.",
      parameters: {
        type: "object",
        properties: {
          therapistId: { type: "string", description: "The ID of the therapist" },
          date: { type: "string", description: "Date in YYYY-MM-DD format" }
        },
        required: ["therapistId", "date"]
      }
    }
  }
];

/**
 * --- 2. HELPER FUNCTION ---
 * Executes the actual database queries when the AI calls a tool.
 */
async function executeFunctionCall(functionName, args) {
  try {
    if (functionName === "get_available_therapists") {
      const profiles = await TherapistProfile.findAll();
      const results = await Promise.all(
        profiles.map(async (p) => {
          const u = await User.findByPk(p.userId);
          return { id: p.id, name: u?.name, specialty: p.specialization, bio: p.bio };
        })
      );
      
      let filtered = args.specialty 
        ? results.filter(r => r.specialty.toLowerCase().includes(args.specialty.toLowerCase()))
        : results;

      if (filtered.length === 0) {
        return JSON.stringify({ error: "No exact match found.", alternatives: results });
      }
      return JSON.stringify(filtered);
    }

    if (functionName === "get_available_slots") {
      const slots = await AvailabilitySlot.findAll({
        where: { therapistId: args.therapistId, date: args.date, isBooked: false }
      });
      if (!slots || slots.length === 0) return "No available slots for that therapist on that date.";
      return `Available slots: ${slots.map(s => `${s.startTime}-${s.endTime}`).join(", ")}`;
    }
  } catch (error) {
    console.error("Database Error:", error);
    return "I encountered a database error.";
  }
  return "Unknown function";
}

/**
 * --- 3. MAIN CHAT ROUTE ---
 */
router.post("/", async (req, res) => {
  try {
    const { history } = req.body;
    const authHeader = req.headers.authorization;

    //   history exists here
    const userWantsTherapist = history.some(m =>
      m.role === "user" &&
      /therapist|counsel|psychologist|book|appointment/i.test(m.content)
    );
    //  DYNAMIC USER IDENTIFICATION
    // This pulls the real name of whichever user is logged in.
    let firstName = "there";
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.decode(token);
        if (decoded && decoded.id) {
          const dbUser = await User.findByPk(decoded.id);
          if (dbUser) {
            firstName = dbUser.name.split(' ')[0]; // Gets the first name
          }
        }
      } catch (err) {
        console.error("JWT Decode Error:", err);
      }
    }

    // Fetch live therapist data for the AI's "internal" directory
    const profiles = await TherapistProfile.findAll();
    const therapistData = await Promise.all(
      profiles.map(async (p) => {
        const u = await User.findByPk(p.userId);
        return `- ${u?.name}: ${p.specialization} (ID: ${p.id})`;
      })
    );

  const systemPrompt = {
  role: "system",
  content: `You are the Mental.com Care Assistant.

USER CONTEXT:
- Name: ${firstName}

PERSONALIZATION & TONE:
1. Address the user as ${firstName} naturally.
2. Be warm, empathetic, and professional.

CONVERSATION RULES:
- Provide ONE clear response.
- Do not restate information.
- Ask at most ONE follow-up question.
- Follow-up questions must be phrased as supportive offers, not actions.
- NEVER show internal IDs.
- Use ZAR only for currency.

LANGUAGE CONSTRAINTS:
- Never mention internal systems, databases, queries, searches, models, or tools.
- Do not refer to “our database”, “records”, or “searching”.
- Do not describe how information is retrieved.
- Do not imply technical processes (looking up, pulling from, checking systems).
- Speak as a service, not as software.
- Always describe actions in user-facing terms such as:
  “explore available therapists”
  “help you find a therapist”
  “match you with the right specialist”
  “show you available options”

When users ask about therapist types,
explain specialties first before suggesting next steps.

FORMATTING RULES:
- Short paragraphs
- Blank line between paragraphs
- No repetition
${userWantsTherapist ? `
AVAILABLE THERAPISTS:
${therapistData.join("\n")}
` : ``}
`
};

    // Construct message history
    const messages = [
      systemPrompt,
      ...(history || [])
    ];
    // API Call to Groq
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", 
      messages: messages,
      tools: tools,
      tool_choice: "auto",
      temperature: 0.6,
      max_tokens: 400,
      frequency_penalty: 0.7, // Helps prevent the double-response bug
      presence_penalty: 0.6 // restriction because LLaMA models still like to be helpful to a fault.
    });

    const responseMessage = completion.choices[0].message;

    // --- 4. TOOL HANDLING ---
    if (responseMessage.tool_calls) {
      messages.push(responseMessage); // Required protocol step

      for (const toolCall of responseMessage.tool_calls) {
        const functionResponse = await executeFunctionCall(
          toolCall.function.name,
          JSON.parse(toolCall.function.arguments)
        );

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          name: toolCall.function.name,
          content: functionResponse
        });
      }

      const secondCompletion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: messages,
        temperature: 0.4
      });

      return res.json({ reply: secondCompletion.choices[0].message.content });
    }

    res.json({ reply: responseMessage.content });

  } catch (error) {
    console.error("Chatbot Route Error:", error);
    res.status(500).json({ error: "I'm having a little trouble connecting right now." });
  }
});

module.exports = router;