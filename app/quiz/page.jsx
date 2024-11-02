'use client';
import React, { useState, useEffect } from 'react';
import { fetchQuizData } from '../fetchQuizData'; // Adjust the path if needed
import supabase from '../supabaseClient'; // Adjust the path if needed

const Page = () => {
    const [activeQuestion, setActiveQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [checked, setChecked] = useState(false);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState({
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
    });
    const [questions, setQuestions] = useState([]);
    const [nickname, setNickname] = useState('');

    useEffect(() => {
        const loadQuizData = async () => {
            const quiz = await fetchQuizData();
            if (quiz) {
                setQuestions(quiz.questions);
            }
        };
        loadQuizData();

        // Retrieve nickname from local storage
        const storedNickname = localStorage.getItem('nickname');
        if (storedNickname) {
            setNickname(storedNickname);
        } else {
            // Redirect back to the nickname input page if nickname isn't available
            window.location.href = '/'; // Go back to nickname input
        }
    }, []);

    const { question, answers, correctAnswer } = questions[activeQuestion] || {};

    const onAnswerSelected = (answer, idx) => {
        setChecked(true);
        setSelectedAnswerIndex(idx);
        setSelectedAnswer(answer === correctAnswer);
    };

    const nextQuestion = () => {
        setSelectedAnswerIndex(null);
        setResult((prev) =>
            selectedAnswer
                ? {
                      ...prev,
                      score: prev.score + 5,
                      correctAnswers: prev.correctAnswers + 1,
                  }
                : {
                      ...prev,
                      wrongAnswers: prev.wrongAnswers + 1,
                  }
        );

        if (activeQuestion < questions.length - 1) {
            setActiveQuestion((prev) => prev + 1);
        } else {
            handleFinish();
        }
        setChecked(false);
    };

    const handleFinish = async () => {
        await submitScore(nickname, result.score);
        setShowResult(true);
    };

    const submitScore = async (username, score) => {
        const { data, error } = await supabase
            .from('leaderboard')
            .insert([{ username, score }]);

        if (error) {
            console.error('Error submitting score:', error);
        }
    };

    return (
        <div className='container'>
            <h1>Quiz Page</h1>
            <div>
                <h2>
                    Question: {activeQuestion + 1}
                    <span>/{questions.length}</span>
                </h2>
            </div>
            <div>
                {!showResult ? (
                    <div className='quiz-container'>
                        {question ? (
                            <>
                                <h3>{question}</h3>
                                {answers && answers.map((answer, idx) => (
                                    <li
                                        key={idx}
                                        onClick={() => onAnswerSelected(answer, idx)}
                                        className={
                                            selectedAnswerIndex === idx ? 'li-selected' : 'li-hover'
                                        }
                                    >
                                        <span>{answer}</span>
                                    </li>
                                ))}
                                {checked ? (
                                    <button onClick={nextQuestion} className='btn'>
                                        {activeQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                                    </button>
                                ) : (
                                    <button disabled className='btn-disabled'>
                                        {activeQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                                    </button>
                                )}
                            </>
                        ) : (
                            <h3>Loading...</h3>
                        )}
                    </div>
                ) : (
                    <div className='quiz-container'>
                        <h3>Results</h3>
                        <h3>Overall {(result.score / (questions.length * 5)) * 100}%</h3>
                        <p>
                            Total Questions: <span>{questions.length}</span>
                        </p>
                        <p>
                            Total Score: <span>{result.score}</span>
                        </p>
                        <p>
                            Correct Answers: <span>{result.correctAnswers}</span>
                        </p>
                        <p>
                            Wrong Answers: <span>{result.wrongAnswers}</span>
                        </p>
                        <button onClick={() => window.location.reload()}>Restart</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;
