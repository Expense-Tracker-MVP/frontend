import { useEffect, useState } from 'react'
import { AuthTokens, isTokenExpired } from '@/lib/utils/auth'

export const useAuthGuard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        checkAuthentication()
    }, [])

    const checkAuthentication = () => {
        try {
            const token = AuthTokens.getToken()

            if (!token) {
                setIsAuthenticated(false)
                setIsLoading(false)
                return
            }

            if (isTokenExpired(token)) {
                // Token expired, clear it
                AuthTokens.removeToken()
                setIsAuthenticated(false)
                setIsLoading(false)
                return
            }

            setIsAuthenticated(true)
            setIsLoading(false)
        } catch (error) {
            console.error('Error checking authentication:', error)
            setIsAuthenticated(false)
            setIsLoading(false)
        }
    }

    const redirectToSignIn = () => {
        window.location.href = '/sign-in'
    }

    return {
        isAuthenticated,
        isLoading,
        checkAuthentication,
        redirectToSignIn
    }
}