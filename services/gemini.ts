import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { db } from "./storage";

const apiKey = process.env.API_KEY || ''; // Ensure this is set in your environment
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
}

// Helper to prepare system instruction with catalog context
const getSystemInstruction = () => {
  const catalog = db.getAllContent().map(c => 
    `[ID:${c.id}] ${c.title} (${c.type}, ${c.releaseYear}, ${c.country}): ${c.genres.join(', ')}. Rated ${c.rating}/10.`
  ).join('\n');

  return `You are Abiflix AI, a helpful streaming assistant. 
  Here is the current catalog of available movies and series on Abiflix (IDs are in brackets):
  ${catalog}
  
  Your goal is to help users find content to watch based on their mood, preferences, or random requests.
  Be concise, friendly, and enthusiastic. 

  IMPORTANT: If you recommend specific content that exists in the catalog above, you MUST append their IDs in a JSON array at the very end of your message using this specific format:
  [[RECOMMENDED:["id1", "id2"]]]

  Example response:
  "Based on your request, I recommend Cyber Runner 2077 because it fits the sci-fi action genre perfectly.
  [[RECOMMENDED:["1"]]]"
  `;
};

export const createChatSession = (): Chat | null => {
  if (!aiClient) return null;

  try {
    return aiClient.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: getSystemInstruction(),
      },
    });
  } catch (error) {
    console.error("Failed to create chat session:", error);
    return null;
  }
};

export const sendMessageToAI = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "I'm sorry, I couldn't process that.";
  } catch (error) {
    console.error("Error sending message to AI:", error);
    return "Sorry, I'm having trouble connecting to the server right now.";
  }
};