import React from 'react'
import { motion } from 'framer-motion'

const steps = [
    {
        number: '01',
        title: 'Input Your Data',
        desc: 'Drop a pin on your farm location, enter soil type, and current conditions. Our system ingests everything.',
        emoji: '📍',
        visual: '🌍',
        color: '#4ade80',
    },
    {
        number: '02',
        title: 'AI Analysis',
        desc: 'Our neural network scans millions of data points — weather patterns, soil chemistry, market trends, and historical yields.',
        emoji: '🧬',
        visual: '🔬',
        color: '#00fff2',
    },
    {
        number: '03',
        title: 'Get Results',
        desc: 'Receive personalized crop recommendations, profit predictions, and a complete farming strategy. Maximize your yield.',
        emoji: '💰',
        visual: '🏆',
        color: '#7fff00',
    },
]

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="section-wrapper py-32 relative">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[800px] opacity-5 pointer-events-none"
                style={{
                    background: 'linear-gradient(to bottom, var(--neon-primary), var(--neon-secondary), var(--neon-accent))',
                    filter: 'blur(100px)',
                }} />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
                        ✦ HOW IT WORKS
                    </motion.span>

                    <h2 className="font-display text-4xl sm:text-5xl font-black mb-6"
                        style={{ color: 'var(--text-primary)' }}>
                        Three steps to{' '}
                        <span style={{
                            background: 'var(--gradient-neon)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            smarter farming.
                        </span>
                    </h2>
                </motion.div>

                {/* Steps */}
                <div className="relative step-path">
                    {/* Glowing center line */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
                        style={{
                            background: 'linear-gradient(to bottom, transparent, var(--neon-primary), var(--neon-secondary), transparent)',
                            opacity: 0.3,
                            boxShadow: '0 0 10px var(--neon-primary)',
                        }} />

                    <div className="space-y-20">
                        {steps.map((step, i) => (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-100px' }}
                                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                                className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''
                                    }`}
                            >
                                {/* Text Side */}
                                <div className="flex-1 text-center md:text-left">
                                    <div className="inline-flex items-center gap-3 mb-4">
                                        <span className="font-mono text-sm font-bold px-3 py-1 rounded-full"
                                            style={{
                                                color: step.color,
                                                background: `${step.color}15`,
                                                border: `1px solid ${step.color}30`,
                                            }}>
                                            {step.number}
                                        </span>
                                        <span className="text-2xl">{step.emoji}</span>
                                    </div>
                                    <h3 className="font-display text-2xl sm:text-3xl font-bold mb-4"
                                        style={{ color: 'var(--text-primary)' }}>
                                        {step.title}
                                    </h3>
                                    <p className="font-body text-base opacity-60 leading-relaxed max-w-md"
                                        style={{ color: 'var(--text-primary)' }}>
                                        {step.desc}
                                    </p>
                                </div>

                                {/* Visual Side */}
                                <motion.div
                                    className="flex-shrink-0"
                                    whileInView={{ rotate: [0, 5, 0] }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 2, ease: "easeInOut" }}
                                >
                                    <div className="glass-card w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center relative group">
                                        <span className="text-6xl sm:text-7xl group-hover:scale-110 transition-transform duration-500"
                                            style={{ filter: `drop-shadow(0 0 20px ${step.color}60)` }}>
                                            {step.visual}
                                        </span>

                                        {/* Pulse rings */}
                                        <div className="absolute inset-0 rounded-[20px] animate-ping opacity-10"
                                            style={{ border: `2px solid ${step.color}` }} />

                                        {/* Corner dots */}
                                        <div className="absolute top-3 left-3 w-2 h-2 rounded-full"
                                            style={{ background: step.color, boxShadow: `0 0 10px ${step.color}` }} />
                                        <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full"
                                            style={{ background: step.color, boxShadow: `0 0 10px ${step.color}` }} />
                                    </div>
                                </motion.div>

                                {/* Center Node (on the line) */}
                                <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full z-10"
                                    style={{
                                        background: step.color,
                                        boxShadow: `0 0 15px ${step.color}, 0 0 30px ${step.color}50`,
                                        top: `${(i / (steps.length - 1)) * 100}%`,
                                    }} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
