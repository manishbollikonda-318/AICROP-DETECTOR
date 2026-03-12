import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'

const stateCoordinates = {
    'Andhra Pradesh': { lat: 15.9129, lon: 79.7400 },
    'Assam': { lat: 26.2006, lon: 92.9376 },
    'Bihar': { lat: 25.0961, lon: 85.3131 },
    'Chhattisgarh': { lat: 21.2787, lon: 81.8661 },
    'Goa': { lat: 15.2993, lon: 74.1240 },
    'Gujarat': { lat: 22.2587, lon: 71.1924 },
    'Haryana': { lat: 29.0588, lon: 76.0856 },
    'Himachal Pradesh': { lat: 31.1048, lon: 77.1665 },
    'Jharkhand': { lat: 23.6102, lon: 85.2799 },
    'Karnataka': { lat: 15.3173, lon: 75.7139 },
    'Kerala': { lat: 10.8505, lon: 76.2711 },
    'Madhya Pradesh': { lat: 22.9734, lon: 78.6569 },
    'Maharashtra': { lat: 19.7515, lon: 75.7139 },
    'Manipur': { lat: 24.6637, lon: 93.9063 },
    'Meghalaya': { lat: 25.4670, lon: 91.3662 },
    'Mizoram': { lat: 23.1645, lon: 92.9376 },
    'Nagaland': { lat: 26.1584, lon: 94.5624 },
    'Odisha': { lat: 20.9517, lon: 85.0985 },
    'Punjab': { lat: 31.1471, lon: 75.3412 },
    'Rajasthan': { lat: 27.0238, lon: 74.2179 },
    'Sikkim': { lat: 27.5330, lon: 88.5122 },
    'Tamil Nadu': { lat: 11.1271, lon: 78.6569 },
    'Telangana': { lat: 18.1124, lon: 79.0193 },
    'Tripura': { lat: 23.9408, lon: 91.9882 },
    'Uttar Pradesh': { lat: 26.8467, lon: 80.9462 },
    'Uttarakhand': { lat: 30.0668, lon: 79.0193 },
    'West Bengal': { lat: 22.9868, lon: 87.8550 },
}

const states = [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
]

const seasons = ['Kharif', 'Rabi', 'Summer', 'Winter']

const soilTypes = [
    { name: 'Alluvial', emoji: '🏔️', desc: 'River-deposited, fertile' },
    { name: 'Loamy', emoji: '🌱', desc: 'Balanced, ideal for most crops' },
    { name: 'Clay', emoji: '🧱', desc: 'Heavy, water-retaining' },
    { name: 'Sandy', emoji: '🏖️', desc: 'Light, well-drained' },
    { name: 'Red', emoji: '🔴', desc: 'Iron-rich, slightly acidic' },
    { name: 'Black', emoji: '⚫', desc: 'Cotton soil, moisture-rich' },
    { name: 'Laterite', emoji: '🟤', desc: 'Tropical, leached nutrients' },
    { name: 'Peaty', emoji: '🌿', desc: 'Organic-rich, acidic' },
]

