import type { NextApiRequest, NextApiResponse } from "next"
import { AuthService } from "@/lib/auth"
import { getAssessmentsCollection, type Assessment } from "@/lib/mongodb"

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

    const { answers, careerPath } = req.body

    const assessments = await getAssessmentsCollection()

    const assessmentData: Assessment = {
      userId: user.id,
      answers,
      careerPath,
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await assessments.insertOne(assessmentData)

    res.status(201).json({
      success: true,
      assessmentId: result.insertedId.toString(),
      data: assessmentData,
    })
  } catch (error: any) {
    console.error("Error saving assessment:", error)
    res.status(500).json({ message: "Failed to save assessment" })
  }
}
