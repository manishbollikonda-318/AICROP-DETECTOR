import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

export default function LoginPage() {
    const { login } = useAppStore()
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')
        if (!form.email || !form.password) {
            setError('Please fill in all fields')
            return
        }
        setLoading(true)
        setTimeout(() => {
            login({ email: form.email, name: form.email.split('@')[0] })
            setLoading(false)
            navigate('/')
        }, 1500)
    }

    return (
        <section className="min-h-screen pt-28 pb-20 px-4 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="glass-card p-10 w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <span className="text-4xl mb-3 inline-block">🔑</span>
                    <h1 className="font-display text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
                        Welcome Back
                    </h1>
                    <p className="text-sm font-body opacity-60" style={{ color: 'var(--text-primary)' }}>
                        Login to your AICROP-DETECTOR account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-mono font-medium mb-2 opacity-60" style={{ color: 'var(--text-primary)' }}>Email</label>
                        <input
                            type="email"
                            placeholder="farmer@example.com"
                            value={form.email}
                            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl text-sm font-body outline-none transition-all focus:ring-2"
                            style={{
                                background: 'var(--bg-glass)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border-glass)',
                            }}
                            id="login-email"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-mono font-medium mb-2 opacity-60" style={{ color: 'var(--text-primary)' }}>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl text-sm font-body outline-none transition-all"
                            style={{
                                background: 'var(--bg-glass)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border-glass)',
                            }}
                            id="login-password"
                        />
                    </div>

                    {error && (
                        <div className="text-xs text-red-400 font-mono text-center">{error}</div>
                    )}

                    <motion.button
                        type="submit"
                        disabled={loading}
                        className="btn-neon-filled w-full py-3 disabled:opacity-50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#0a0f0d', borderTopColor: 'transparent' }} />
                                Logging in...
                            </span>
                        ) : '🔓 Login'}
                    </motion.button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm font-body opacity-50" style={{ color: 'var(--text-primary)' }}>
                        Don't have an account?{' '}
                        <Link to="/register" className="font-bold hover:underline" style={{ color: 'var(--neon-primary)' }}>
                            Sign Up
                        </Link>
                    </p>
                </div>
            </motion.div>
        </section>
    )
}
