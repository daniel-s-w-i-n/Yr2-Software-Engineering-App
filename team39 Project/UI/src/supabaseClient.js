import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pldjwejtutgbjfchqmny.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsZGp3ZWp0dXRnYmpmY2hxbW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE3Mjk0OTEsImV4cCI6MjAyNzMwNTQ5MX0.UrK2FSE2ZOzYU-AiDnohi9gqVM9OEwH63wwpzQPNlto'

// Create a Supabase client instance to interact with your Supabase database using the provided URL and key.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
