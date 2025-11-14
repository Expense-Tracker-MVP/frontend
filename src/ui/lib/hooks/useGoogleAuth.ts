import { useState } from 'react'

export const useGoogleAuth = () => {
    const [isGoogleAuthLoading, setIsGoogleAuthLoading] = useState(false)

    const handleGoogleAuth = async () => {
        setIsGoogleAuthLoading(true)
        try {
            const backendUrl = import.meta.env.VITE_PUBLIC_BACKEND_URL
            const oauthUrl = `${backendUrl}/api/v1/auth/login/google`
            window.location.href = oauthUrl
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