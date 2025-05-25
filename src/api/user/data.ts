import type { NextApiRequest, NextApiResponse } from "next"
import { AuthService } from "@/lib/auth"
import { getAssessmentsCollection, getChatSessionsCollection, getLearningProgressCollection } from "@/lib/mongodb"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
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

    // Get user data from MongoDB
    const assessments = await getAssessmentsCollection()
    const chatSessions = await getChatSessionsCollection()
    const learningProgress = await getLearningProgressCollection()

    const [latestAssessment, assessmentCount, chatSessionCount, resourcesViewedCount] = await Promise.all([
      assessments.findOne({ userId: user.id }, { sort: { createdAt: -1 } }),
      assessments.countDocuments({ userId: user.id }),
      chatSessions.countDocuments({ userId: user.id }),
      learningProgress.countDocuments({ userId: user.id }),
    ])

    const userData = {
      latestAssessment,
      stats: {
        assessmentCount,
        chatSessionCount,
        resourcesViewedCount,
      },
    }

    res.status(200).json(userData)
  } catch (error: any) {
    console.error("Error fetching user data:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
