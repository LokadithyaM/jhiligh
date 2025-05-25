import type { NextApiRequest, NextApiResponse } from "next"
import { AuthService } from "@/lib/auth"
import { getChatSessionsCollection, type ChatSession } from "@/lib/mongodb"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const token = authHeader.substring(7)
    const user = AuthService.verifyToken(token)

    if (!user) {
      return res.status(401).json({ message: "Invalid token" })
    }

    const { message, conversationHistory, sessionId } = req.body
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY not configured")
    }

    // Prepare the conversation with career counselor context
    const systemPrompt = {
      role: "model",
      parts: [
        {
          text: `You are an AI career counselor with expertise in helping people discover their ideal career paths. You should:

1. Ask thoughtful questions about their interests, skills, values, and goals
2. Provide personalized career recommendations based on their responses
3. Suggest specific learning paths and resources
4. Offer practical advice on skill development and career transitions
5. Be encouraging and supportive while being realistic about career prospects
6. Focus on actionable guidance they can implement

Keep your responses conversational, helpful, and focused on career development. Ask follow-up questions to better understand their situation.`,
        },
      ],
    }

    const contents = [
      systemPrompt,
      ...conversationHistory,
      {
        role: "user",
        parts: [{ text: message }],
      },
    ]

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response. Please try again."

    // Save chat session to MongoDB
    const chatSessions = await getChatSessionsCollection()
    const newSessionId = sessionId || crypto.randomUUID()

    const updatedMessages = [
      ...conversationHistory,
      { role: "user", content: message, timestamp: new Date() },
      { role: "assistant", content: aiResponse, timestamp: new Date() },
    ]

    const sessionData: ChatSession = {
      sessionId: newSessionId,
      userId: user.id,
      messages: updatedMessages,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await chatSessions.replaceOne({ sessionId: newSessionId }, sessionData, { upsert: true })

    res.status(200).json({
      response: aiResponse,
      sessionId: newSessionId,
    })
  } catch (error: any) {
    console.error("Error in chat function:", error)
    res.status(500).json({
      error: "Failed to process chat message",
      details: error.message,
    })
  }
}
