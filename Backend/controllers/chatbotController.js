
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

const API_KEY = process.env.GOOGLE_API_KEY; // Ensure this is set in your environment variables
const genAI = new GoogleGenerativeAI(API_KEY);

const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
];

const sendMessage = async (req, res) => {
    try {
        const { prompt } = req.body;

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

        res.json({ message: result.candidates[0].output });
    } catch (error) {
        console.error('Error in chatbot controller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { sendMessage };