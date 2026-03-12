import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'

const botResponses = [
    "🌱 Hi! I'm SproutBot, your AI farming assistant! How can I help you today?",
    "🌤️ I can help with crop planning, weather alerts, disease detection, and market prices!",
    "📊 Just tell me your location and soil type, and I'll recommend the best crops for this season.",
    "🔬 Want to diagnose a plant disease? Upload a photo and I'll analyze it instantly!",
    "💡 Pro tip: Check our Smart Alerts feature to never miss critical farming events.",
]

export default function ChatWidget() {
    const { chatOpen, toggleChat } = useAppStore()
    const [messages, setMessages] = useState([
        { from: 'bot', text: botResponses[0], time: 'now' }
    ])
    const [input, setInput] = useState('')
    const [typing, setTyping] = useState(false)
    const chatEndRef = useRef(null)

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = (e) => {
        e.preventDefault()
        if (!input.trim()) return

        setMessages(prev => [...prev, { from: 'user', text: input, time: 'now' }])
        setInput('')
        setTyping(true)

        setTimeout(() => {
            setTyping(false)
            const response = botResponses[Math.floor(Math.random() * botResponses.length)]
            setMessages(prev => [...prev, { from: 'bot', text: response, time: 'now' }])
        }, 1500)
    }

    return (
        <div className="chat-widget">
            <AnimatePresence>
                {chatOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="chat-panel glass-strong"
                    >
                        {/* Header */}
                        <div className="p-4 flex items-center gap-3"
                            style={{
                                borderBottom: '1px solid var(--border-glass)',
                                background: 'rgba(0,255,136,0.05)',
                            }}>
                            <div className="relative">
                                <span className="text-2xl">🌱</span>
                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2"
                                    style={{ borderColor: 'var(--bg-primary)' }} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-display text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                                    SproutBot AI
                                </h4>
                                <p className="text-xs opacity-50 font-mono" style={{ color: 'var(--neon-primary)' }}>
                                    online • ready to help
                                </p>
                            </div>
                            <button onClick={toggleChat} className="opacity-50 hover:opacity-100 transition-opacity text-lg"
                                style={{ color: 'var(--text-primary)' }}>
                                ✕
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="h-72 overflow-y-auto p-4 space-y-3"
                            style={{ scrollbarWidth: 'thin' }}>
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm font-body ${msg.from === 'user'
                                            ? 'rounded-br-md'
                                            : 'rounded-bl-md'
                                        }`}
                                        style={{
                                            background: msg.from === 'user'
                                                ? 'var(--gradient-neon)'
                                                : 'var(--bg-glass-strong)',
                                            color: msg.from === 'user' ? '#0a0f0d' : 'var(--text-primary)',
                                            border: msg.from === 'bot' ? '1px solid var(--border-glass)' : 'none',
                                        }}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            {typing && (
                                <div className="flex gap-1 px-4 py-3 glass rounded-2xl rounded-bl-md w-fit">
                                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--neon-primary)', animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--neon-primary)', animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--neon-primary)', animationDelay: '300ms' }} />
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-3" style={{ borderTop: '1px solid var(--border-glass)' }}>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="Ask SproutBot anything..."
                                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-body outline-none transition-all"
                                    style={{
                                        background: 'var(--bg-glass)',
                                        color: 'var(--text-primary)',
                                        border: '1px solid var(--border-glass)',
                                    }}
                                    id="chat-input"
                                />
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2.5 rounded-xl font-bold text-sm"
                                    style={{
                                        background: 'var(--gradient-neon)',
                                        color: '#0a0f0d',
                                    }}
                                >
                                    ↑
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Trigger */}
            <motion.button
                onClick={toggleChat}
                className="chat-trigger"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={chatOpen ? { rotate: 45 } : { rotate: 0 }}
                id="chat-trigger-btn"
            >
                {chatOpen ? '✕' : '🌱'}
            </motion.button>
        </div>
    )
}
