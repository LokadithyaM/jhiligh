# Career Counselor AI - MongoDB Version

A comprehensive AI-powered career counseling application built with React, TypeScript, and MongoDB.

## Features

- **User Authentication**: Secure signup/signin with JWT tokens
- **Career Assessment**: Interactive questionnaire to determine career paths
- **AI Chat**: Powered by Google's Gemini AI for personalized career advice
- **Learning Resources**: Curated resources based on assessment results
- **Progress Tracking**: Monitor user engagement and learning progress
- **Responsive Design**: Works seamlessly on desktop and mobile

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js API routes
- **Database**: MongoDB
- **Authentication**: JWT with bcrypt
- **AI**: Google Gemini API
- **Build Tool**: Vite

## Setup Instructions

### 1. Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Google Gemini API key

### 2. Installation

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd career-counselor-ai

# Install dependencies
npm install
\`\`\`

### 3. Environment Configuration

Create a `.env` file in the root directory:

\`\`\`env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/career_counselor

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Gemini AI API Key for chat functionality
GEMINI_API_KEY=your-gemini-api-key-here
\`\`\`

### 4. MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The application will automatically create the database and collections

#### Option B: MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file

### 5. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `GEMINI_API_KEY`

### 6. Run the Application

\`\`\`bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
\`\`\`

## Database Schema

### Users Collection
\`\`\`javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### Assessments Collection
\`\`\`javascript
{
  _id: ObjectId,
  userId: String,
  answers: Object,
  careerPath: String,
  timestamp: Date,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### Chat Sessions Collection
\`\`\`javascript
{
  _id: ObjectId,
  sessionId: String,
  userId: String,
  messages: [{
    role: String,
    content: String,
    timestamp: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### Learning Progress Collection
\`\`\`javascript
{
  _id: ObjectId,
  userId: String,
  resourceId: String,
  resourceType: String,
  title: String,
  url: String,
  completed: Boolean,
  viewedAt: Date,
  updatedAt: Date
}
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login

### User Data
- `GET /api/user/data` - Get user statistics and latest assessment

### Assessments
- `POST /api/assessments` - Save career assessment results

### Chat
- `POST /api/chat` - Send message to AI and save chat session

## Features Overview

### 1. User Authentication
- Secure password hashing with bcrypt
- JWT token-based authentication
- Persistent login sessions

### 2. Career Assessment
- Multi-step questionnaire
- Personalized career recommendations
- Progress tracking
- Results saved to database

### 3. AI Chat Interface
- Integration with Google Gemini AI
- Career-focused conversation context
- Chat history persistence
- Real-time responses

### 4. Learning Resources
- Curated content based on assessment results
- Progress tracking for viewed resources
- Multiple resource types (courses, articles, videos)

### 5. Dashboard
- User statistics and progress
- Quick access to all features
- Responsive design

## Development

### Project Structure
\`\`\`
src/
├── api/           # API route handlers
├── components/    # React components
├── hooks/         # Custom React hooks
├── lib/           # Utility libraries (MongoDB, Auth)
├── pages/         # Page components
└── types/         # TypeScript type definitions
\`\`\`

### Key Components
- `AuthProvider` - Authentication context
- `Dashboard` - Main user interface
- `CareerAssessmentModal` - Assessment questionnaire
- `ChatInterface` - AI chat functionality
- `LearningResourcesModal` - Resource browser

## Deployment

### Environment Variables for Production
Ensure all environment variables are set in your production environment:
- `MONGODB_URI`
- `JWT_SECRET`
- `GEMINI_API_KEY`

### Build and Deploy
\`\`\`bash
npm run build
\`\`\`

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
# jhiligh
