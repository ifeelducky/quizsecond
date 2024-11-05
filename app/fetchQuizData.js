import supabase from './supabaseClient';

export async function fetchQuizData() {
    try {
        // First, let's test if we can connect and get the count
        const { count, error: countError } = await supabase
            .from('questions')
            .select('*', { count: 'exact', head: true });

        if (countError) {
            console.error('Count error:', {
                message: countError.message,
                details: countError.details,
                hint: countError.hint
            });
            return null;
        }

        console.log('Found questions count:', count); // This will help us debug

        // If we can get the count, proceed with full data fetch
        const { data, error } = await supabase
            .from('questions')
            .select('*');

        if (error) {
            console.error('Fetch error:', {
                message: error.message,
                details: error.details,
                hint: error.hint
            });
            return null;
        }

        if (!data || data.length === 0) {
            console.error('No data returned from Supabase');
            // Fallback to local data if no data in Supabase
            const { quiz } = await import('./data.js');
            console.log('Using fallback data');
            return quiz;
        }

        const quiz = {
            totalQuestions: data.length,
            questions: data.map((item) => ({
                id: item.id,
                question: item.question,
                answers: [
                    item.answer1,
                    item.answer2,
                    item.answer3,
                    item.answer4
                ].filter(Boolean), 
                correctAnswer: item.correctAnswer
            }))
        };

        return quiz;
    } catch (err) {
        console.error('Unexpected error:', err);
        // Fallback to local data if error occurs
        const { quiz } = await import('./data.js');
        console.log('Using fallback data due to error');
        return quiz;
    }
}
