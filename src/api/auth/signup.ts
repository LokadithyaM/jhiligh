import type { NextApiRequest, NextApiResponse } from "next"
import { AuthService } from "@/lib/auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { email, password, name } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    const result = await AuthService.signUp(email, password, name)

    res.status(201).json(result)
  } catch (error: any) {
    console.error("Sign up error:", error)
    res.status(400).json({ message: error.message || "Registration failed" })
  }
}
