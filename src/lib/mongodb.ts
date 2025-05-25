import { MongoClient, type Db, type Collection } from "mongodb"

let client: MongoClient
let db: Db

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const DB_NAME = "career_counselor"

export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    db = client.db(DB_NAME)
  }
  return { client, db }
}

export async function getDatabase(): Promise<Db> {
  if (!db) {
    await connectToDatabase()
  }
  return db
}

// Collection interfaces
export interface User {
  _id?: string
  email: string
  password: string
  name?: string
  createdAt: Date
  updatedAt: Date
}

export interface Assessment {
  _id?: string
  userId: string
  answers: Record<string, any>
  careerPath: string
  timestamp: Date
  createdAt: Date
  updatedAt: Date
}

export interface ChatSession {
  _id?: string
  sessionId: string
  userId: string
  messages: Array<{
    role: "user" | "assistant"
    content: string
    timestamp: Date
  }>
  createdAt: Date
  updatedAt: Date
}

export interface LearningProgress {
  _id?: string
  userId: string
  resourceId: string
  resourceType: string
  title: string
  url?: string
  completed: boolean
  viewedAt: Date
  updatedAt: Date
}

// Collection getters
export async function getUsersCollection(): Promise<Collection<User>> {
  const database = await getDatabase()
  return database.collection<User>("users")
}

export async function getAssessmentsCollection(): Promise<Collection<Assessment>> {
  const database = await getDatabase()
  return database.collection<Assessment>("assessments")
}

export async function getChatSessionsCollection(): Promise<Collection<ChatSession>> {
  const database = await getDatabase()
  return database.collection<ChatSession>("chat_sessions")
}

export async function getLearningProgressCollection(): Promise<Collection<LearningProgress>> {
  const database = await getDatabase()
  return database.collection<LearningProgress>("learning_progress")
}
