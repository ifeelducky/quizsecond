import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials missing:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseAnonKey
    });
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test the connection
supabase.from('questions').select('count(*)', { count: 'exact', head: true })
    .then(({ count, error }) => {
        if (error) {
            console.error('Supabase connection test failed:', error);
        } else {
            console.log('Supabase connection successful, questions count:', count);
        }
    });

export default supabase;