const cropDatabase = {
    Kharif: {
        Alluvial: [
            { name: 'Rice', score: 95, profit: '₹45,000/acre', emoji: '🌾' },
            { name: 'Jute', score: 88, profit: '₹32,000/acre', emoji: '🧵' },
            { name: 'Maize', score: 82, profit: '₹28,000/acre', emoji: '🌽' },
        ],
        Loamy: [
            { name: 'Cotton', score: 92, profit: '₹40,000/acre', emoji: '🏵️' },
            { name: 'Soybean', score: 88, profit: '₹35,000/acre', emoji: '🫘' },
            { name: 'Groundnut', score: 85, profit: '₹38,000/acre', emoji: '🥜' },
        ],
        Clay: [
            { name: 'Rice', score: 94, profit: '₹42,000/acre', emoji: '🌾' },
            { name: 'Sugarcane', score: 90, profit: '₹50,000/acre', emoji: '🍬' },
            { name: 'Cotton', score: 80, profit: '₹38,000/acre', emoji: '🏵️' },
        ],
        Sandy: [
            { name: 'Millets', score: 90, profit: '₹22,000/acre', emoji: '🌿' },
            { name: 'Groundnut', score: 87, profit: '₹36,000/acre', emoji: '🥜' },
            { name: 'Sesame', score: 82, profit: '₹30,000/acre', emoji: '🌱' },
        ],
        Red: [
            { name: 'Groundnut', score: 91, profit: '₹37,000/acre', emoji: '🥜' },
            { name: 'Millets', score: 86, profit: '₹20,000/acre', emoji: '🌿' },
            { name: 'Pulses', score: 83, profit: '₹28,000/acre', emoji: '🫘' },
        ],
        Black: [
            { name: 'Cotton', score: 96, profit: '₹45,000/acre', emoji: '🏵️' },
            { name: 'Soybean', score: 90, profit: '₹34,000/acre', emoji: '🫘' },
            { name: 'Sorghum', score: 84, profit: '₹18,000/acre', emoji: '🌾' },
        ],
        default: [
            { name: 'Rice', score: 88, profit: '₹40,000/acre', emoji: '🌾' },
            { name: 'Cotton', score: 85, profit: '₹38,000/acre', emoji: '🏵️' },
            { name: 'Maize', score: 80, profit: '₹26,000/acre', emoji: '🌽' },
        ],
    },
    Rabi: {
        Alluvial: [
            { name: 'Wheat', score: 96, profit: '₹42,000/acre', emoji: '🌾' },
            { name: 'Mustard', score: 89, profit: '₹30,000/acre', emoji: '🌼' },
            { name: 'Potato', score: 85, profit: '₹48,000/acre', emoji: '🥔' },
        ],
        Loamy: [
            { name: 'Wheat', score: 94, profit: '₹40,000/acre', emoji: '🌾' },
            { name: 'Chickpea', score: 90, profit: '₹35,000/acre', emoji: '🫘' },
            { name: 'Lentil', score: 86, profit: '₹32,000/acre', emoji: '🥣' },
        ],
        default: [
            { name: 'Wheat', score: 90, profit: '₹38,000/acre', emoji: '🌾' },
            { name: 'Barley', score: 84, profit: '₹25,000/acre', emoji: '🌿' },
            { name: 'Peas', score: 80, profit: '₹28,000/acre', emoji: '🟢' },
        ],
    },
    Summer: {
        default: [
            { name: 'Watermelon', score: 92, profit: '₹50,000/acre', emoji: '🍉' },
            { name: 'Muskmelon', score: 88, profit: '₹45,000/acre', emoji: '🍈' },
            { name: 'Cucumber', score: 85, profit: '₹35,000/acre', emoji: '🥒' },
        ],
    },
    Winter: {
        default: [
            { name: 'Cauliflower', score: 90, profit: '₹40,000/acre', emoji: '🥦' },
            { name: 'Cabbage', score: 86, profit: '₹32,000/acre', emoji: '🥬' },
            { name: 'Carrot', score: 84, profit: '₹35,000/acre', emoji: '🥕' },
        ],
    },
}

