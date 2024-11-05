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
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
    },
    global: {
        headers: {
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'apikey': supabaseAnonKey,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        }
    }
});

// Log the configuration for debugging
console.log('Supabase Configuration:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    baseUrl: supabase.supabaseUrl
});

// Test the questions table connection with explicit headers
const testConnection = async () => {
    try {
        const { data: questionsCount, error: questionsError } = await supabase
            .from('questions')
            .select('*', { count: 'exact', head: true });

        if (questionsError) {
            console.error('Questions table test failed:', questionsError);
        } else {
            console.log('Questions table test successful');
        }

        const { data: leaderboardCount, error: leaderboardError } = await supabase
            .from('leaderboard')
            .select('*', { count: 'exact', head: true });

        if (leaderboardError) {
            console.error('Leaderboard table test failed:', leaderboardError);
        } else {
            console.log('Leaderboard table test successful');
        }
    } catch (err) {
        console.error('Connection test error:', err);
    }
};

testConnection();

export default supabase;
