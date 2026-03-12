import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'

const footerLinks = {
    Product: ['Crop Planner', 'Plant Doctor', 'Price Calculator', 'Weather Dashboard', 'Smart Alerts'],
    Resources: ['Documentation', 'API Reference', 'Blog', 'Case Studies', 'Community Forum'],
    Company: ['About Us', 'Careers', 'Press Kit', 'Contact', 'Partners'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Data Security'],
}

export default function Footer() {
    const { darkMode } = useAppStore()
    const [formData, setFormData] = useState({ name: '', email: '', message: '' })
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 3000)
        setFormData({ name: '', email: '', message: '' })
    }

    return (
        <footer className="relative pt-32 pb-8" id="footer">
            {/* Top gradient divider */}
            <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'var(--gradient-neon)', opacity: 0.3 }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="glass-card p-10 sm:p-16 text-center mb-20 relative overflow-hidden"
                >
                    <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-10 blur-3xl"
                        style={{ background: 'var(--neon-primary)' }} />
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full opacity-10 blur-3xl"
                        style={{ background: 'var(--neon-secondary)' }} />

                    <h2 className="font-display text-3xl sm:text-5xl font-black mb-4 relative z-10"
                        style={{ color: 'var(--text-primary)' }}>
                        Designed for{' '}
                        <span style={{
                            background: 'var(--gradient-neon)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Farmer Success.
                        </span>
                    </h2>
                    <p className="font-body text-lg opacity-60 mb-8 max-w-2xl mx-auto relative z-10"
                        style={{ color: 'var(--text-primary)' }}>
                        Reduce Yield Risk. Maximize Profits. Predictive Disease Control.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 relative z-10">
                        <motion.button
                            className="btn-neon-filled"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            🚀 Get Started Free
                        </motion.button>
                        <motion.button
                            className="btn-neon"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>📞 Talk to Sales</span>
                        </motion.button>
                    </div>
                </motion.div>

                {/* Main Footer Grid */}
                <div className="grid lg:grid-cols-5 gap-12 mb-16">
                    {/* Hacker Terminal Feedback Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-2"
                    >
                        <h3 className="font-display text-lg font-bold mb-4"
                            style={{ color: 'var(--text-primary)' }}>
                            💻 Send Feedback
                        </h3>
                        <form onSubmit={handleSubmit} className="terminal-form p-6 space-y-4">
                            <div className="flex items-center gap-2 text-xs opacity-50 mb-2">
                                <span className="w-3 h-3 rounded-full bg-red-500/60" />
                                <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                <span className="w-3 h-3 rounded-full bg-green-500/60" />
                                <span className="ml-2">terminal@aicrop-detector ~ %</span>
                            </div>
                            <input
                                type="text"
                                placeholder="$ enter your name"
                                value={formData.name}
                                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                                id="feedback-name"
                            />
                            <input
                                type="email"
                                placeholder="$ enter your email"
                                value={formData.email}
                                onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                                id="feedback-email"
                            />
                            <textarea
                                placeholder="$ type your message..."
                                rows={3}
                                value={formData.message}
                                onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                                id="feedback-message"
                            />
                            <button
                                type="submit"
                                className="w-full py-3 rounded-lg font-mono text-sm font-bold transition-all hover:shadow-lg"
                                style={{
                                    background: submitted ? '#4ade80' : 'rgba(0,255,136,0.1)',
                                    color: submitted ? '#0a0f0d' : '#00ff88',
                                    border: '1px solid rgba(0,255,136,0.3)',
                                }}
                            >
                                {submitted ? '✓ Message sent!' : '> submit_feedback()'}
                            </button>
                        </form>
                    </motion.div>

                    {/* Link Columns */}
                    {Object.entries(footerLinks).map(([category, links], i) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 * (i + 1) }}
                        >
                            <h3 className="font-display text-sm font-bold uppercase tracking-wider mb-4 opacity-50"
                                style={{ color: 'var(--text-primary)' }}>
                                {category}
                            </h3>
                            <ul className="space-y-2.5">
                                {links.map(link => (
                                    <li key={link}>
                                        <a href="#"
                                            className="font-body text-sm opacity-50 hover:opacity-100 transition-all hover:translate-x-1 inline-block"
                                            style={{ color: 'var(--text-primary)' }}>
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
                    style={{ borderColor: 'var(--border-glass)' }}>
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🌱</span>
                        <span className="font-display text-sm font-bold"
                            style={{
                                background: 'var(--gradient-neon)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                            AICROP-DETECTOR
                        </span>
                    </div>
                    <p className="font-body text-xs opacity-40" style={{ color: 'var(--text-primary)' }}>
                        © 2026 AICROP-DETECTOR. All rights reserved. Made with 💚 for Indian farmers.
                    </p>
                    <div className="flex gap-4">
                        {['Twitter', 'GitHub', 'Discord'].map(social => (
                            <a key={social} href="#"
                                className="font-mono text-xs opacity-40 hover:opacity-100 transition-opacity"
                                style={{ color: 'var(--neon-primary)' }}>
                                {social}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
