import React, { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
    const cursorRef = useRef(null)
    const [trails, setTrails] = useState([])
    const trailId = useRef(0)

    useEffect(() => {
        const cursor = cursorRef.current
        if (!cursor) return

        let frame
        const handleMouse = (e) => {
            cancelAnimationFrame(frame)
            frame = requestAnimationFrame(() => {
                cursor.style.left = `${e.clientX - 10}px`
                cursor.style.top = `${e.clientY - 10}px`
            })

            // Spawn trail particles occasionally
            if (Math.random() > 0.7) {
                const id = trailId.current++
                setTrails(prev => [...prev.slice(-8), {
                    id,
                    x: e.clientX - 4 + (Math.random() - 0.5) * 20,
                    y: e.clientY - 4 + (Math.random() - 0.5) * 20,
                }])
                setTimeout(() => {
                    setTrails(prev => prev.filter(t => t.id !== id))
                }, 600)
            }
        }

        const handleDown = () => {
            cursor.style.transform = 'scale(0.8)'
        }
        const handleUp = () => {
            cursor.style.transform = 'scale(1)'
        }

        window.addEventListener('mousemove', handleMouse)
        window.addEventListener('mousedown', handleDown)
        window.addEventListener('mouseup', handleUp)

        return () => {
            window.removeEventListener('mousemove', handleMouse)
            window.removeEventListener('mousedown', handleDown)
            window.removeEventListener('mouseup', handleUp)
            cancelAnimationFrame(frame)
        }
    }, [])

    return (
        <>
            <div ref={cursorRef} className="custom-cursor hidden md:block" />
            {trails.map(t => (
                <div
                    key={t.id}
                    className="cursor-trail hidden md:block"
                    style={{ left: `${t.x}px`, top: `${t.y}px` }}
                />
            ))}
        </>
    )
}
