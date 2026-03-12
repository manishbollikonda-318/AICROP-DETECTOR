import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
    { value: 10000, suffix: '+', label: 'Farmers Helped', emoji: '👨‍🌾', color: '#4ade80' },
    { value: 50, suffix: '+', label: 'Crops Analyzed', emoji: '🌾', color: '#00fff2' },
    { value: 98, suffix: '%', label: 'Prediction Accuracy', emoji: '🎯', color: '#7fff00' },
    { value: 24, suffix: '/7', label: 'AI Support', emoji: '🤖', color: '#00ffa3' },
]

function AnimatedCounter({ value, suffix, duration = 2000, inView }) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!inView) return
        let start = 0
        const step = Math.ceil(value / (duration / 16))
        const timer = setInterval(() => {
            start += step
            if (start >= value) {
                setCount(value)
                clearInterval(timer)
            } else {
                setCount(start)
            }
        }, 16)
        return () => clearInterval(timer)
    }, [inView, value, duration])

    return (
        <span>
            {count.toLocaleString()}{suffix}
        </span>
    )
}

export default function StatsSection() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })

    return (
        <section id="stats" className="section-wrapper relative py-32" ref={ref}>
            {/* Background glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[600px] h-[600px] rounded-full opacity-10"
                    style={{
                        background: 'radial-gradient(circle, var(--neon-primary), transparent 70%)',
                        filter: 'blur(80px)',
                    }} />
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h2 className="font-display text-4xl sm:text-5xl font-black mb-4"
                        style={{ color: 'var(--text-primary)' }}>
                        Trusted by{' '}
                        <span style={{
                            background: 'var(--gradient-neon)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Thousands
                        </span>
                    </h2>
                    <p className="font-body text-lg opacity-60 max-w-2xl mx-auto"
                        style={{ color: 'var(--text-primary)' }}>
                        Real impact, real numbers. Our AI platform is transforming agriculture across India.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 60, scale: 0.8 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.15, ease: [0.4, 0, 0.2, 1] }}
                            className="glass-card p-8 text-center group"
                        >
                            {/* Emoji */}
                            <motion.div
                                className="text-4xl mb-4"
                                whileHover={{ scale: 1.3, rotate: 10 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                {stat.emoji}
                            </motion.div>

                            {/* Number */}
                            <div className="font-display text-4xl sm:text-5xl font-black mb-2"
                                style={{
                                    background: `linear-gradient(135deg, ${stat.color}, var(--neon-secondary))`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    filter: `drop-shadow(0 0 20px ${stat.color}40)`,
                                }}>
                                <AnimatedCounter
                                    value={stat.value}
                                    suffix={stat.suffix}
                                    inView={isInView}
                                />
                            </div>

                            {/* Label */}
                            <div className="font-body text-sm font-medium opacity-60"
                                style={{ color: 'var(--text-primary)' }}>
                                {stat.label}
                            </div>

                            {/* Bottom glow line */}
                            <div className="mt-4 h-0.5 w-0 group-hover:w-full transition-all duration-500 mx-auto rounded-full"
                                style={{ background: stat.color, boxShadow: `0 0 10px ${stat.color}` }} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
