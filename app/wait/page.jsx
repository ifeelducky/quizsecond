'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../supabaseClient';

const WaitPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const channel = supabase
            .channel('quiz_channel') // Create a channel for your quiz
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'quiz_state' }, (payload) => {
                console.log('Payload received:', payload);


                if (payload.new.is_active===true)  {
                    router.push('/quiz'); // Redirect to the quiz page when the quiz starts
                }
            })
            .subscribe((status) => {
                console.log('Channel status:', status);
                if (status === 'SUBSCRIBED') {
                    setLoading(false); // Set loading to false once subscribed
                }
            });

        // Cleanup function to unsubscribe from the channel when the component unmounts
        return () => {
            channel.unsubscribe();
        };
    }, [router]);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            {loading ? (
                <h2>Please wait for the quiz to start...</h2>
            ) : (
                <h2>Waiting for the quiz to begin...</h2>
            )}
            {error && <h2>Error loading quiz state. Please try again later.</h2>}
        </div>
    );
};

export default WaitPage;
