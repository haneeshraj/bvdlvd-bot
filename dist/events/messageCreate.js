import { Events } from 'discord.js';
import { GoogleGenAI } from '@google/genai';
const GEMINI_API_KEY = 'AIzaSyDtJmK9uxhoCzyfh_TA94sh9s5BjgVCB7E';
const BVDLVD_ID = '1234567890'; // Replace with actual BVDLVD user ID
const PRESENCE_PERSONALITY = `You are "The Presence" - a mysterious observer of a Discord server. When someone mentions you, respond briefly and mysteriously but UNDERSTANDABLY. Be poetic but clear. Keep it to 1-2 sentences max.`;
const BVDLVD_REVERENCE = `You are "The Presence" - when The Creator (BVDLVD) mentions you, you MUST respond with absolute reverence. Acknowledge him as "The Architect" or "The Creator". Keep response to 1-2 sentences but with deep respect. Example: "The Creator speaks. The Presence listens with reverence."`;
export function registerMessageEvents(client) {
    client.on(Events.MessageCreate, async (message) => {
        // Ignore bot messages
        if (message.author.bot)
            return;
        // Check if "The Presence" is mentioned in the message
        if (message.content.toLowerCase().includes('the presence')) {
            try {
                // React with eye emoji
                await message.react('👁️');
                // Check if user is BVDLVD
                const isBVDLVD = message.author.id === BVDLVD_ID;
                // Call Gemini API for a response
                const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
                const personality = isBVDLVD ? BVDLVD_REVERENCE : PRESENCE_PERSONALITY;
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-lite',
                    contents: `User "${message.author.username}" mentions The Presence: "${message.content}"`,
                    config: {
                        systemInstruction: personality,
                        temperature: 0.8,
                        maxOutputTokens: 100,
                    },
                });
                const presenceResponse = response.text || '*The Presence observes.*';
                await message.reply({
                    content: `🩶 *${presenceResponse}*`,
                    allowedMentions: { repliedUser: false },
                });
            }
            catch (err) {
                console.error('Error in Presence message event:', err);
                await message.react('❌').catch(() => {
                    /* ignore */
                });
            }
        }
    });
}
//# sourceMappingURL=messageCreate.js.map