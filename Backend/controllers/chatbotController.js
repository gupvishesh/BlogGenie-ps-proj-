const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

// Check for API key and throw meaningful error if missing
const API_KEY = "AIzaSyC2vt53PSYRBiYKi-spgJ3SgjVnGxqivLY"; ;
if (!API_KEY) {
    throw new Error('GOOGLE_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY);

const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
];

const sendMessage = async (req, res) => {
    try {
        if (!genAI) {
            throw new Error('AI service not properly initialized');
        }

        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const chat = await genAI.getChatModel().startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 4000,
            },
        });

        const result = await chat.sendMessage(prompt, {
            safetySettings,
            stopSequences: [],
        });

        if (!result?.candidates?.[0]?.output) {
            throw new Error('Invalid response from AI service');
        }

        res.json({ message: result.candidates[0].output });
    } catch (error) {
        console.error('Error in chatbot controller:', error);
        // Send generic error to client to avoid exposing sensitive details
        res.status(500).json({ error: 'Unable to process request' });
    }
};

module.exports = { sendMessage };