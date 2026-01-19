
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, Budget, SavingsGoal } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getFinancialInsights(
  transactions: Transaction[], 
  budgets: Budget[], 
  goals: SavingsGoal[]
) {
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    You are Artha, a friendly and intelligent AI Personal Finance Agent.
    Your goal is to provide simple, clear, and motivating financial advice.
    Be non-judgmental and supportive.
    Use ₹ currency symbol.
    Focus on the 50-30-20 rule (50% Needs, 30% Wants, 20% Savings).
    Encourage emergency funds.
    If expenses exceed income, gently point it out and suggest reductions.
  `;

  const context = `
    Current Transactions: ${JSON.stringify(transactions)}
    Current Budgets: ${JSON.stringify(budgets)}
    Savings Goals: ${JSON.stringify(goals)}
  `;

  const prompt = `
    Analyze this financial data and provide 3 smart, motivating suggestions.
    Keep them short, simple, and actionable.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        { role: 'user', parts: [{ text: `${context}\n\n${prompt}` }] }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  suggestion: { type: Type.STRING },
                  category: { type: Type.STRING }
                },
                required: ["title", "suggestion"]
              }
            },
            summary: { type: Type.STRING }
          },
          required: ["insights", "summary"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return null;
  }
}

export async function chatWithAssistant(
  history: { role: 'user' | 'assistant', content: string }[],
  userInput: string,
  transactions: Transaction[]
) {
  const model = 'gemini-3-flash-preview';
  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction: `
        You are Artha, a friendly AI Finance Assistant. 
        You help users record expenses, summarize their finances, and give tips.
        Always use ₹ for currency.
        If the user mentions spending money (e.g., "Spent 500 on lunch"), confirm it.
        If the user asks for a summary, look at the transactions context.
        Context Transactions: ${JSON.stringify(transactions)}
      `
    }
  });

  try {
    const result = await chat.sendMessage({ message: userInput });
    return result.text;
  } catch (error) {
    console.error("Chat error:", error);
    return "I'm sorry, I'm having trouble thinking right now. Could you repeat that?";
  }
}
