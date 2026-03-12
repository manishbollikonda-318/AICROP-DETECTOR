import React, { Suspense, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { useAppStore } from './store/useAppStore'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import StatsSection from './components/StatsSection'
import FeaturesSection from './components/FeaturesSection'
import HowItWorks from './components/HowItWorks'
import Footer from './components/Footer'
import ChatWidget from './components/ChatWidget'
import LoadingScreen from './components/LoadingScreen'
import Scene3D from './components/3d/Scene3D'
import PlannerPage from './components/PlannerPage'
import PlantDoctorPage from './components/PlantDoctorPage'
import CalculatorPage from './components/CalculatorPage'
import FeedbackPage from './components/FeedbackPage'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import CropEncyclopedia from './components/CropEncyclopedia'

function HomePage() {
    return (
        <>
            <HeroSection />
            <StatsSection />
            <FeaturesSection />
            <HowItWorks />
            <Footer />
        </>
    )
}

function AppContent() {
    const { darkMode, setScrollProgress, setMouse, loaded, setLoaded } = useAppStore()
    const [showContent, setShowContent] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY
            const docHeight = document.documentElement.scrollHeight - window.innerHeight
            setScrollProgress(docHeight > 0 ? scrollTop / docHeight : 0)
        }
        const handleMouse = (e) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1
            const y = -(e.clientY / window.innerHeight) * 2 + 1
            setMouse(x, y)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        window.addEventListener('mousemove', handleMouse, { passive: true })
        return () => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('mousemove', handleMouse)
        }
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoaded()
            setTimeout(() => setShowContent(true), 500)
        }, 2500)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className={`relative min-h-screen ${darkMode ? 'dark' : ''}`}>
            <LoadingScreen />

            {/* 3D Canvas Background */}
            <div className="canvas-container">
                <Canvas
                    dpr={[1, 1.5]}
                    camera={{ position: [0, 2, 8], fov: 55 }}
                    gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                    style={{ background: 'transparent' }}
                >
                    <Suspense fallback={null}>
                        <Scene3D />
                    </Suspense>
                </Canvas>
            </div>

            {showContent && (
                <div className="content-layer">
                    <Navbar />
                    <main>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/planner" element={<PlannerPage />} />
                            <Route path="/doctor" element={<PlantDoctorPage />} />
                            <Route path="/calculator" element={<CalculatorPage />} />
                            <Route path="/feedback" element={<FeedbackPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/encyclopedia" element={<CropEncyclopedia />} />
                        </Routes>
                    </main>
                    <ChatWidget />
                </div>
            )}
        </div>
    )
}

export default function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    )
}
