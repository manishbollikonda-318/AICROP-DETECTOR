import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const crops = [
    // Cereals
    { name: 'Rice', emoji: '🌾', fertCost: 3500, seedCost: 2000, laborCost: 8000, irrigCost: 4000, msp: 2183, yieldPerAcre: 25 },
    { name: 'Wheat', emoji: '🌾', fertCost: 3000, seedCost: 1800, laborCost: 6000, irrigCost: 3500, msp: 2275, yieldPerAcre: 20 },
    { name: 'Maize (Corn)', emoji: '🌽', fertCost: 3200, seedCost: 1500, laborCost: 5000, irrigCost: 3000, msp: 2090, yieldPerAcre: 30 },
    { name: 'Barley', emoji: '🌾', fertCost: 2500, seedCost: 1400, laborCost: 4500, irrigCost: 2500, msp: 1735, yieldPerAcre: 18 },
    { name: 'Sorghum (Jowar)', emoji: '🌿', fertCost: 2000, seedCost: 1000, laborCost: 4000, irrigCost: 1500, msp: 3180, yieldPerAcre: 12 },
    { name: 'Millet (Bajra)', emoji: '🌿', fertCost: 1800, seedCost: 800, laborCost: 3500, irrigCost: 1200, msp: 2500, yieldPerAcre: 10 },
    { name: 'Oats', emoji: '🥣', fertCost: 2500, seedCost: 1500, laborCost: 5000, irrigCost: 2500, msp: 3500, yieldPerAcre: 15 },
    { name: 'Quinoa', emoji: '🥗', fertCost: 3000, seedCost: 4000, laborCost: 8000, irrigCost: 2500, msp: 12000, yieldPerAcre: 6 },
    // Pulses & Legumes
    { name: 'Chickpea (Chana)', emoji: '🫘', fertCost: 2500, seedCost: 2000, laborCost: 4500, irrigCost: 2000, msp: 5440, yieldPerAcre: 10 },
    { name: 'Lentil (Masoor)', emoji: '🥣', fertCost: 2200, seedCost: 1800, laborCost: 4000, irrigCost: 1800, msp: 6425, yieldPerAcre: 8 },
    { name: 'Soybean', emoji: '🫘', fertCost: 2800, seedCost: 2200, laborCost: 5500, irrigCost: 2500, msp: 4600, yieldPerAcre: 12 },
    { name: 'Groundnut (Peanut)', emoji: '🥜', fertCost: 3000, seedCost: 5000, laborCost: 7000, irrigCost: 3000, msp: 6377, yieldPerAcre: 10 },
    { name: 'Green Gram (Moong)', emoji: '🫘', fertCost: 2000, seedCost: 1800, laborCost: 4000, irrigCost: 1500, msp: 8558, yieldPerAcre: 5 },
    { name: 'Black Gram (Urad)', emoji: '🫘', fertCost: 2200, seedCost: 2000, laborCost: 4500, irrigCost: 1800, msp: 6950, yieldPerAcre: 6 },
    // Cash Crops
    { name: 'Cotton', emoji: '🏵️', fertCost: 4500, seedCost: 3000, laborCost: 10000, irrigCost: 5000, msp: 6620, yieldPerAcre: 8 },
    { name: 'Sugarcane', emoji: '🍬', fertCost: 5000, seedCost: 4000, laborCost: 12000, irrigCost: 6000, msp: 315, yieldPerAcre: 350 },
    { name: 'Jute', emoji: '🧵', fertCost: 3000, seedCost: 1500, laborCost: 6000, irrigCost: 3000, msp: 5050, yieldPerAcre: 10 },
    { name: 'Tobacco', emoji: '🌿', fertCost: 3500, seedCost: 2000, laborCost: 8000, irrigCost: 3500, msp: 6500, yieldPerAcre: 10 },
    // Oilseeds
    { name: 'Mustard', emoji: '🌼', fertCost: 2500, seedCost: 1500, laborCost: 4500, irrigCost: 2000, msp: 5650, yieldPerAcre: 8 },
    { name: 'Sunflower', emoji: '🌻', fertCost: 2800, seedCost: 2000, laborCost: 5000, irrigCost: 2500, msp: 6400, yieldPerAcre: 6 },
    { name: 'Sesame (Til)', emoji: '🌱', fertCost: 2000, seedCost: 1200, laborCost: 4000, irrigCost: 1500, msp: 7830, yieldPerAcre: 4 },
    { name: 'Castor', emoji: '🌿', fertCost: 2000, seedCost: 1500, laborCost: 4000, irrigCost: 1200, msp: 6500, yieldPerAcre: 10 },
    // Vegetables
    { name: 'Tomato', emoji: '🍅', fertCost: 4000, seedCost: 2500, laborCost: 15000, irrigCost: 5000, msp: 1500, yieldPerAcre: 100 },
    { name: 'Potato', emoji: '🥔', fertCost: 4500, seedCost: 8000, laborCost: 10000, irrigCost: 4000, msp: 1200, yieldPerAcre: 100 },
    { name: 'Onion', emoji: '🧅', fertCost: 3500, seedCost: 3500, laborCost: 12000, irrigCost: 4500, msp: 1500, yieldPerAcre: 80 },
    { name: 'Garlic', emoji: '🧄', fertCost: 3000, seedCost: 6000, laborCost: 10000, irrigCost: 3500, msp: 5000, yieldPerAcre: 40 },
    { name: 'Ginger', emoji: '🫚', fertCost: 5000, seedCost: 10000, laborCost: 15000, irrigCost: 5000, msp: 4000, yieldPerAcre: 60 },
    { name: 'Turmeric', emoji: '🟡', fertCost: 4500, seedCost: 8000, laborCost: 12000, irrigCost: 4500, msp: 8000, yieldPerAcre: 30 },
    // Fruits
    { name: 'Banana', emoji: '🍌', fertCost: 5000, seedCost: 10000, laborCost: 15000, irrigCost: 6000, msp: 1200, yieldPerAcre: 300 },
    { name: 'Watermelon', emoji: '🍉', fertCost: 3000, seedCost: 2000, laborCost: 8000, irrigCost: 4000, msp: 500, yieldPerAcre: 200 },
    // Spices
    { name: 'Chili Pepper', emoji: '🌶️', fertCost: 4000, seedCost: 2000, laborCost: 12000, irrigCost: 4000, msp: 12000, yieldPerAcre: 20 },
]

