'use client';
import React, { useState, useEffect } from 'react';
import { fetchQuizData } from '../fetchQuizData'; // Adjust the path if needed

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
    const [questions, setQuestions] = useState([]); // State to hold questions

    useEffect(() => {
        const loadQuizData = async () => {
            const quiz = await fetchQuizData();
            if (quiz) {
                setQuestions(quiz.questions); // Set the fetched questions
            }
        };
        loadQuizData();
    }, []);

    const { question, answers, correctAnswer } = questions[activeQuestion] || {};

    // Select and check answer
    const onAnswerSelected = (answer, idx) => {
        setChecked(true);
        setSelectedAnswerIndex(idx);
        setSelectedAnswer(answer === correctAnswer);
    };

    // Calculate score and increment to next question
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
            setActiveQuestion(0);
            setShowResult(true);
        }
        setChecked(false);
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
                        {question ? ( // Ensure question exists before rendering
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
                            <h3>Loading...</h3> // Loading state
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
