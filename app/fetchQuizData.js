import supabase from './supabaseClient';

export async function fetchQuizData() {
    const { data, error } = await supabase
        .from('questions')
        .select('*');

    if (error) {
        console.error('Error fetching data:', error);
        return null;
    }

    const quiz = {
        totalQuestions: data.length,
        questions: data.map((item) => ({
            id: item.id,
            question: item.question,
            //combine the answer fileds into an array
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
}
