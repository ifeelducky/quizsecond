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
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2rem'
        }}>
            <form 
                onSubmit={handleSubmit}
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}
            >
                <input
                    type="text"
                    value={nickname}
                    onChange={handleInputChange}
                    placeholder="Enter your nickname"
                    style={{
                        padding: '0.75rem',
                        fontSize: '1rem',
                        borderRadius: '4px',
                        border: `1px solid ${error ? '#ff4444' : '#ccc'}`,
                        width: '100%',
                        boxSizing: 'border-box'
                    }}
                />
                {error && (
                    <div style={{
                        color: '#ff4444',
                        fontSize: '0.875rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}
                <button 
                    type="submit"
                    style={{
                        padding: '0.75rem',
                        fontSize: '1rem',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        width: '100%',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                >
                    Start Quiz
                </button>
            </form>
        </div>
    );
};

export default NicknameInput;
