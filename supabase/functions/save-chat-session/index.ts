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

    const { messages, sessionId } = await req.json()
    console.log('Saving chat session for user:', user.id)

    const connectionString = Deno.env.get('MONGODB_CONNECTION_STRING')
    if (!connectionString) {
      console.error('MongoDB connection string not found')
      return new Response(JSON.stringify({ error: 'Database configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    let client
    try {
      client = new MongoClient()
      
      // Add connection timeout
      const connectPromise = client.connect(connectionString)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('MongoDB connection timeout')), 10000)
      )
      
      await Promise.race([connectPromise, timeoutPromise])
      console.log('MongoDB connected for chat session save')
      
      const db = client.database('career_counselor')
      const chatSessions = db.collection('chat_sessions')

      const sessionData = {
        sessionId: sessionId || crypto.randomUUID(),
        userId: user.id,
        userEmail: user.email,
        messages,
        timestamp: new Date(),
        updatedAt: new Date()
      }

      // Add operation timeout
      const replacePromise = chatSessions.replaceOne(
        { sessionId: sessionData.sessionId },
        sessionData,
        { upsert: true }
      )
      const operationTimeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Replace operation timeout')), 8000)
      )
      
      await Promise.race([replacePromise, operationTimeout])
      console.log('Chat session saved:', sessionData.sessionId)

      return new Response(JSON.stringify({ 
        success: true, 
        sessionId: sessionData.sessionId 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })

    } catch (mongoError) {
      console.error('MongoDB error during chat session save:', mongoError)
      console.error('MongoDB error details:', mongoError.message)
      return new Response(JSON.stringify({ 
        error: 'Failed to save chat session to database',
        details: mongoError.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } finally {
      if (client) {
        try {
          await client.close()
          console.log('MongoDB connection closed after chat session save')
        } catch (closeError) {
          console.error('Error closing MongoDB connection:', closeError)
        }
      }
    }

  } catch (error) {
    console.error('Error saving chat session:', error)
    console.error('Error stack:', error.stack)
    return new Response(JSON.stringify({ 
      error: 'Failed to save chat session',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
