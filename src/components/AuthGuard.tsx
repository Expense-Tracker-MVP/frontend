"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, useAuthActions } from '@/store/authStore'

interface AuthGuardProps {
    children: React.ReactNode
    fallback?: React.ReactNode
    redirectTo?: string
}

export const AuthGuard = ({
    children,
    fallback = <div>Checking authentication...</div>,
    redirectTo = '/auth/signin'
}: AuthGuardProps) => {
    const { isAuthenticated, isLoading } = useAuth()
    const { checkAuth } = useAuthActions()
    const router = useRouter()

    useEffect(() => {
        // Check authentication status
        const isValid = checkAuth()

        if (!isLoading && !isValid) {
            router.push(redirectTo)
        }
    }, [isAuthenticated, isLoading, checkAuth, router, redirectTo])

    // Show loading state while checking auth
    if (isLoading) {
        return <>{fallback}</>
    }

    // Show children only if authenticated
    if (isAuthenticated) {
        return <>{children}</>
    }

    // Show fallback while redirecting
    return <>{fallback}</>
}

// Higher-order component version
export const withAuthGuard = <P extends object>(
    Component: React.ComponentType<P>,
    options?: { redirectTo?: string }
) => {
    const AuthGuardedComponent = (props: P) => (
        <AuthGuard redirectTo={options?.redirectTo}>
            <Component {...props} />
        </AuthGuard>
    )

    AuthGuardedComponent.displayName = `withAuthGuard(${Component.displayName || Component.name})`

    return AuthGuardedComponent
}