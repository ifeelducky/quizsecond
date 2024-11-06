'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const NicknameInput = () => {
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (nickname.trim()) {
            localStorage.setItem('nickname', nickname.trim());
            router.push('/wait');
        } else {
            setError('Please enter a valid nickname');
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setNickname(value);
        if (value.trim()) {
            setError('');
        }
    };

    return (
        <div className="container">
            <div className="logo"></div>
            <h1>Welcome to the Quiz</h1>
            <div className="quiz-container">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={nickname}
                        onChange={handleInputChange}
                        placeholder="Enter your nickname"
                        className={error ? 'error' : ''}
                    />
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}
                    <button type="submit">
                        Start Quiz
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NicknameInput;
