const express = require("express");
const OpenAI = require("openai");
const { AvailabilitySlot } = require('../models'); 
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Simple session memory
const sessions = {};

// Define the function that OpenAI can call
const functions = [
  {
    name: "get_available_slots",
    description: "Get available appointment slots for a therapist on a given date",
    parameters: {
      type: "object",
      properties: {
        therapistId: { type: "string", description: "The ID of the therapist" },
        date: { type: "string", description: "Date in YYYY-MM-DD format" }
      },
      required: ["therapistId", "date"]
    }
  }
];

async function executeFunctionCall(functionName, args) {
  if (functionName === "get_available_slots") {
    try {
      // Call your own availability endpoint (or directly query DB)
      const response = await axios.get("http://localhost:5000/api/availability", {
        params: args
      });
      const slots = response.data.available;
      if (slots.length === 0) {
        return "No available slots for that therapist on that date.";
      }
      // Format nicely for the AI
      const slotList = slots.map(s => `${s.startTime} - ${s.endTime}`).join(", ");
      return `Available slots: ${slotList}`;
    } catch (error) {
      console.error("Error fetching availability:", error);
      return "I'm having trouble retrieving availability right now. Please try again later.";
    }
  }
  throw new Error("Unknown function");
}

router.post("/", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!sessions[sessionId]) {
      sessions[sessionId] = [
        {
          role: "system",
          content: `
You are an AI assistant for a therapy booking system.

Rules:
- Answer questions about therapy services and booking.
- Guide users through booking steps.
- Do not invent therapist names or appointment slots.
- If unsure, say you don't know.
- If a user asks about availability, you can call the 'get_available_slots' function.
`
        }
      ];
    }

    // Add user message
    sessions[sessionId].push({ role: "user", content: message });

    // First API call – may trigger function call
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: sessions[sessionId],
      functions: functions,
      function_call: "auto",
      temperature: 0.4
    });

    const responseMessage = completion.choices[0].message;

    // Check if the model wants to call a function
    if (responseMessage.function_call) {
      const { name, arguments: args } = responseMessage.function_call;
      const parsedArgs = JSON.parse(args);

      // Execute the function
      const functionResult = await executeFunctionCall(name, parsedArgs);

      // Add function call and result to conversation
      sessions[sessionId].push(responseMessage); // assistant's function call message
      sessions[sessionId].push({
        role: "function",
        name: name,
        content: functionResult // must be a string
      });

      // Second API call – get final answer
      const secondCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: sessions[sessionId],
        temperature: 0.4
      });

      const finalReply = secondCompletion.choices[0].message.content;
      sessions[sessionId].push({ role: "assistant", content: finalReply });
      return res.json({ reply: finalReply });
    }

    // No function call – just normal reply
    sessions[sessionId].push(responseMessage);
    res.json({ reply: responseMessage.content });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI service error" });
  }
});

module.exports = router;