'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const NicknameInput = () => {
    const [nickname, setNickname] = useState('');
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (nickname) {
            // Store nickname in local storage or context if needed
            localStorage.setItem('nickname', nickname);
            router.push('/quiz'); // Navigate to the quiz page
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter your nickname"
                required
            />
            <button type="submit">Start Quiz</button>
        </form>
    );
};

export default NicknameInput;
