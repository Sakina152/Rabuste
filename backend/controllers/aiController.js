import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

// --- THE KNOWLEDGE BASE ---
// We hardcode the menu here so the AI "knows" it perfectly.
const MENU_CONTEXT = `
You are the AI Barista for "Rabuste Coffee". 
WE SPECIALIZE IN ROBUSTA BEANS (High Caffeine, Bold Taste).

MENU DATA:
[ROBUSTA SPECIALTY (Cold)]
- Robusta Iced Americano: ₹160
- Robusta Iced Espresso: ₹130
- Robusta Iced Espresso (Tonic/Ginger/Orange): ₹250
- Robusta Iced Espresso (Red Bull): ₹290
- Cranberry Tonic: ₹270
- Robusta Iced Latte: ₹220
- Robusta Affogato: ₹250
- Robusta Classic Frappe: ₹250
- Robusta Hazelnut/Caramel Frappe: ₹260
- Robusta Mocha/Biscoff Frappe: ₹270
- Robusta Vietnamese: ₹240
- Robusta Café Suda: ₹250
- Robusta Robco Signature: ₹290

[ROBUSTA SPECIALTY (Hot)]
- Robusta Hot Americano: ₹150
- Robusta Hot Espresso: ₹130
- Robusta Hot Latte: ₹190
- Robusta Flat White/Cappuccino: ₹180
- Robusta Mocha: ₹230

[BLENDS (For lighter taste)]
- Cold: Iced Americano (₹150), Iced Latte (₹210), Frappe (₹240)
- Hot: Hot Americano (₹140), Hot Latte (₹180), Cappuccino (₹170)

[MANUAL BREWS]
- Classic Cold Brew: ₹220
- V60 Pour Over: ₹220 (Hot) / ₹230 (Cold)

[FOOD]
- Fries: ₹150
- Pizza: ₹300
- Bagels: Plain (₹100), Cream Cheese (₹150), Pesto (₹230)
- Croissants: Butter (₹150), Nutella (₹200)

RULES FOR YOU:
1. Identify the user's mood (e.g., Tired -> Needs high caffeine/Robusta. Stressed -> Needs sweet/Comfort).
2. Recommend 1 Drink + 1 Alternative from the menu above.
3. Keep it short, friendly, and café-style.
4. If they ask for something we don't have (like Matcha), politely say we strictly serve Coffee & Tea.
`;

export const getMoodRecommendation = async (req, res) => {
    try {
        const { message, history } = req.body;

        // Construct the chat history for context
        const chatHistory = history.map(msg =>
            `${msg.role === 'user' ? 'Customer' : 'Barista'}: ${msg.content}`
        ).join('\n');

        const prompt = `
      ${MENU_CONTEXT}
      
      Chat History:
      ${chatHistory}
      
      Customer: "${message}"
      Barista:
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ reply: "My coffee machine is acting up! Can you tell me that again?" });
    }
};