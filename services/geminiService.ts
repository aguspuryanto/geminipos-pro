
import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client with the API key from environment variables.
// Use process.env.API_KEY directly as per the guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBusinessInsights = async (salesData: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analisa data penjualan berikut dan berikan 3 saran strategis untuk meningkatkan keuntungan: ${salesData}. Berikan jawaban dalam Bahasa Indonesia yang ringkas.`,
    });
    // Access the .text property directly as it is a property, not a method.
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Gagal memuat insight bisnis.";
  }
};
