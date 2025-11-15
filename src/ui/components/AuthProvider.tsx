import { useEffect } from 'react'
import { useAuthStore } from '@ui/lib/store/authStore'

interface AuthProviderProps {
    children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const initializeAuth = useAuthStore((state) => state.initializeAuth)

    useEffect(() => {
        initializeAuth()
    }, [initializeAuth])

    return <>{children}</>
}