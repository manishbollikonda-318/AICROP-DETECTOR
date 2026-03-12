import React, { useState } from 'react'
import { motion } from 'framer-motion'

const existingReviews = [
    { name: 'Rajesh Kumar', location: 'Punjab', rating: 5, text: 'AICROP-DETECTOR helped me increase my wheat yield by 30%! The AI recommendations were spot-on for my soil type.', crop: '🌾 Wheat', time: '2 weeks ago' },
    { name: 'Lakshmi Devi', location: 'Andhra Pradesh', rating: 5, text: 'The Plant Doctor feature saved my tomato crop from early blight. Detected it before visible damage!', crop: '🍅 Tomato', time: '1 month ago' },
    { name: 'Sukhbir Singh', location: 'Haryana', rating: 4, text: 'Very useful tool for planning Kharif season. The cost calculator helped me budget my fertilizer expenses.', crop: '🌽 Maize', time: '3 weeks ago' },
    { name: 'Priya Sharma', location: 'Rajasthan', rating: 5, text: 'Best farming app I\'ve used! The weather integration with crop planning is genius. Saved my crops from unexpected frost.', crop: '🥜 Groundnut', time: '5 days ago' },
    { name: 'Mohammed Iqbal', location: 'Karnataka', rating: 4, text: 'The AI chatbot answered all my questions about soil health. Great support for new farmers like me.', crop: '☕ Coffee', time: '1 week ago' },
    { name: 'Anita Patel', location: 'Gujarat', rating: 5, text: 'Cotton prices prediction was incredibly accurate. Made ₹50k more profit by timing my sale right!', crop: '🏵️ Cotton', time: '2 months ago' },
]

export default function FeedbackPage() {
    const [formData, setFormData] = useState({ name: '', location: '', rating: 5, text: '', crop: '' })
    const [submitted, setSubmitted] = useState(false)
    const [reviews, setReviews] = useState(existingReviews)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!formData.name || !formData.text) return
        setReviews(prev => [{
            ...formData,
            time: 'Just now',
        }, ...prev])
        setSubmitted(true)
        setFormData({ name: '', location: '', rating: 5, text: '', crop: '' })
        setTimeout(() => setSubmitted(false), 3000)
    }

    return (
        <section className="min-h-screen pt-28 pb-20 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <span className="text-4xl mb-4 inline-block">💬</span>
                    <h1 className="font-display text-4xl sm:text-5xl font-black mb-4"
                        style={{ color: 'var(--text-primary)' }}>
                        Farmer{' '}
                        <span style={{
                            background: 'var(--gradient-neon)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>Community</span>
                    </h1>
                    <p className="font-body text-base opacity-60 max-w-xl mx-auto"
                        style={{ color: 'var(--text-primary)' }}>
                        Share your experience and hear from fellow farmers across India
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Submit Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2"
                    >
                        <div className="glass-card p-8 sticky top-28">
                            <h2 className="font-display text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                                ✍️ Share Your Experience
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                                    required
                                    className="w-full px-4 py-3 rounded-xl text-sm font-body outline-none"
                                    style={{ background: 'var(--bg-glass)', color: 'var(--text-primary)', border: '1px solid var(--border-glass)' }}
                                    id="feedback-name"
                                />
                                <input
                                    type="text"
                                    placeholder="Your Location (e.g., Punjab)"
                                    value={formData.location}
                                    onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl text-sm font-body outline-none"
                                    style={{ background: 'var(--bg-glass)', color: 'var(--text-primary)', border: '1px solid var(--border-glass)' }}
                                />
                                <input
                                    type="text"
                                    placeholder="Your Crop (e.g., 🌾 Wheat)"
                                    value={formData.crop}
                                    onChange={e => setFormData(p => ({ ...p, crop: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl text-sm font-body outline-none"
                                    style={{ background: 'var(--bg-glass)', color: 'var(--text-primary)', border: '1px solid var(--border-glass)' }}
                                />

                                {/* Star Rating */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 opacity-70" style={{ color: 'var(--text-primary)' }}>Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setFormData(p => ({ ...p, rating: star }))}
                                                className="text-2xl hover:scale-125 transition-transform"
                                            >
                                                {star <= formData.rating ? '⭐' : '✩'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <textarea
                                    placeholder="Tell us about your experience..."
                                    value={formData.text}
                                    onChange={e => setFormData(p => ({ ...p, text: e.target.value }))}
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl text-sm font-body outline-none resize-none"
                                    style={{ background: 'var(--bg-glass)', color: 'var(--text-primary)', border: '1px solid var(--border-glass)' }}
                                    id="feedback-text"
                                />

                                <motion.button
                                    type="submit"
                                    className={`w-full py-3 rounded-xl font-display font-bold text-sm transition-all ${submitted ? 'bg-green-500' : ''
                                        }`}
                                    style={{
                                        background: submitted ? '#4ade80' : 'var(--gradient-neon)',
                                        color: '#0a0f0d',
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {submitted ? '✅ Thank you!' : '📤 Submit Feedback'}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Reviews List */}
                    <div className="lg:col-span-3 space-y-4">
                        <h2 className="font-display text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                            🌟 Community Reviews ({reviews.length})
                        </h2>
                        {reviews.map((review, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="glass-card p-6"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm"
                                            style={{ background: 'var(--gradient-neon)', color: '#0a0f0d' }}>
                                            {review.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-display text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                                                {review.name}
                                            </div>
                                            <div className="text-xs font-mono opacity-40" style={{ color: 'var(--text-primary)' }}>
                                                {review.location} • {review.time}
                                            </div>
                                        </div>
                                    </div>
                                    {review.crop && (
                                        <span className="glass px-3 py-1 rounded-full text-xs font-mono" style={{ color: 'var(--neon-primary)' }}>
                                            {review.crop}
                                        </span>
                                    )}
                                </div>
                                <div className="mb-2">
                                    {'⭐'.repeat(review.rating)}{'✩'.repeat(5 - review.rating)}
                                </div>
                                <p className="text-sm font-body opacity-70 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                                    "{review.text}"
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
