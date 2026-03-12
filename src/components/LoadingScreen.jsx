import React, { useEffect, useState } from 'react'
import { useAppStore } from '../store/useAppStore'

export default function LoadingScreen() {
    const { loaded } = useAppStore()
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    return 100
                }
                return prev + Math.random() * 15
            })
        }, 100)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className={`loading-screen ${loaded ? 'hidden' : ''}`}
            style={{ background: 'var(--bg-primary)' }}>
            <div className="flex flex-col items-center gap-8">
                {/* Animated Logo */}
                <div className="relative">
                    <div className="loading-ring"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-3xl">
                        🌱
                    </div>
                </div>

                {/* Brand */}
                <h1 className="font-display text-3xl font-bold"
                    style={{
                        background: 'var(--gradient-neon)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                    AICROP-DETECTOR
                </h1>

                {/* Progress Bar */}
                <div className="w-64 h-1 rounded-full overflow-hidden"
                    style={{ background: 'rgba(0,255,136,0.1)' }}>
                    <div className="h-full rounded-full transition-all duration-300 ease-out"
                        style={{
                            width: `${Math.min(progress, 100)}%`,
                            background: 'var(--gradient-neon)',
                            boxShadow: '0 0 20px rgba(0,255,136,0.5)'
                        }} />
                </div>

                <p className="loading-text text-sm">
                    Initializing Digital Farm...
                </p>
            </div>
        </div>
    )
}
