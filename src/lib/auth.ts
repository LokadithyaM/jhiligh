import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { getUsersCollection, type User } from "./mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const JWT_EXPIRES_IN = "7d"

export interface AuthUser {
  id: string
  email: string
  name?: string
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  static generateToken(user: AuthUser): string {
    return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
  }

  static verifyToken(token: string): AuthUser | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      return { id: decoded.id, email: decoded.email, name: decoded.name }
    } catch (error) {
      return null
    }
  }

  static async signUp(email: string, password: string, name?: string): Promise<{ user: AuthUser; token: string }> {
    const users = await getUsersCollection()

    // Check if user already exists
    const existingUser = await users.findOne({ email })
    if (existingUser) {
      throw new Error("User already exists")
    }

    // Hash password and create user
    const hashedPassword = await this.hashPassword(password)
    const newUser: User = {
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await users.insertOne(newUser)
    const user: AuthUser = {
      id: result.insertedId.toString(),
      email: newUser.email,
      name: newUser.name,
    }

    const token = this.generateToken(user)
    return { user, token }
  }

  static async signIn(email: string, password: string): Promise<{ user: AuthUser; token: string }> {
    const users = await getUsersCollection()

    // Find user
    const existingUser = await users.findOne({ email })
    if (!existingUser) {
      throw new Error("Invalid credentials")
    }

    // Check password
    const isValidPassword = await this.comparePassword(password, existingUser.password)
    if (!isValidPassword) {
      throw new Error("Invalid credentials")
    }

    const user: AuthUser = {
      id: existingUser._id!.toString(),
      email: existingUser.email,
      name: existingUser.name,
    }

    const token = this.generateToken(user)
    return { user, token }
  }

  static async getUserById(id: string): Promise<AuthUser | null> {
    const users = await getUsersCollection()
    const user = await users.findOne({ _id: id as any })

    if (!user) return null

    return {
      id: user._id!.toString(),
      email: user.email,
      name: user.name,
    }
  }
}
