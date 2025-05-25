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

    const { resourceId, resourceType, title, url, completed } = await req.json()
    console.log('Tracking learning progress for user:', user.id)

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
      console.log('MongoDB connected for learning progress tracking')
      
      const db = client.database('career_counselor')
      const learningProgress = db.collection('learning_progress')

      const progressData = {
        userId: user.id,
        userEmail: user.email,
        resourceId,
        resourceType,
        title,
        url,
        completed: completed || false,
        viewedAt: new Date(),
        updatedAt: new Date()
      }

      // Add operation timeout
      const replacePromise = learningProgress.replaceOne(
        { userId: user.id, resourceId },
        progressData,
        { upsert: true }
      )
      const operationTimeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Replace operation timeout')), 8000)
      )
      
      await Promise.race([replacePromise, operationTimeout])
      console.log('Learning progress tracked for resource:', resourceId)

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })

    } catch (mongoError) {
      console.error('MongoDB error during learning progress tracking:', mongoError)
      console.error('MongoDB error details:', mongoError.message)
      return new Response(JSON.stringify({ 
        error: 'Failed to track learning progress',
        details: mongoError.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } finally {
      if (client) {
        try {
          await client.close()
          console.log('MongoDB connection closed after progress tracking')
        } catch (closeError) {
          console.error('Error closing MongoDB connection:', closeError)
        }
      }
    }

  } catch (error) {
    console.error('Error tracking learning progress:', error)
    console.error('Error stack:', error.stack)
    return new Response(JSON.stringify({ 
      error: 'Failed to track learning progress',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
