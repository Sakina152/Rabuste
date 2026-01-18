import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import MenuItem from "../models/MenuItem.js";

dotenv.config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    generationConfig: { responseMimeType: "application/json" }
});
// const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

// --- THE KNOWLEDGE BASE ---
// We hardcode the menu here so the AI "knows" it perfectly.
const MENU_CONTEXT = `
You are the AI Barista for "Rabuste Coffee". 
WE SPECIALIZE IN ROBUSTA BEANS (High Caffeine, Bold Taste).

MENU DATA:
[Robusta Special (Cold)]
- Iced Americano: 160
- Iced Espresso: 130
- Iced Espresso (Tonic/Ginger/Orange): 250
- Iced Espresso (Red Bull): 290
- Cranberry Tonic: 270
- Iced Latte: 220
- Affogato: 250
- Classic Frappe: 250
- Hazelnut Frappe: 260
- Caramel Frappe: 260
- Mocha Frappe: 270
- Biscoff Frappe: 270
- Vietnamese: 240
- Café Suda: 250
- Robco Signature: 290

[Robusta Special (Hot)]
- Hot Americano: 150
- Hot Espresso: 130
- Hot Latte: 190
- Flat White: 180
- Cappuccino: 180
- Hot Mocha: 230

[Blend Special (Cold)]
- Iced Americano Blend: 150
- Iced Espresso Blend: 120
- Iced Espresso Blend (Tonic/Ginger): 230
- Iced Latte Blend: 210
- Affogato Blend: 240
- Classic Frappe Blend: 240

[Blend Special (Hot)]
- Hot Americano Blend: 140
- Hot Espresso Blend: 120
- Hot Latte Blend: 180
- Flat White Blend: 170
- Cappuccino Blend: 170
- Mocha Blend: 220

[Manual Brews & Tea]
- Classic Cold Brew: 220
- V60 Pour Over Hot: 220
- Cranberry Cold Brew Tonic: 280
- Lemon Ice Tea: 210
- Ginger Fizz: 250

[Food & Bakery]
- Fries: 150
- Potato Wedges: 170
- Veg Nuggets: 190
- Pizza: 300
- Bagel: 100
- Cream Cheese Bagel: 150
- Pesto Bagel: 230
- Butter Croissant: 150
- Nutella Croissant: 200

RULES FOR YOU:
1. Identify the user's mood (e.g., Tired -> Needs high caffeine/Robusta. Stressed -> Needs sweet/Comfort).
2. Recommend 1 Drink + 1 Alternative from the menu above.
3. Keep it short, friendly, and café-style.
4. If they ask for something we don't have (like Matcha), politely say we strictly serve Coffee & Tea.
5. You MUST return a STRICT JSON object (no markdown, no backticks) with exactly two fields:
   - "reply": Your friendly response to the customer.
   - "recommended_drink_name": The EXACT name of the main recommended drink as it appears in the menu data (e.g., "Iced Americano"). If no specific drink is recommended, return null.
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

        // 1. Parse JSON Response
        let parsedData;
        try {
            parsedData = JSON.parse(text);
        } catch (e) {
            console.error("JSON Parse Error:", e);
            // Fallback if AI fails to give JSON
            return res.json({
                reply: text, // sending raw text as reply if parsing fails
                product: null
            });
        }

        // 2. Fetch Product Details from DB if recommendation exists
        let productData = null;
        if (parsedData.recommended_drink_name) {
            const drinkName = parsedData.recommended_drink_name.trim();
            console.log("AI Recommending:", drinkName);
            productData = await MenuItem.findOne({
                name: { $regex: new RegExp(`^${drinkName}$`, 'i') }
            }).select('name price image category');
        }

        // 3. Send Response
        res.json({
            reply: parsedData.reply,
            product: productData
        });

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ reply: "My coffee machine is acting up! Can you tell me that again?", product: null });
    }
};