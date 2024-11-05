'use client';
import React, { useState, useEffect, useRef } from 'react';
import { fetchQuizData } from '../fetchQuizData';
import supabase from '../supabaseClient';
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter();
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
    const [timeLeft, setTimeLeft] = useState(15);
    const timerRef = useRef(null);
    const isMovingRef = useRef(false);
    const [submitError, setSubmitError] = useState(null);

    useEffect(() => {
        // Check for nickname first
        const storedNickname = localStorage.getItem('nickname');
        if (!storedNickname) {
            router.push('/');
            return;
        }
        setNickname(storedNickname);

        // Load quiz data
        const loadQuizData = async () => {
            const quiz = await fetchQuizData();
            if (quiz) {
                setQuestions(quiz.questions);
            }
        };
        loadQuizData();
    }, [router]);

    // Timer effect
    useEffect(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        if (!showResult && questions.length > 0 && !isMovingRef.current) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        if (!isMovingRef.current) {
                            isMovingRef.current = true;
                            handleTimeOut();
                        }
                        return 1;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [activeQuestion, showResult, questions.length]);

    const handleTimeOut = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        // If answer was selected, use that. Otherwise, count as wrong
        if (!checked) {
            setResult((prev) => ({
                ...prev,
                wrongAnswers: prev.wrongAnswers + 1,
            }));
        } else {
            setResult((prev) =>
                selectedAnswer
                    ? {
                          ...prev,
                          score: prev.score + 5 + timeLeft, // Add time bonus for correct answer
                          correctAnswers: prev.correctAnswers + 1,
                      }
                    : {
                          ...prev,
                          wrongAnswers: prev.wrongAnswers + 1,
                      }
            );
        }
        
        setTimeout(() => {
            if (activeQuestion < questions.length - 1) {
                setActiveQuestion((prev) => prev + 1);
                setSelectedAnswerIndex(null);
                setChecked(false);
                setTimeLeft(15);
                isMovingRef.current = false;
            } else {
                handleFinish();
            }
        }, 0);
    };

    const { question, answers, correctAnswer } = questions[activeQuestion] || {};

    const onAnswerSelected = (answer, idx) => {
        setChecked(true);
        setSelectedAnswerIndex(idx);
        setSelectedAnswer(answer === correctAnswer);
    };

    const nextQuestion = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        setResult((prev) =>
            selectedAnswer
                ? {
                      ...prev,
                      score: prev.score + 5 + timeLeft, // Add time bonus for correct answer
                      correctAnswers: prev.correctAnswers + 1,
                  }
                : {
                      ...prev,
                      wrongAnswers: prev.wrongAnswers + 1,
                  }
        );

        if (activeQuestion < questions.length - 1) {
            setActiveQuestion((prev) => prev + 1);
            setSelectedAnswerIndex(null);
            setChecked(false);
            setTimeLeft(15);
        } else {
            handleFinish();
        }
    };

    const handleFinish = async () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        try {
            await submitScore(nickname, result.score);
            setShowResult(true);
            setSubmitError(null);
        } catch (error) {
            console.error('Error in handleFinish:', error);
            setSubmitError('Failed to submit score. Please try again.');
            setShowResult(true); // Still show results even if submission fails
        }
    };

    const submitScore = async (nickname, score) => {
        console.log('Attempting to submit score:', { nickname, score });
        
        try {
            const { data, error } = await supabase
                .from('leaderboard')
                .insert([{ 
                    nickname: nickname,
                    score: score,
                    created_at: new Date().toISOString()
                }])
                .select();

            if (error) {
                console.error('Error submitting score:', {
                    message: error.message,
                    details: error.details,
                    hint: error.hint
                });
                throw error;
            }

            console.log('Score submitted successfully:', data);
        } catch (err) {
            console.error('Unexpected error in submitScore:', err);
            throw err;
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
                {!showResult && questions.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <div className='timer' style={{ 
                            color: timeLeft <= 5 ? '#ff4444' : '#333',
                            fontWeight: 'bold',
                            fontSize: '1.5rem',
                            marginBottom: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: '#f8f9fa',
                            borderRadius: '4px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            display: 'inline-block',
                            minWidth: '200px',
                            textAlign: 'center'
                        }}>
                            Time Remaining: {timeLeft}s
                        </div>
                        <div style={{
                            fontSize: '0.9rem',
                            color: '#666',
                            textAlign: 'center'
                        }}>
                            Correct answers earn 5 points + remaining seconds as bonus!
                        </div>
                    </div>
                )}
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
                        {submitError && (
                            <p style={{ color: 'red', marginTop: '1rem' }}>{submitError}</p>
                        )}
                        <button onClick={() => window.location.reload()}>Restart</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;