export default function CalculatorPage() {
    const [selectedCrop, setSelectedCrop] = useState('')
    const [farmSize, setFarmSize] = useState(1)
    const [results, setResults] = useState(null)

    const calculate = () => {
        const crop = crops.find(c => c.name === selectedCrop)
        if (!crop) return

        const totalFert = crop.fertCost * farmSize
        const totalSeed = crop.seedCost * farmSize
        const totalLabor = crop.laborCost * farmSize
        const totalIrrig = crop.irrigCost * farmSize
        const miscCost = (totalFert + totalSeed + totalLabor + totalIrrig) * 0.1
        const totalExpense = totalFert + totalSeed + totalLabor + totalIrrig + miscCost
        const totalYield = crop.yieldPerAcre * farmSize
        const totalRevenue = totalYield * crop.msp
        const totalProfit = totalRevenue - totalExpense
        const roi = ((totalProfit / totalExpense) * 100).toFixed(1)

        setResults({
            crop,
            farmSize,
            costs: [
                { label: 'Fertilizer', value: totalFert, color: '#4ade80' },
                { label: 'Seeds', value: totalSeed, color: '#00fff2' },
                { label: 'Labor', value: totalLabor, color: '#7fff00' },
                { label: 'Irrigation', value: totalIrrig, color: '#00ffa3' },
                { label: 'Miscellaneous', value: miscCost, color: '#ffa500' },
            ],
            totalExpense,
            totalYield,
            totalRevenue,
            totalProfit,
            roi,
        })
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
                    <span className="text-4xl mb-4 inline-block">📊</span>
                    <h1 className="font-display text-4xl sm:text-5xl font-black mb-4"
                        style={{ color: 'var(--text-primary)' }}>
                        Fertilizer &{' '}
                        <span style={{
                            background: 'var(--gradient-neon)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>Cost Calculator</span>
                    </h1>
                    <p className="font-body text-base opacity-60 max-w-xl mx-auto"
                        style={{ color: 'var(--text-primary)' }}>
                        Estimate farming expenses, revenue, and profit margins for {crops.length} crops worldwide
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Input Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-8 space-y-6"
                    >
                        <h2 className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            📝 Input Details
                        </h2>

                        {/* Crop Selection */}
                        <div>
                            <label className="block text-sm font-medium mb-3 opacity-70" style={{ color: 'var(--text-primary)' }}>
                                Select Crop ({crops.length} available)
                            </label>
                            <select
                                value={selectedCrop}
                                onChange={e => setSelectedCrop(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl text-sm font-body outline-none"
                                style={{
                                    background: 'var(--bg-glass)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border-glass)',
                                }}
                                id="calc-crop-select"
                            >
                                <option value="">Choose a crop...</option>
                                <optgroup label="🌾 Cereals & Grains">
                                    {crops.filter(c => ['Rice', 'Wheat', 'Maize (Corn)', 'Barley', 'Sorghum (Jowar)', 'Millet (Bajra)', 'Oats', 'Quinoa'].includes(c.name)).map(c => (
                                        <option key={c.name} value={c.name}>{c.emoji} {c.name}</option>
                                    ))}
                                </optgroup>
                                <optgroup label="🫘 Pulses & Legumes">
                                    {crops.filter(c => ['Chickpea (Chana)', 'Lentil (Masoor)', 'Soybean', 'Groundnut (Peanut)', 'Green Gram (Moong)', 'Black Gram (Urad)'].includes(c.name)).map(c => (
                                        <option key={c.name} value={c.name}>{c.emoji} {c.name}</option>
                                    ))}
                                </optgroup>
                                <optgroup label="💰 Cash Crops">
                                    {crops.filter(c => ['Cotton', 'Sugarcane', 'Jute', 'Tobacco'].includes(c.name)).map(c => (
                                        <option key={c.name} value={c.name}>{c.emoji} {c.name}</option>
                                    ))}
                                </optgroup>
                                <optgroup label="🌻 Oilseeds">
                                    {crops.filter(c => ['Mustard', 'Sunflower', 'Sesame (Til)', 'Castor'].includes(c.name)).map(c => (
                                        <option key={c.name} value={c.name}>{c.emoji} {c.name}</option>
                                    ))}
                                </optgroup>
                                <optgroup label="🥬 Vegetables">
                                    {crops.filter(c => ['Tomato', 'Potato', 'Onion', 'Garlic', 'Ginger', 'Turmeric'].includes(c.name)).map(c => (
                                        <option key={c.name} value={c.name}>{c.emoji} {c.name}</option>
                                    ))}
                                </optgroup>
                                <optgroup label="🍌 Fruits & Spices">
                                    {crops.filter(c => ['Banana', 'Watermelon', 'Chili Pepper'].includes(c.name)).map(c => (
                                        <option key={c.name} value={c.name}>{c.emoji} {c.name}</option>
                                    ))}
                                </optgroup>
                            </select>
                        </div>

                        {/* Farm Size */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-sm font-medium opacity-70" style={{ color: 'var(--text-primary)' }}>
                                    Farm Size (acres)
                                </label>
                                <span className="font-mono text-sm font-bold" style={{ color: 'var(--neon-primary)' }}>
                                    {farmSize} acres
                                </span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="100"
                                value={farmSize}
                                onChange={e => setFarmSize(Number(e.target.value))}
                                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                                style={{
                                    background: `linear-gradient(to right, var(--neon-primary) ${farmSize}%, var(--border-glass) ${farmSize}%)`,
                                }}
                                id="calc-farm-size"
                            />
                            <div className="flex justify-between text-xs opacity-40 mt-1 font-mono" style={{ color: 'var(--text-primary)' }}>
                                <span>1 acre</span><span>50 acres</span><span>100 acres</span>
                            </div>
                        </div>

                        {/* Manual input for precision */}
                        <div>
                            <label className="block text-sm font-medium mb-2 opacity-70" style={{ color: 'var(--text-primary)' }}>
                                Or enter exact acres:
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="1000"
                                value={farmSize}
                                onChange={e => setFarmSize(Math.max(1, Number(e.target.value)))}
                                className="w-full px-4 py-3 rounded-xl text-sm font-mono outline-none"
                                style={{
                                    background: 'var(--bg-glass)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border-glass)',
                                }}
                            />
                        </div>

                        <motion.button
                            onClick={calculate}
                            disabled={!selectedCrop}
                            className="btn-neon-filled w-full py-3 disabled:opacity-30 disabled:cursor-not-allowed"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            📊 Calculate Costs & Profit
                        </motion.button>

                        {/* Link to encyclopedia */}
                        <Link to="/encyclopedia" className="block text-center text-xs font-mono opacity-40 hover:opacity-70 transition-opacity" style={{ color: 'var(--neon-primary)' }}>
                            🌍 Browse all {crops.length}+ crops in our Encyclopedia →
                        </Link>
                    </motion.div>

                    {/* Results */}
                    <AnimatePresence mode="wait">
                        {results ? (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                {/* Profit Summary Card */}
                                <div className={`glass-card p-6 border-l-4 ${results.totalProfit > 0 ? 'border-l-green-400' : 'border-l-red-400'
                                    }`}>
                                    <div className="text-center mb-4">
                                        <span className="text-4xl">{results.crop.emoji}</span>
                                        <h3 className="font-display text-2xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>
                                            {results.crop.name} Analysis
                                        </h3>
                                        <p className="text-xs font-mono opacity-50" style={{ color: 'var(--text-primary)' }}>
                                            {results.farmSize} acres
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <div className="text-center">
                                            <div className="text-xs opacity-50 font-mono mb-1" style={{ color: 'var(--text-primary)' }}>Total Cost</div>
                                            <div className="font-display text-lg font-bold" style={{ color: '#ff6b6b' }}>
                                                ₹{results.totalExpense.toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs opacity-50 font-mono mb-1" style={{ color: 'var(--text-primary)' }}>Revenue</div>
                                            <div className="font-display text-lg font-bold" style={{ color: 'var(--neon-secondary)' }}>
                                                ₹{results.totalRevenue.toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs opacity-50 font-mono mb-1" style={{ color: 'var(--text-primary)' }}>Profit</div>
                                            <div className="font-display text-lg font-bold" style={{
                                                color: results.totalProfit > 0 ? 'var(--neon-primary)' : '#ff6b6b'
                                            }}>
                                                {results.totalProfit > 0 ? '+' : ''}₹{results.totalProfit.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center glass p-3 rounded-xl">
                                        <span className="text-xs font-mono opacity-50" style={{ color: 'var(--text-primary)' }}>ROI: </span>
                                        <span className="font-display text-xl font-bold" style={{
                                            color: results.roi > 0 ? 'var(--neon-primary)' : '#ff6b6b'
                                        }}>
                                            {results.roi}%
                                        </span>
                                    </div>
                                </div>

                                {/* Cost Breakdown */}
                                <div className="glass-card p-6">
                                    <h3 className="font-display text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                                        📋 Cost Breakdown
                                    </h3>
                                    <div className="space-y-3">
                                        {results.costs.map((cost, i) => (
                                            <motion.div
                                                key={cost.label}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                            >
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="font-body opacity-70" style={{ color: 'var(--text-primary)' }}>{cost.label}</span>
                                                    <span className="font-mono font-bold" style={{ color: cost.color }}>
                                                        ₹{cost.value.toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-glass)' }}>
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(cost.value / results.totalExpense) * 100}%` }}
                                                        transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }}
                                                        className="h-full rounded-full"
                                                        style={{ background: cost.color }}
                                                    />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Yield Info */}
                                <div className="glass-card p-6">
                                    <h3 className="font-display text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                                        🌾 Expected Yield
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-display text-3xl font-black" style={{ color: 'var(--neon-primary)' }}>
                                                {results.totalYield.toLocaleString()} qtl
                                            </div>
                                            <div className="text-xs font-mono opacity-50" style={{ color: 'var(--text-primary)' }}>
                                                @ MSP ₹{results.crop.msp}/qtl
                                            </div>
                                        </div>
                                        <span className="text-5xl">{results.crop.emoji}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="glass-card p-12 text-center flex flex-col items-center justify-center h-full"
                            >
                                <span className="text-6xl mb-4 opacity-30">📊</span>
                                <h3 className="font-display text-xl font-bold opacity-40" style={{ color: 'var(--text-primary)' }}>
                                    Select a crop and farm size
                                </h3>
                                <p className="text-sm opacity-30 font-body mt-2" style={{ color: 'var(--text-primary)' }}>
                                    Choose from {crops.length} crop varieties across 6 categories
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}
