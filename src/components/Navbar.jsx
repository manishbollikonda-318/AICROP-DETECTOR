import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

const languages = [
    { code: 'EN', label: 'English' },
    { code: 'HI', label: 'हिन्दी' },
    { code: 'TE', label: 'తెలుగు' },
    { code: 'TA', label: 'தமிழ்' },
    { code: 'PA', label: 'ਪੰਜਾਬੀ' },
]

const navLinks = [
    { label: '🏠 Home', path: '/' },
    { label: '🚀 Features', path: '/#features', hasDropdown: true },
    { label: '💬 Feedback', path: '/feedback' },
]

const featureDropdown = [
    { label: '🌾 Crop Planner', path: '/planner', desc: 'AI crop recommendations' },
    { label: '🔬 Plant Doctor', path: '/doctor', desc: 'Disease detection AI' },
    { label: '📊 Calculator', path: '/calculator', desc: 'Fertilizer & cost analysis' },
    { label: '🌍 Crop Encyclopedia', path: '/encyclopedia', desc: '100+ global crop varieties' },
]

export default function Navbar() {
    const { darkMode, toggleDarkMode, language, setLanguage, isLoggedIn, logout } = useAppStore()
    const [langOpen, setLangOpen] = useState(false)
    const [featuresOpen, setFeaturesOpen] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const langRef = useRef(null)
    const featRef = useRef(null)
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const handleClick = (e) => {
            if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
            if (featRef.current && !featRef.current.contains(e.target)) setFeaturesOpen(false)
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    useEffect(() => {
        setMobileOpen(false)
    }, [location])

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/'
        return location.pathname.startsWith(path)
    }

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-strong py-3' : 'py-5'
                }`}
            style={{
                backdropFilter: scrolled ? 'blur(30px) saturate(200%)' : 'blur(10px)',
                borderBottom: scrolled ? '1px solid var(--border-glass)' : 'none',
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                {/* Logo */}
                <motion.div whileHover={{ scale: 1.02 }}>
                    <Link to="/" className="flex items-center gap-2 group">
                        <span className="text-2xl">🌱</span>
                        <span className="font-display text-xl font-bold"
                            style={{
                                background: 'var(--gradient-neon)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                            AICROP-DETECTOR
                        </span>
                    </Link>
                </motion.div>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <div key={link.label} className="relative" ref={link.hasDropdown ? featRef : null}>
                            {link.hasDropdown ? (
                                <button
                                    onClick={() => setFeaturesOpen(!featuresOpen)}
                                    className={`font-body text-sm font-medium px-4 py-2 rounded-xl transition-all flex items-center gap-1 ${isActive('/planner') || isActive('/doctor') || isActive('/calculator')
                                        ? 'text-[var(--neon-primary)]'
                                        : 'opacity-70 hover:opacity-100'
                                        }`}
                                    style={{ color: isActive('/planner') || isActive('/doctor') || isActive('/calculator') ? 'var(--neon-primary)' : 'var(--text-primary)' }}
                                >
                                    {link.label}
                                    <svg className={`w-3 h-3 transition-transform ${featuresOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            ) : (
                                <Link
                                    to={link.path}
                                    className={`font-body text-sm font-medium px-4 py-2 rounded-xl transition-all ${isActive(link.path) && link.path !== '/#features'
                                        ? 'text-[var(--neon-primary)]'
                                        : 'opacity-70 hover:opacity-100'
                                        }`}
                                    style={{
                                        color: isActive(link.path) && link.path !== '/#features' ? 'var(--neon-primary)' : 'var(--text-primary)',
                                        borderBottom: isActive(link.path) && link.path !== '/#features' ? '2px solid var(--neon-primary)' : 'none'
                                    }}
                                >
                                    {link.label}
                                </Link>
                            )}

                            {/* Features Dropdown */}
                            {link.hasDropdown && (
                                <AnimatePresence>
                                    {featuresOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            className="absolute top-full mt-2 left-0 glass-strong rounded-2xl overflow-hidden min-w-[260px] p-2"
                                        >
                                            {featureDropdown.map((item) => (
                                                <Link
                                                    key={item.path}
                                                    to={item.path}
                                                    onClick={() => setFeaturesOpen(false)}
                                                    className="flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors group"
                                                >
                                                    <span className="text-lg mt-0.5">{item.label.split(' ')[0]}</span>
                                                    <div>
                                                        <div className="text-sm font-display font-bold group-hover:text-[var(--neon-primary)] transition-colors"
                                                            style={{ color: 'var(--text-primary)' }}>
                                                            {item.label.split(' ').slice(1).join(' ')}
                                                        </div>
                                                        <div className="text-xs opacity-50 font-body" style={{ color: 'var(--text-primary)' }}>
                                                            {item.desc}
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    ))}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {/* Language */}
                    <div ref={langRef} className="relative hidden sm:block">
                        <button
                            onClick={() => setLangOpen(!langOpen)}
                            className="glass px-3 py-1.5 rounded-xl text-xs font-mono font-medium flex items-center gap-1 hover:scale-105 transition-transform"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            🌐 {language}
                            <svg className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <AnimatePresence>
                            {langOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    className="absolute top-full mt-2 right-0 glass-strong rounded-xl overflow-hidden min-w-[140px]"
                                >
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => { setLanguage(lang.code); setLangOpen(false) }}
                                            className={`w-full px-4 py-2.5 text-left text-sm font-body hover:bg-white/10 transition-colors flex items-center gap-2`}
                                            style={{ color: language === lang.code ? 'var(--neon-primary)' : 'var(--text-primary)' }}
                                        >
                                            <span className="font-mono text-xs opacity-50">{lang.code}</span>
                                            {lang.label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Dark Mode Toggle */}
                    <motion.button
                        onClick={toggleDarkMode}
                        className="glass w-10 h-10 rounded-xl flex items-center justify-center text-lg hover:scale-110 transition-transform"
                        whileTap={{ scale: 0.9, rotate: 180 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        {darkMode ? '☀️' : '🌙'}
                    </motion.button>

                    {/* Auth Buttons */}
                    {isLoggedIn ? (
                        <motion.button
                            onClick={logout}
                            className="hidden sm:block btn-neon text-xs py-2 px-5"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>Logout</span>
                        </motion.button>
                    ) : (
                        <div className="hidden sm:flex items-center gap-2">
                            <Link to="/login">
                                <motion.button
                                    className="btn-neon text-xs py-2 px-5"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span>🔑 Login</span>
                                </motion.button>
                            </Link>
                            <Link to="/register">
                                <motion.button
                                    className="btn-neon-filled text-xs py-2 px-5"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    ✨ Sign Up
                                </motion.button>
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden glass w-10 h-10 rounded-xl flex items-center justify-center"
                    >
                        <div className="flex flex-col gap-1.5">
                            <span className={`block w-5 h-0.5 rounded transition-all ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`}
                                style={{ background: 'var(--neon-primary)' }} />
                            <span className={`block w-5 h-0.5 rounded transition-all ${mobileOpen ? 'opacity-0' : ''}`}
                                style={{ background: 'var(--neon-primary)' }} />
                            <span className={`block w-5 h-0.5 rounded transition-all ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`}
                                style={{ background: 'var(--neon-primary)' }} />
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass-strong mt-2 mx-4 rounded-2xl overflow-hidden"
                    >
                        <div className="p-4 flex flex-col gap-2">
                            <Link to="/" className="font-body text-sm py-2 px-4 rounded-xl hover:bg-white/10" style={{ color: 'var(--text-primary)' }}>🏠 Home</Link>
                            <Link to="/planner" className="font-body text-sm py-2 px-4 rounded-xl hover:bg-white/10" style={{ color: 'var(--text-primary)' }}>🌾 Crop Planner</Link>
                            <Link to="/doctor" className="font-body text-sm py-2 px-4 rounded-xl hover:bg-white/10" style={{ color: 'var(--text-primary)' }}>🔬 Plant Doctor</Link>
                            <Link to="/calculator" className="font-body text-sm py-2 px-4 rounded-xl hover:bg-white/10" style={{ color: 'var(--text-primary)' }}>📊 Calculator</Link>
                            <Link to="/encyclopedia" className="font-body text-sm py-2 px-4 rounded-xl hover:bg-white/10" style={{ color: 'var(--text-primary)' }}>🌍 Encyclopedia</Link>
                            <Link to="/feedback" className="font-body text-sm py-2 px-4 rounded-xl hover:bg-white/10" style={{ color: 'var(--text-primary)' }}>💬 Feedback</Link>
                            <div className="flex gap-2 mt-2">
                                <Link to="/login" className="flex-1"><button className="btn-neon text-xs py-2 w-full"><span>Login</span></button></Link>
                                <Link to="/register" className="flex-1"><button className="btn-neon-filled text-xs py-2 w-full">Sign Up</button></Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}
