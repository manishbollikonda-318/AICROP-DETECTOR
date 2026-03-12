import { create } from 'zustand'

export const useAppStore = create((set, get) => ({
    // Theme
    darkMode: true,
    toggleDarkMode: () => {
        const newMode = !get().darkMode
        set({ darkMode: newMode })
        if (newMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    },

    // Language
    language: 'EN',
    setLanguage: (lang) => set({ language: lang }),

    // Chat
    chatOpen: false,
    toggleChat: () => set((s) => ({ chatOpen: !s.chatOpen })),

    // Loading
    loaded: false,
    setLoaded: () => set({ loaded: true }),

    // Scroll progress (0-1)
    scrollProgress: 0,
    setScrollProgress: (p) => set({ scrollProgress: p }),

    // Mouse position for parallax (-1 to 1)
    mouseX: 0,
    mouseY: 0,
    setMouse: (x, y) => set({ mouseX: x, mouseY: y }),

    // Auth
    isLoggedIn: false,
    user: null,
    login: (userData) => set({ isLoggedIn: true, user: userData }),
    logout: () => set({ isLoggedIn: false, user: null }),

    // Planner state
    plannerData: {
        state: '',
        season: '',
        rainfall: 100,
        temperature: 25,
        soilType: '',
    },
    setPlannerData: (data) => set((s) => ({ plannerData: { ...s.plannerData, ...data } })),
    plannerResults: null,
    setPlannerResults: (results) => set({ plannerResults: results }),

    // Plant Doctor state
    plantDoctorImage: null,
    plantDoctorResult: null,
    plantDoctorLoading: false,
    setPlantDoctorImage: (img) => set({ plantDoctorImage: img }),
    setPlantDoctorResult: (result) => set({ plantDoctorResult: result }),
    setPlantDoctorLoading: (loading) => set({ plantDoctorLoading: loading }),

    // Calculator state
    calculatorData: {
        cropType: '',
        farmSize: 1,
    },
    setCalculatorData: (data) => set((s) => ({ calculatorData: { ...s.calculatorData, ...data } })),
    calculatorResults: null,
    setCalculatorResults: (results) => set({ calculatorResults: results }),
}))
