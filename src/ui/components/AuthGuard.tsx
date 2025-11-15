import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuthState, useAuthActions } from '@ui/lib/store/authStore'
import type { AuthGuardProps } from '@/ui/lib/types/components'

export const AuthGuard = ({
    children,
    fallback = <div className="min-h-screen flex items-center justify-center">Checking authentication...</div>,
    redirectTo = '/sign-in'
}: AuthGuardProps) => {
    const { isAuthenticated, isLoading } = useAuthState()
    const { checkAuth } = useAuthActions()
    const navigate = useNavigate()

    useEffect(() => {
        checkAuth()
    }, [checkAuth])

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate(redirectTo)
        }
    }, [isAuthenticated, isLoading, checkAuth, navigate, redirectTo])

    // Show loading state while checking auth
    if (isLoading) {
        return <>{fallback}</>
    }

    // Show children only if authenticated
    if (isAuthenticated) {
        return <>{children}</>
    }

    // Show fallback while redirecting (this state should be brief)
    return <>{fallback}</>
}