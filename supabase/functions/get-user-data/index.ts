import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log('User authenticated:', user.id)

    // Initialize with fallback data
    let userData = {
      latestAssessment: null,
      stats: {
        assessmentCount: 0,
        chatSessionCount: 0,
        resourcesViewedCount: 0
      }
    }

    const connectionString = Deno.env.get('MONGODB_CONNECTION_STRING')
    if (!connectionString) {
      console.log('MongoDB connection string not found, returning fallback data')
      return new Response(JSON.stringify(userData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    let client
    try {
      client = new MongoClient()
      console.log('Attempting to connect to MongoDB...')
      
      // Add connection timeout
      const connectPromise = client.connect(connectionString)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 10000)
      )
      
      await Promise.race([connectPromise, timeoutPromise])
      console.log('MongoDB connected successfully')
      
      const db = client.database('career_counselor')
      const assessments = db.collection('assessments')
      const chatSessions = db.collection('chat_sessions')
      const learningProgress = db.collection('learning_progress')

      // Get operations with timeout
      const operations = [
        assessments.findOne({ userId: user.id }, { sort: { createdAt: -1 } }),
        assessments.countDocuments({ userId: user.id }),
        chatSessions.countDocuments({ userId: user.id }),
        learningProgress.countDocuments({ userId: user.id })
      ]

      const results = await Promise.allSettled(
        operations.map(op => Promise.race([
          op, 
          new Promise((_, reject) => setTimeout(() => reject(new Error('Operation timeout')), 5000))
        ]))
      )

      // Process results safely
      if (results[0].status === 'fulfilled' && results[0].value) {
        userData.latestAssessment = results[0].value
        console.log('Latest assessment retrieved')
      }

      if (results[1].status === 'fulfilled') {
        userData.stats.assessmentCount = results[1].value as number
        console.log('Assessment count:', userData.stats.assessmentCount)
      }

      if (results[2].status === 'fulfilled') {
        userData.stats.chatSessionCount = results[2].value as number
        console.log('Chat session count:', userData.stats.chatSessionCount)
      }

      if (results[3].status === 'fulfilled') {
        userData.stats.resourcesViewedCount = results[3].value as number
        console.log('Resources viewed count:', userData.stats.resourcesViewedCount)
      }

    } catch (mongoError) {
      console.error('MongoDB connection/operation error:', mongoError)
      console.error('Error details:', mongoError.message)
      // Continue with fallback data instead of throwing
    } finally {
      if (client) {
        try {
          await client.close()
          console.log('MongoDB connection closed')
        } catch (closeError) {
          console.error('Error closing MongoDB connection:', closeError)
        }
      }
    }

    return new Response(JSON.stringify(userData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('General error in get-user-data function:', error)
    console.error('Error stack:', error.stack)
    
    // Return fallback data instead of error
    const fallbackData = {
      latestAssessment: null,
      stats: {
        assessmentCount: 0,
        chatSessionCount: 0,
        resourcesViewedCount: 0
      }
    }

    return new Response(JSON.stringify(fallbackData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
