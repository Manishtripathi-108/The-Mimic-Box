'use client';
import React, { useState } from 'react';
import axios from 'axios';

const DevOnly = () => {
    const [loading, setLoading] = useState(false);

    const handleSpotifyAuth = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/auth-link-account/spotify?callbackUrl=/dev');
            if (res.data.success) {
                window.location.href = res.data.redirectUrl;
            }
        } catch (error) {
            console.error('Spotify Auth Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-calc-full-height grid place-items-center p-6">
            <button onClick={handleSpotifyAuth} type="button" className="button" disabled={loading}>
                {loading ? 'Redirecting...' : 'Anilist'}
            </button>
        </div>
    );
};

export default DevOnly;
