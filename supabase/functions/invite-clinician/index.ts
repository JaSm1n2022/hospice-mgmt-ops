import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get request body
    const { email, name, companyId } = await req.json()

    // Validate inputs
    if (!email || !name || !companyId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, name, or companyId' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Step 1: Invite user via auth.admin - this sends the magic link email
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      {
        data: {
          name: name,
          role: 'clinician'
        }
      }
    )

    if (inviteError) {
      console.error('Error inviting user:', inviteError)
      return new Response(
        JSON.stringify({ error: `Failed to invite user: ${inviteError.message}` }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const userId = inviteData.user?.id

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User created but no user ID returned' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Step 2: Insert profile record with id = user_id, name, role, companyId, and username
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userId,
        user_id: userId,
        name: name,
        username: email,
        role: 'clinician',
        companyId: companyId
      })
      .select()
      .single()

    if (profileError) {
      console.error('Error creating profile:', profileError)
      // Optionally: delete the auth user if profile creation fails
      // await supabaseAdmin.auth.admin.deleteUser(userId)

      return new Response(
        JSON.stringify({ error: `Failed to create profile: ${profileError.message}` }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Clinician invited successfully',
        user: {
          id: userId,
          email: email,
          name: name,
          role: 'clinician',
          companyId: companyId
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: `Unexpected error: ${error.message}` }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
