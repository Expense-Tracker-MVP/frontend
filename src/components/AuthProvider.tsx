"use client"

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/store/authStore'

interface AuthProviderProps {
    children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const initializeAuth = useAuthStore((state) => state.initializeAuth)

    useEffect(() => {
        // Initialize authentication state on app startup
        initializeAuth()
    }, [initializeAuth])

    return <>{children}</>
}