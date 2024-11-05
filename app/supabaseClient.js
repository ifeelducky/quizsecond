import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing environment variables:', {
        url: supabaseUrl ? 'present' : 'missing',
        key: supabaseAnonKey ? 'present' : 'missing'
    });
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: false
    },
    global: {
        headers: {
            'apikey': supabaseAnonKey
        }
    }
});

// Test the connection
supabase.from('questions').select('count(*)', { count: 'exact', head: true })
    .then(({ count, error }) => {
        if (error) {
            console.error('Supabase connection test failed:', error);
        } else {
            console.log('Supabase connection successful, questions count:', count);
        }
    })
    .catch(err => {
        console.error('Connection test error:', err);
    });

export default supabase;
