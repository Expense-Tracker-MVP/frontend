import { useState } from 'react'

export const useGoogleAuth = () => {
    const [isGoogleAuthLoading, setIsGoogleAuthLoading] = useState(false)

    const handleGoogleAuth = async () => {
        setIsGoogleAuthLoading(true)
        try {
            // Redirect to backend OAuth endpoint
            window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login/google`
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