export default function PlannerPage() {
    const { plannerData, setPlannerData } = useAppStore()
    const [results, setResults] = useState(null)
    const [step, setStep] = useState(1)
    const [analyzing, setAnalyzing] = useState(false)
    const [isFetchingWeather, setIsFetchingWeather] = useState(false)

    useEffect(() => {
        if (plannerData.state) {
            const coords = stateCoordinates[plannerData.state]
            if (coords) {
                setIsFetchingWeather(true)
                fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.current_weather) {
                            setPlannerData({ temperature: Math.round(data.current_weather.temperature) })
                        }
                    })
                    .catch(err => console.error("Error fetching weather:", err))
                    .finally(() => setIsFetchingWeather(false))
            }
        }
    }, [plannerData.state, setPlannerData])

    const handleAnalyze = () => {
        setAnalyzing(true)
        setTimeout(() => {
            const seasonData = cropDatabase[plannerData.season] || cropDatabase.Kharif
            const soilData = seasonData[plannerData.soilType] || seasonData.default || cropDatabase.Kharif.default

            // Adjust scores based on LIVE temp
            const adjusted = soilData.map(crop => {
                let scoreAdj = crop.score
                if (plannerData.temperature > 35) scoreAdj -= 2
                if (plannerData.temperature < 20 && plannerData.season === 'Rabi') scoreAdj += 2
                return { ...crop, score: Math.min(99, Math.max(50, scoreAdj)) }
            }).sort((a, b) => b.score - a.score)

            setResults(adjusted)
            setAnalyzing(false)
        }, 2000)
    }

    return (
        <section className="min-h-screen pt-28 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <span className="text-4xl mb-4 inline-block">🚀</span>
                    <h1 className="font-display text-4xl sm:text-5xl font-black mb-4"
                        style={{ color: 'var(--text-primary)' }}>
                        AICROP-DETECTOR{' '}
                        <span style={{
                            background: 'var(--gradient-neon)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>Planner</span>
                    </h1>
                    <p className="font-body text-base opacity-60 max-w-xl mx-auto"
                        style={{ color: 'var(--text-primary)' }}>
                        AI-powered agricultural intelligence for resilient farming
                    </p>
                </motion.div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-4 mb-12">
                    {[1, 2, 3].map(s => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? 'scale-110' : 'scale-100 opacity-40'
                                }`} style={{
                                    background: step >= s ? 'var(--gradient-neon)' : 'var(--bg-glass)',
                                    color: step >= s ? '#0a0f0d' : 'var(--text-primary)',
                                    border: step >= s ? 'none' : '1px solid var(--border-glass)',
                                    boxShadow: step >= s ? '0 0 15px rgba(0,255,136,0.3)' : 'none',
                                }}>
                                {s}
                            </div>
                            {s < 3 && <div className="w-16 h-0.5 rounded" style={{
                                background: step > s ? 'var(--neon-primary)' : 'var(--border-glass)',
                            }} />}
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* Step 1: Location & Season */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="glass-card p-8"
                        >
                            <h2 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                                📍 Location & Season
                            </h2>

                            <div className="space-y-6">
                                {/* State */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 opacity-70" style={{ color: 'var(--text-primary)' }}>
                                        State / Region
                                    </label>
                                    <select
                                        value={plannerData.state}
                                        onChange={e => setPlannerData({ state: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl text-sm font-body outline-none transition-all"
                                        style={{
                                            background: 'var(--bg-glass)',
                                            color: 'var(--text-primary)',
                                            border: '1px solid var(--border-glass)',
                                        }}
                                        id="planner-state"
                                    >
                                        <option value="">Select your state...</option>
                                        {states.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>

                                {/* Season */}
                                <div>
                                    <label className="block text-sm font-medium mb-3 opacity-70" style={{ color: 'var(--text-primary)' }}>
                                        Current Season
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {seasons.map(season => (
                                            <button
                                                key={season}
                                                onClick={() => setPlannerData({ season })}
                                                className={`glass-card p-4 text-center transition-all ${plannerData.season === season ? 'neon-border' : ''
                                                    }`}
                                                style={{
                                                    background: plannerData.season === season ? 'rgba(0,255,136,0.1)' : 'var(--bg-glass)',
                                                }}
                                            >
                                                <span className="text-2xl block mb-1">
                                                    {season === 'Kharif' ? '🌧️' : season === 'Rabi' ? '❄️' : season === 'Summer' ? '☀️' : '🍂'}
                                                </span>
                                                <span className="text-xs font-display font-bold block" style={{ color: 'var(--text-primary)' }}>
                                                    {season}
                                                </span>
                                                <span className="text-[10px] opacity-50 block mt-1 font-mono" style={{ color: 'var(--text-primary)' }}>
                                                    {season === 'Kharif' ? 'Jun - Oct' : season === 'Rabi' ? 'Oct - Mar' : season === 'Summer' ? 'Mar - Jun' : 'Dec - Feb'}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-8">
                                <motion.button
                                    onClick={() => setStep(2)}
                                    disabled={!plannerData.state || !plannerData.season}
                                    className="btn-neon-filled px-8 py-3 disabled:opacity-30 disabled:cursor-not-allowed"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    Next →
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Climate Data */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="glass-card p-8"
                        >
                            <h2 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                                🌤️ Climate Data
                            </h2>

                            <div className="space-y-8">
                                <div className="glass p-6 text-center rounded-xl relative overflow-hidden">
                                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--neon-secondary)] opacity-10 rounded-full blur-2xl"></div>
                                    <h3 className="font-display text-lg opacity-70 mb-2" style={{ color: 'var(--text-primary)' }}>Live Temperature in {plannerData.state}</h3>

                                    {isFetchingWeather ? (
                                        <div className="text-3xl font-black opacity-50 my-4 flex items-center justify-center gap-3" style={{ color: 'var(--neon-secondary)' }}>
                                            <span className="w-6 h-6 border-2 border-[var(--neon-secondary)] border-t-transparent rounded-full animate-spin"></span>
                                            Syncing...
                                        </div>
                                    ) : (
                                        <div className="text-6xl font-black my-2" style={{ color: 'var(--neon-secondary)' }}>
                                            {plannerData.temperature}°C
                                        </div>
                                    )}
                                    <p className="text-xs font-mono opacity-50 mt-4" style={{ color: 'var(--text-primary)' }}>Synced via Open-Meteo API</p>
                                </div>
                            </div>

                            <div className="flex justify-between mt-8">
                                <motion.button
                                    onClick={() => setStep(1)}
                                    className="btn-neon px-8 py-3"
                                    whileHover={{ scale: 1.03 }}
                                >
                                    <span>← Back</span>
                                </motion.button>
                                <motion.button
                                    onClick={() => setStep(3)}
                                    className="btn-neon-filled px-8 py-3"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    Next →
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Soil Type */}
                    {step === 3 && !results && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="glass-card p-8"
                        >
                            <h2 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                                🌍 Soil Type
                            </h2>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {soilTypes.map(soil => (
                                    <button
                                        key={soil.name}
                                        onClick={() => setPlannerData({ soilType: soil.name })}
                                        className={`glass-card p-4 text-center transition-all hover:scale-105 ${plannerData.soilType === soil.name ? 'neon-border' : ''
                                            }`}
                                        style={{
                                            background: plannerData.soilType === soil.name ? 'rgba(0,255,136,0.1)' : 'var(--bg-glass)',
                                        }}
                                    >
                                        <span className="text-3xl block mb-2">{soil.emoji}</span>
                                        <span className="text-sm font-display font-bold block" style={{ color: 'var(--text-primary)' }}>
                                            {soil.name}
                                        </span>
                                        <span className="text-[10px] opacity-50 block mt-1" style={{ color: 'var(--text-primary)' }}>
                                            {soil.desc}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-between mt-8">
                                <motion.button
                                    onClick={() => setStep(2)}
                                    className="btn-neon px-8 py-3"
                                    whileHover={{ scale: 1.03 }}
                                >
                                    <span>← Back</span>
                                </motion.button>
                                <motion.button
                                    onClick={handleAnalyze}
                                    disabled={!plannerData.soilType || analyzing}
                                    className="btn-neon-filled px-8 py-3 disabled:opacity-30 disabled:cursor-not-allowed"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    {analyzing ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#0a0f0d', borderTopColor: 'transparent' }} />
                                            Analyzing...
                                        </span>
                                    ) : '🧬 Analyze with AI'}
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* Results */}
                    {results && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Summary */}
                            <div className="glass-card p-8 text-center">
                                <span className="text-5xl mb-4 inline-block animate-float">🎯</span>
                                <h2 className="font-display text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
                                    Your Crop Recommendations
                                </h2>
                                <p className="font-body text-sm opacity-60" style={{ color: 'var(--text-primary)' }}>
                                    Based on {plannerData.state} • {plannerData.season} • {plannerData.soilType} soil • {plannerData.temperature}°C (Live)
                                </p>
                            </div>

                            {/* Crop Cards */}
                            {results.map((crop, i) => (
                                <motion.div
                                    key={crop.name}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.2 }}
                                    className="glass-card p-6 flex items-center gap-6"
                                >
                                    <div className="text-5xl">{crop.emoji}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                                {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'} {crop.name}
                                            </h3>
                                            <span className="font-mono text-xs px-3 py-1 rounded-full"
                                                style={{
                                                    background: crop.score > 90 ? 'rgba(0,255,136,0.15)' : 'rgba(0,255,242,0.15)',
                                                    color: crop.score > 90 ? 'var(--neon-primary)' : 'var(--neon-secondary)',
                                                    border: `1px solid ${crop.score > 90 ? 'rgba(0,255,136,0.3)' : 'rgba(0,255,242,0.3)'}`,
                                                }}>
                                                {crop.score}% match
                                            </span>
                                        </div>
                                        <div className="w-full h-2 rounded-full mb-2 overflow-hidden" style={{ background: 'var(--bg-glass)' }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${crop.score}%` }}
                                                transition={{ delay: i * 0.2 + 0.3, duration: 1, ease: 'easeOut' }}
                                                className="h-full rounded-full"
                                                style={{ background: 'var(--gradient-neon)', boxShadow: '0 0 10px rgba(0,255,136,0.5)' }}
                                            />
                                        </div>
                                        <p className="text-sm opacity-60 font-body" style={{ color: 'var(--text-primary)' }}>
                                            Est. Profit: <span className="font-bold" style={{ color: 'var(--neon-primary)' }}>{crop.profit}</span>
                                        </p>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Reset */}
                            <div className="text-center pt-4">
                                <motion.button
                                    onClick={() => { setResults(null); setStep(1) }}
                                    className="btn-neon px-8 py-3"
                                    whileHover={{ scale: 1.03 }}
                                >
                                    <span>🔄 Plan Again</span>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    )
}
