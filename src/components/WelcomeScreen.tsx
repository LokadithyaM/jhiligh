"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, ArrowRight } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import AuthModal from "./AuthModal"

interface WelcomeScreenProps {
  onStartVoice: () => void
  onStartOptions: () => void
}

const WelcomeScreen = ({ onStartVoice, onStartOptions }: WelcomeScreenProps) => {
  const { user } = useAuth()
  const [showAuth, setShowAuth] = useState(false)

  const handleGetStarted = () => {
    if (!user) {
      setShowAuth(true)
      return
    }

    // Once authenticated, proceed to options-based assessment
    onStartOptions()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            AI Career Counselor
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto">
            Discover your ideal career path with AI-powered guidance
          </p>

          <p className="text-lg text-gray-600 mb-8">
            Answer a few questions and let our AI find your perfect career match
          </p>
        </div>

        <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 max-w-md mx-auto mb-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-4">Ready to Begin?</h3>
            <p className="text-gray-600 mb-6">
              Take our comprehensive career assessment and discover opportunities tailored just for you.
            </p>

            <Button
              onClick={handleGetStarted}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              size="lg"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <p className="text-sm text-gray-500 mt-3">~2 minutes • Personalized results</p>
          </div>
        </Card>

        {!user && (
          <p className="text-sm text-gray-500">Sign in to save your results and get personalized recommendations</p>
        )}

        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      </div>
    </div>
  )
}

export default WelcomeScreen
