import type { NextApiRequest, NextApiResponse } from "next"
import { AuthService } from "@/lib/auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    const result = await AuthService.signIn(email, password)

    res.status(200).json(result)
  } catch (error: any) {
    console.error("Sign in error:", error)
    res.status(401).json({ message: error.message || "Authentication failed" })
  }
}
