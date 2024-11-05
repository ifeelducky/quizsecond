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

// Test the questions table connection
supabase.from('questions').select('count(*)', { count: 'exact', head: true })
    .then(({ count, error }) => {
        if (error) {
            console.error('Questions table connection test failed:', error);
        } else {
            console.log('Questions table connection successful, count:', count);
        }
    })
    .catch(err => {
        console.error('Questions table connection test error:', err);
    });

// Test the leaderboard table connection
supabase.from('leaderboard').select('count(*)', { count: 'exact', head: true })
    .then(({ count, error }) => {
        if (error) {
            console.error('Leaderboard table connection test failed:', error);
        } else {
            console.log('Leaderboard table connection successful, count:', count);
        }
    })
    .catch(err => {
        console.error('Leaderboard table connection test error:', err);
    });

export default supabase;
