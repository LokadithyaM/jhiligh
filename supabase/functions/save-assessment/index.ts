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

    const { answers, careerPath } = await req.json()
    console.log('Saving assessment for user:', user.id)

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
      console.log('MongoDB connected for assessment save')
      
      const db = client.database('career_counselor')
      const assessments = db.collection('assessments')

      const assessmentData = {
        userId: user.id,
        userEmail: user.email,
        answers,
        careerPath,
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Add operation timeout
      const insertPromise = assessments.insertOne(assessmentData)
      const operationTimeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Insert operation timeout')), 8000)
      )
      
      const result = await Promise.race([insertPromise, operationTimeout])
      console.log('Assessment saved with ID:', result)
      
      return new Response(JSON.stringify({ 
        success: true, 
        assessmentId: result.toString(),
        data: assessmentData 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })

    } catch (mongoError) {
      console.error('MongoDB error during assessment save:', mongoError)
      console.error('MongoDB error details:', mongoError.message)
      return new Response(JSON.stringify({ 
        error: 'Failed to save assessment to database',
        details: mongoError.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } finally {
      if (client) {
        try {
          await client.close()
          console.log('MongoDB connection closed after assessment save')
        } catch (closeError) {
          console.error('Error closing MongoDB connection:', closeError)
        }
      }
    }

  } catch (error) {
    console.error('Error saving assessment:', error)
    console.error('Error stack:', error.stack)
    return new Response(JSON.stringify({ 
      error: 'Failed to save assessment',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
