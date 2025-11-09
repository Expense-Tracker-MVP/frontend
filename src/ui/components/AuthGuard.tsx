import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth, useAuthActions } from '@ui/lib/store/authStore'
import type { AuthGuardProps } from '@/ui/lib/types/components'

export const AuthGuard = ({
    children,
    fallback = <div>Checking authentication...</div>,
    redirectTo = '/sign-in'
}: AuthGuardProps) => {
    const { isAuthenticated, isLoading } = useAuth()
    const { checkAuth } = useAuthActions()
    const navigate = useNavigate()

    useEffect(() => {
        // Check authentication status
        const isValid = checkAuth()

        if (!isLoading && !isValid) {
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