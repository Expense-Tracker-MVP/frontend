import { useState } from 'react'

export const useGoogleAuth = () => {
    const [isGoogleAuthLoading, setIsGoogleAuthLoading] = useState(false)

    const handleGoogleAuth = async () => {
        setIsGoogleAuthLoading(true)
        try {
            const backendUrl = import.meta.env.VITE_PUBLIC_BACKEND_URL
            const oauthUrl = `${backendUrl}/api/v1/auth/login/google`
            
            // Check if running in Electron
            const isElectron = navigator.userAgent.toLowerCase().includes('electron')
            
            if (isElectron) {
                // In Electron, open OAuth in system browser
                // The backend should redirect back to app://localhost/auth/callback or http://localhost:5173/auth/callback
                window.open(oauthUrl, '_blank')
                // Keep the loading state - it will be cleared when auth completes
            } else {
                // In web browser, do a regular redirect
                window.location.href = oauthUrl
            }
        } catch (error) {
            console.error("Google authentication failed:", error)
            setIsGoogleAuthLoading(false)
        }
    }

    return {
        isGoogleAuthLoading,
        handleGoogleAuth
    }
}