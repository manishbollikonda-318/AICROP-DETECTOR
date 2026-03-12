import React, { useEffect, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

const holoCards = [
    { emoji: '🌾', crop: 'Rice', status: 'Low Risk', color: '#4ade80' },
    { emoji: '🌿', crop: 'Wheat', status: 'Optimal', color: '#00fff2' },
    { emoji: '🌽', crop: 'Maize', status: 'High Yield', color: '#7fff00' },
    { emoji: '🍅', crop: 'Tomato', status: 'Monitor', color: '#ff6b6b' },
]

const heroWords = ['Next-Gen', 'AI-Powered', 'Climate-Smart', 'Data-Driven']
const heroColors = ['var(--neon-primary)', 'var(--neon-secondary)', '#7fff00', '#ffdd44']

export default function HeroSection() {
    const { mouseX, mouseY, scrollProgress } = useAppStore()
    const navigate = useNavigate()
    const [wordIndex, setWordIndex] = useState(0)
    const [typedText, setTypedText] = useState('')
    const [isTyping, setIsTyping] = useState(true)

    // Cycle through hero words with typing effect
    useEffect(() => {
        const word = heroWords[wordIndex]
        let timeout

        if (isTyping) {
            timeout = setTimeout(() => {
                if (typedText === word) {
                    setTimeout(() => setIsTyping(false), 2000)
                } else {
                    setTypedText(word.slice(0, typedText.length + 1))
                }
            }, 80)
        } else {
            timeout = setTimeout(() => {
                if (typedText === '') {
                    setWordIndex((prev) => (prev + 1) % heroWords.length)
                    setIsTyping(true)
                } else {
                    setTypedText(typedText.slice(0, -1))
                }
            }, 40)
        }

        return () => clearTimeout(timeout)
    }, [typedText, isTyping, wordIndex])

    // Parallax values synced with 3D scene scroll
    const textY = scrollProgress * -150
    const textOpacity = Math.max(0, 1 - scrollProgress * 3)
    const textScale = Math.max(0.8, 1 - scrollProgress * 0.5)

    return (
        <section id="hero" className="min-h-screen relative overflow-hidden pt-24 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left — Text synced with 3D */}
                    <motion.div
                        initial={{ opacity: 0, x: -60 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
                        className="relative z-10"
                        style={{
                            transform: `translateY(${textY}px) scale(${textScale})`,
                            opacity: textOpacity,
                            transition: 'opacity 0.1s, transform 0.1s',
                        }}
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8"
                        >
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-xs font-mono font-medium" style={{ color: 'var(--neon-primary)' }}>
                                AI-Powered Agriculture Platform
                            </span>
                        </motion.div>

                        {/* Main Heading with typing effect */}
                        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6">
                            <motion.span
                                key={wordIndex}
                                style={{
                                    color: heroColors[wordIndex],
                                    filter: `drop-shadow(0 0 30px ${heroColors[wordIndex]}40)`,
                                    display: 'inline-block',
                                    minWidth: '280px',
                                }}
                            >
                                {typedText}
                                <span className="animate-pulse" style={{ color: heroColors[wordIndex] }}>|</span>
                            </motion.span>
                            <br />
                            <span style={{ color: 'var(--text-primary)' }}>Agriculture.</span>
                            <br />
                            <span className="text-3xl sm:text-4xl lg:text-5xl font-bold opacity-80"
                                style={{ color: 'var(--text-secondary)' }}>
                                AI Powered Smart Farming.
                            </span>
                        </h1>

                        {/* Sub text */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="text-lg font-body opacity-70 mb-10 max-w-xl leading-relaxed"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            Harness the power of artificial intelligence to optimize your crop yield,
                            predict diseases before they spread, and make data-driven farming decisions.
                            <br />
                            <span className="text-sm opacity-60 font-mono mt-2 inline-block">
                                🌍 Supporting 500+ crop varieties worldwide
                            </span>
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.4 }}
                            className="flex flex-col gap-4"
                        >
                            {/* Top row: Planning + Doctor */}
                            <div className="flex flex-wrap gap-4">
                                <Link to="/planner">
                                    <motion.button
                                        className="btn-neon-filled text-base"
                                        whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(0,255,136,0.5)' }}
                                        whileTap={{ scale: 0.95 }}
                                        id="start-planning-btn"
                                    >
                                        🚀 Start Planning
                                    </motion.button>
                                </Link>
                                <Link to="/doctor">
                                    <motion.button
                                        className="btn-neon text-base"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        id="upload-plant-btn"
                                    >
                                        <span>🔬 Plant Doctor AI</span>
                                    </motion.button>
                                </Link>
                            </div>

                            {/* Large Features Button — navigates to Plant Doctor (core feature) */}
                            <motion.button
                                id="explore-features-btn"
                                onClick={() => navigate('/doctor')}
                                className="w-full relative overflow-hidden rounded-2xl py-4 px-6 text-left group"
                                style={{
                                    border: '1.5px solid var(--neon-primary)',
                                    background: 'rgba(0,255,136,0.05)',
                                    backdropFilter: 'blur(10px)',
                                }}
                                whileHover={{ scale: 1.02, background: 'rgba(0,255,136,0.10)' }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                {/* Animated gradient sweep on hover */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{ background: 'linear-gradient(90deg, transparent, rgba(0,255,136,0.08), transparent)' }} />

                                <div className="relative flex items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="text-lg">🚀</span>
                                            <span className="font-display text-base font-bold"
                                                style={{ color: 'var(--neon-primary)' }}>
                                                Explore All Features
                                            </span>
                                        </div>
                                        {/* Feature quick-links row — each navigates to its page */}
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                { emoji: '🌾', label: 'Crop Planner', path: '/planner' },
                                                { emoji: '🔬', label: 'Plant Doctor', path: '/doctor' },
                                                { emoji: '📊', label: 'Calculator', path: '/calculator' },
                                                { emoji: '🌍', label: 'Encyclopedia', path: '/encyclopedia' },
                                            ].map((f) => (
                                                <Link
                                                    key={f.label}
                                                    to={f.path}
                                                    className="text-xs font-mono px-2 py-0.5 rounded-lg hover:scale-105 transition-transform duration-200"
                                                    style={{ background: 'rgba(0,255,136,0.1)', color: 'var(--neon-primary)' }}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {f.emoji} {f.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Arrow */}
                                    <motion.div
                                        animate={{ x: [0, 6, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                        className="text-2xl flex-shrink-0"
                                        style={{ color: 'var(--neon-primary)' }}
                                    >
                                        →
                                    </motion.div>
                                </div>
                            </motion.button>
                        </motion.div>


                        {/* Quick Stats under CTA */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex gap-8 mt-8"
                        >
                            {[
                                { num: '500+', label: 'Crop Varieties' },
                                { num: '50+', label: 'Countries' },
                                { num: '98%', label: 'AI Accuracy' },
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="font-display text-lg font-black" style={{ color: 'var(--neon-primary)' }}>
                                        {stat.num}
                                    </div>
                                    <div className="text-[10px] font-mono opacity-40" style={{ color: 'var(--text-primary)' }}>
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right — 3D Globe area + Floating cards */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
                        className="relative flex items-center justify-center min-h-[400px] lg:min-h-[500px]"
                        style={{
                            transform: `perspective(1000px) rotateY(${mouseX * 3}deg) rotateX(${mouseY * -3}deg) translateY(${textY * 0.3}px)`,
                            opacity: textOpacity,
                            transition: 'transform 0.3s ease-out',
                        }}
                    >
                        {/* Central Glow */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full opacity-30"
                                style={{
                                    background: 'radial-gradient(circle, var(--neon-primary) 0%, transparent 70%)',
                                    filter: 'blur(40px)',
                                }} />
                        </div>

                        {/* Rotating rings */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-dashed animate-spin-slow opacity-20"
                                style={{ borderColor: 'var(--neon-primary)' }} />
                            <div className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full border animate-spin-slow opacity-15"
                                style={{ borderColor: 'var(--neon-secondary)', animationDirection: 'reverse', animationDuration: '15s' }} />
                        </div>

                        {/* Center globe */}
                        <div className="relative z-10 text-8xl sm:text-9xl animate-float"
                            style={{ filter: 'drop-shadow(0 0 30px rgba(0,255,136,0.5))' }}>
                            🌍
                        </div>

                        {/* Holo Cards orbiting */}
                        {holoCards.map((card, i) => {
                            const angle = (i / holoCards.length) * Math.PI * 2
                            const radius = 160
                            const x = Math.cos(angle) * radius
                            const y = Math.sin(angle) * radius * 0.5
                            return (
                                <motion.div
                                    key={card.crop}
                                    className="holo-card absolute glass-card px-4 py-3 flex items-center gap-2 cursor-pointer"
                                    style={{
                                        left: `calc(50% + ${x}px - 60px)`,
                                        top: `calc(50% + ${y}px - 20px)`,
                                        animationDelay: `${i * -1}s`,
                                        zIndex: y > 0 ? 5 : 15,
                                    }}
                                    whileHover={{ scale: 1.1, zIndex: 20 }}
                                >
                                    <span className="text-lg">{card.emoji}</span>
                                    <div>
                                        <div className="text-xs font-bold font-display" style={{ color: 'var(--text-primary)' }}>
                                            {card.crop}
                                        </div>
                                        <div className="text-[10px] font-mono" style={{ color: card.color }}>
                                            {card.status}
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                    style={{ opacity: textOpacity }}
                >
                    <span className="text-xs font-mono opacity-50" style={{ color: 'var(--text-primary)' }}>
                        Scroll to explore
                    </span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-5 h-8 rounded-full border-2 flex justify-center pt-1.5"
                        style={{ borderColor: 'var(--neon-primary)' }}
                    >
                        <div className="w-1 h-2 rounded-full" style={{ background: 'var(--neon-primary)' }} />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
