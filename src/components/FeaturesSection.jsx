import React, { useRef } from 'react'
import { motion } from 'framer-motion'

const features = [
    {
        emoji: '🌤️',
        title: 'Weather Integration',
        desc: 'Real-time weather data synced with your farm location. Get hyper-local forecasts and climate alerts.',
        gradient: 'linear-gradient(135deg, #87CEEB, #00fff2)',
        icon: '⛅',
    },
    {
        emoji: '🤖',
        title: 'AI Recommendation Engine',
        desc: 'Our neural networks analyze soil, climate & market data to recommend the perfect crops for your land.',
        gradient: 'linear-gradient(135deg, #00ff88, #7fff00)',
        icon: '🧠',
    },
    {
        emoji: '📈',
        title: 'Crop Price Trends',
        desc: 'Track market prices in real-time. Our AI predicts price movements so you can sell at peak profit.',
        gradient: 'linear-gradient(135deg, #7fff00, #00ffa3)',
        icon: '💹',
    },
    {
        emoji: '🔔',
        title: 'Smart Alerts',
        desc: 'Never miss critical farm events. Get AI-powered notifications for weather, pests, and market changes.',
        gradient: 'linear-gradient(135deg, #FFD700, #FFA500)',
        icon: '⚡',
    },
    {
        emoji: '📸',
        title: 'Plant Doctor',
        desc: 'Snap a photo, get an instant AI diagnosis. Detect diseases early with 98% accuracy using computer vision.',
        gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
        icon: '🔬',
    },
    {
        emoji: '💬',
        title: 'Farmer Community',
        desc: 'Connect with thousands of farmers. Share knowledge, trade tips, and grow together as a community.',
        gradient: 'linear-gradient(135deg, #a29bfe, #6c5ce7)',
        icon: '🌐',
    },
]

function TiltCard({ feature, index }) {
    const cardRef = useRef(null)

    const handleMouseMove = (e) => {
        const card = cardRef.current
        if (!card) return
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const rotateX = (y - centerY) / centerY * -8
        const rotateY = (x - centerX) / centerX * 8
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
    }

    const handleMouseLeave = () => {
        const card = cardRef.current
        if (card) card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)'
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="tilt-card"
        >
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="glass-card p-8 h-full cursor-pointer relative overflow-hidden group"
                style={{ transition: 'transform 0.15s ease-out, box-shadow 0.4s ease' }}
            >
                {/* Top gradient line */}
                <div className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: feature.gradient }} />

                {/* Icon */}
                <motion.div
                    className="tilt-card-icon text-5xl mb-6 inline-block"
                    style={{ transition: 'transform 0.3s ease' }}
                    whileHover={{ scale: 1.2 }}
                >
                    {feature.emoji}
                </motion.div>

                {/* Title */}
                <h3 className="font-display text-xl font-bold mb-3"
                    style={{ color: 'var(--text-primary)' }}>
                    {feature.title}
                </h3>

                {/* Description */}
                <p className="font-body text-sm leading-relaxed opacity-60"
                    style={{ color: 'var(--text-primary)' }}>
                    {feature.desc}
                </p>

                {/* Floating icon on hover */}
                <div className="absolute -bottom-8 -right-8 text-7xl opacity-0 group-hover:opacity-10 transition-all duration-500 group-hover:-translate-y-4">
                    {feature.icon}
                </div>

                {/* Bottom CTA */}
                <div className="mt-6 flex items-center gap-2 text-xs font-mono font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                    style={{ color: 'var(--neon-primary)' }}>
                    Learn more
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </motion.div>
    )
}

export default function FeaturesSection() {
    return (
        <section id="features" className="section-wrapper py-32 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block glass px-4 py-2 rounded-full text-xs font-mono mb-6"
                        style={{ color: 'var(--neon-primary)' }}
                    >
                        ✦ FEATURES
                    </motion.span>

                    <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black mb-6"
                        style={{ color: 'var(--text-primary)' }}>
                        Everything you need to{' '}
                        <span style={{
                            background: 'var(--gradient-neon)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            grow smart.
                        </span>
                    </h2>

                    <p className="font-body text-lg opacity-60 max-w-2xl mx-auto"
                        style={{ color: 'var(--text-primary)' }}>
                        From weather forecasting to disease detection, we've got every aspect of modern farming covered.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <TiltCard key={feature.title} feature={feature} index={i} />
                    ))}
                </div>
            </div>
        </section>
    )
}
