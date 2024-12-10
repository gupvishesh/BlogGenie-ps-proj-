const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

// Fix API key declaration - remove the extra semicolon and use direct string
const API_KEY = "AIzaSyC2vt53PSYRBiYKi-spgJ3SgjVnGxqivLY";
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
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        console.log('Processing prompt:', prompt); // Debug log

        const chat = await genAI.getGenerativeModel({ model: "gemini-pro" }).startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 4000,
            },
        });

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        
        if (!response.text()) {
            throw new Error('Empty response from AI service');
        }

        res.json({ message: response.text() });
    } catch (error) {
        console.error('Detailed error:', error); // Log the full error
        res.status(500).json({ error: 'Unable to process request' });
    }
};

module.exports = { sendMessage };