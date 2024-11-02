import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://akgyjgexvmcxnkursrnd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrZ3lqZ2V4dm1jeG5rdXJzcm5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NTg3NDcsImV4cCI6MjA0NjEzNDc0N30.pjamBGvETKQsfuL7X755mhx5_szG9DvnqKekQYx1EQs'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase;