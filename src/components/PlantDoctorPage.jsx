import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'

export default function PlantDoctorPage() {
    const { plantDoctorImage, plantDoctorResult, plantDoctorLoading,
        setPlantDoctorImage, setPlantDoctorResult, setPlantDoctorLoading } = useAppStore()
    const [dragActive, setDragActive] = useState(false)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [chatMessages, setChatMessages] = useState([
        { from: 'bot', text: '🌿 Hi! I\'m the Plant Doctor AI. Upload an image of your plant, and I\'ll diagnose any diseases using advanced AI vision. You can also ask me farming questions!', time: 'now' },
    ])
    const [chatInput, setChatInput] = useState('')
    const fileInputRef = useRef(null)
    const chatEndRef = useRef(null)

    const handleFile = useCallback((file) => {
        if (!file) return
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file (JPG, PNG)')
            return
        }
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB')
            return
        }
        setPlantDoctorImage(file)
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
        setPlantDoctorResult(null)
    }, [])

    const handleDrop = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        const file = e.dataTransfer?.files?.[0]
        handleFile(file)
    }, [handleFile])

    const handleDrag = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
        else if (e.type === 'dragleave') setDragActive(false)
    }, [])

    const analyzeImage = async () => {
        if (!plantDoctorImage) return
        setPlantDoctorLoading(true)
        setPlantDoctorResult(null)

        try {
            // Convert image to base64
            const reader = new FileReader()
            reader.readAsDataURL(plantDoctorImage)

            const base64 = await new Promise((resolve, reject) => {
                reader.onload = () => resolve(reader.result)
                reader.onerror = reject
            })

            // Call Kindwise Crop Health API
            const response = await fetch('https://crop.kindwise.com/api/v1/identification', {
                method: 'POST',
                headers: {
                    'Api-Key': 'tMI184zimjikWmgEHXGv8xlcSWJmg2UygCDcVXE4KL6OpGsZVH',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    images: [base64],
                    latitude: 17.385,
                    longitude: 78.4867,
                    similar_images: true,
                }),
            })

            if (!response.ok) {
                const errText = await response.text()
                throw new Error(`API Error ${response.status}: ${errText}`)
            }

            const data = await response.json()
            console.log('Crop Health API response:', data)

            // Parse Kindwise Crop Health API response
            // The Crop Health API uses result.crop and result.disease
            const cropSuggestions = data.result?.crop?.suggestions || []
            const diseaseSuggestions = data.result?.disease?.suggestions || []
            const isHealthy = data.result?.is_healthy?.binary ?? (diseaseSuggestions.length === 0)

            const result = {
                plantName: cropSuggestions[0]?.name || 'Unknown Crop',
                probability: Math.round((cropSuggestions[0]?.probability || 0) * 100),
                isHealthy: isHealthy,
                healthProbability: Math.round((data.result?.is_healthy?.probability || 0) * 100),
                diseases: diseaseSuggestions.filter(d => d.probability > 0.05).map(d => ({
                    name: d.name,
                    probability: Math.round((d.probability || 0) * 100),
                    description: d.details?.description || d.details?.wiki_description || 'No description available',
                    treatment: d.details?.treatment?.biological?.join(', ') ||
                        d.details?.treatment?.chemical?.join(', ') ||
                        d.details?.treatment?.prevention?.join(', ') ||
                        'Consult local agricultural expert',
                })),
                suggestions: cropSuggestions.slice(0, 5).map(s => ({
                    name: s.name,
                    probability: Math.round((s.probability || 0) * 100),
                })),
                similarImages: cropSuggestions[0]?.similar_images?.slice(0, 3) || [],
            }

            setPlantDoctorResult(result)
        } catch (err) {
            console.error('Crop Health API error:', err)
            // Fallback result if API fails
            setPlantDoctorResult({
                plantName: 'Analysis Failed',
                probability: 0,
                isHealthy: false,
                healthProbability: 0,
                diseases: [{
                    name: 'Unable to connect to API',
                    probability: 0,
                    description: `Error: ${err.message}`,
                    treatment: 'Check your internet connection and try again.',
                }],
                suggestions: [],
                similarImages: [],
                error: true,
            })
        } finally {
            setPlantDoctorLoading(false)
        }
    }

    const handleChatSend = (e) => {
        e.preventDefault()
        if (!chatInput.trim()) return
        setChatMessages(prev => [...prev, { from: 'user', text: chatInput, time: 'now' }])
        const q = chatInput.toLowerCase()
        setChatInput('')

        setTimeout(() => {
            let reply = "🤔 That's a great question! I'm primarily designed for plant disease detection. Upload an image and I'll analyze it for you!"
            if (q.includes('rice') || q.includes('paddy')) reply = "🌾 Rice grows best in Kharif season with Alluvial/Clay soil, 100-200mm rainfall, and 20-35°C temperature. Watch out for Blast disease and Brown Plant Hopper."
            else if (q.includes('wheat')) reply = "🌾 Wheat is a Rabi crop ideal for Alluvial/Loamy soil. Optimal temperature is 10-25°C with moderate rainfall. Key disease: stem rust."
            else if (q.includes('disease') || q.includes('sick') || q.includes('yellow')) reply = "🔬 To diagnose plant diseases, upload a clear photo of the affected leaf/plant above. I'll use AI vision to identify the issue and suggest treatments!"
            else if (q.includes('soil')) reply = "🌍 India has 8 major soil types: Alluvial (most fertile), Black (cotton soil), Red, Laterite, Desert, Mountain, Peaty, and Saline. Each supports different crops!"
            else if (q.includes('fertilizer') || q.includes('cost')) reply = "💰 Try our Fertilizer & Cost Calculator! Navigate to the Calculator page from the menu to estimate your farming expenses and profits."
            else if (q.includes('weather') || q.includes('rain')) reply = "🌧️ Weather data is crucial for crop planning. Our AI Planner integrates real-time weather forecasts with your location to recommend optimal crops."
            setChatMessages(prev => [...prev, { from: 'bot', text: reply, time: 'now' }])
        }, 800)
    }

    return (
        <section className="min-h-screen pt-28 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <span className="text-4xl mb-4 inline-block">🔬</span>
                    <h1 className="font-display text-4xl sm:text-5xl font-black mb-4"
                        style={{ color: 'var(--text-primary)' }}>
                        Plant{' '}
                        <span style={{
                            background: 'var(--gradient-neon)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>Doctor AI</span>
                    </h1>
                    <p className="font-body text-base opacity-60 max-w-xl mx-auto"
                        style={{ color: 'var(--text-primary)' }}>
                        Powered by Kindwise Crop Health AI — Upload a plant or leaf image for instant disease diagnosis
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left: Image Upload & Results */}
                    <div className="space-y-6">
                        {/* Upload Zone */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className={`glass-card p-8 text-center cursor-pointer transition-all ${dragActive ? 'neon-border scale-[1.02]' : ''
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFile(e.target.files?.[0])}
                                className="hidden"
                                id="plant-image-upload"
                            />

                            {previewUrl ? (
                                <div className="space-y-4">
                                    <div className="relative inline-block rounded-2xl overflow-hidden border-2"
                                        style={{ borderColor: 'var(--neon-primary)' }}>
                                        <img src={previewUrl} alt="Plant preview" className="max-h-64 mx-auto rounded-xl object-cover" />
                                        {plantDoctorLoading && (
                                            <div className="absolute inset-0 flex items-center justify-center"
                                                style={{ background: 'rgba(0,0,0,0.7)' }}>
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-12 h-12 border-3 border-t-transparent rounded-full animate-spin"
                                                        style={{ borderColor: 'var(--neon-primary)', borderTopColor: 'transparent' }} />
                                                    <span className="text-sm font-mono animate-pulse" style={{ color: 'var(--neon-primary)' }}>
                                                        Scanning with AI...
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs opacity-50 font-mono" style={{ color: 'var(--text-primary)' }}>
                                        Click to change image
                                    </p>
                                </div>
                            ) : (
                                <div className="py-12">
                                    <div className="text-6xl mb-4 animate-float">📸</div>
                                    <h3 className="font-display text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                                        {dragActive ? 'Drop your image here!' : 'Upload Plant Image'}
                                    </h3>
                                    <p className="text-sm opacity-50 font-body mb-4" style={{ color: 'var(--text-primary)' }}>
                                        Drag & drop or click to browse • JPG, PNG • Max 10MB
                                    </p>
                                    <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-xl">
                                        <span className="text-xs font-mono" style={{ color: 'var(--neon-primary)' }}>
                                            Powered by Kindwise Crop Health API
                                        </span>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Analyze Button */}
                        {previewUrl && !plantDoctorResult && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={analyzeImage}
                                disabled={plantDoctorLoading}
                                className="btn-neon-filled w-full py-4 text-base disabled:opacity-50"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                id="analyze-plant-btn"
                            >
                                {plantDoctorLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#0a0f0d', borderTopColor: 'transparent' }} />
                                        Analyzing with Crop Health AI...
                                    </span>
                                ) : '🧬 Scan & Diagnose'}
                            </motion.button>
                        )}

                        {/* Results */}
                        <AnimatePresence>
                            {plantDoctorResult && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-4"
                                >
                                    {/* Plant ID */}
                                    <div className="glass-card p-6">
                                        <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2"
                                            style={{ color: 'var(--text-primary)' }}>
                                            🌿 Identification
                                        </h3>
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="text-4xl">🌱</span>
                                            <div>
                                                <div className="font-display text-xl font-bold" style={{ color: 'var(--neon-primary)' }}>
                                                    {plantDoctorResult.plantName}
                                                </div>
                                                {plantDoctorResult.probability > 0 && (
                                                    <div className="text-xs font-mono opacity-60" style={{ color: 'var(--text-primary)' }}>
                                                        Confidence: {plantDoctorResult.probability}%
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Other suggestions */}
                                        {plantDoctorResult.suggestions?.length > 1 && (
                                            <div className="mt-3">
                                                <div className="text-xs font-mono opacity-40 mb-2" style={{ color: 'var(--text-primary)' }}>Other possibilities:</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {plantDoctorResult.suggestions.slice(1).map((s, i) => (
                                                        <span key={i} className="glass px-3 py-1 rounded-full text-xs font-mono"
                                                            style={{ color: 'var(--text-primary)' }}>
                                                            {s.name} ({s.probability}%)
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Health Status */}
                                    <div className={`glass-card p-6 border-l-4 ${plantDoctorResult.isHealthy ? 'border-l-green-400' : 'border-l-red-400'
                                        }`}>
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-3xl">{plantDoctorResult.isHealthy ? '✅' : '⚠️'}</span>
                                            <div>
                                                <h3 className="font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                                                    {plantDoctorResult.isHealthy ? 'Plant looks healthy!' : 'Disease Detected'}
                                                </h3>
                                                {plantDoctorResult.healthProbability > 0 && (
                                                    <p className="text-xs font-mono opacity-60" style={{ color: 'var(--text-primary)' }}>
                                                        Health confidence: {plantDoctorResult.healthProbability}%
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Diseases */}
                                    {plantDoctorResult.diseases?.length > 0 && (
                                        <div className="space-y-3">
                                            {plantDoctorResult.diseases.map((disease, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.15 }}
                                                    className="glass-card p-6"
                                                >
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="text-xl">🦠</span>
                                                        <h4 className="font-display text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                                                            {disease.name}
                                                        </h4>
                                                        {disease.probability > 0 && (
                                                            <span className="ml-auto font-mono text-xs px-2 py-1 rounded-full"
                                                                style={{
                                                                    background: disease.probability > 50 ? 'rgba(255,107,107,0.15)' : 'rgba(255,165,0,0.15)',
                                                                    color: disease.probability > 50 ? '#ff6b6b' : '#ffa500',
                                                                }}>
                                                                {disease.probability}%
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm opacity-60 font-body mb-3 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                                                        {disease.description}
                                                    </p>
                                                    <div className="glass p-4 rounded-xl">
                                                        <div className="text-xs font-mono font-bold mb-1" style={{ color: 'var(--neon-primary)' }}>
                                                            💊 Recommended Treatment:
                                                        </div>
                                                        <p className="text-sm opacity-70 font-body" style={{ color: 'var(--text-primary)' }}>
                                                            {disease.treatment}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Reset */}
                                    <div className="text-center pt-2">
                                        <motion.button
                                            onClick={() => {
                                                setPlantDoctorResult(null)
                                                setPlantDoctorImage(null)
                                                setPreviewUrl(null)
                                            }}
                                            className="btn-neon px-8 py-3"
                                            whileHover={{ scale: 1.03 }}
                                        >
                                            <span>🔄 Scan Another Plant</span>
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right: AI Chat */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card overflow-hidden flex flex-col h-[600px]"
                    >
                        {/* Chat Header */}
                        <div className="p-4 flex items-center gap-3"
                            style={{ borderBottom: '1px solid var(--border-glass)', background: 'rgba(0,255,136,0.03)' }}>
                            <div className="relative">
                                <span className="text-2xl">🤖</span>
                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2"
                                    style={{ borderColor: 'var(--bg-primary)' }} />
                            </div>
                            <div>
                                <h3 className="font-display text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                                    AICROP-DETECTOR Assistant
                                </h3>
                                <p className="text-xs font-mono opacity-50" style={{ color: 'var(--neon-primary)' }}>
                                    Ask me anything about farming
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {chatMessages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm font-body leading-relaxed ${msg.from === 'user' ? 'rounded-br-md' : 'rounded-bl-md'
                                        }`}
                                        style={{
                                            background: msg.from === 'user' ? 'var(--gradient-neon)' : 'var(--bg-glass-strong)',
                                            color: msg.from === 'user' ? '#0a0f0d' : 'var(--text-primary)',
                                            border: msg.from === 'bot' ? '1px solid var(--border-glass)' : 'none',
                                        }}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleChatSend} className="p-3" style={{ borderTop: '1px solid var(--border-glass)' }}>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={e => setChatInput(e.target.value)}
                                    placeholder="Ask about crops, diseases, soil..."
                                    className="flex-1 px-4 py-3 rounded-xl text-sm font-body outline-none transition-all"
                                    style={{
                                        background: 'var(--bg-glass)',
                                        color: 'var(--text-primary)',
                                        border: '1px solid var(--border-glass)',
                                    }}
                                    id="doctor-chat-input"
                                />
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-5 py-3 rounded-xl font-bold text-sm"
                                    style={{ background: 'var(--gradient-neon)', color: '#0a0f0d' }}
                                >
                                    ↑
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
