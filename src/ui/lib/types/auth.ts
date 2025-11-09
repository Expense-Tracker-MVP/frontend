import type { User } from '@ui/lib/types/user'

export interface AuthState {
    // State
    user: User | null
    accessToken: string | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null

    // Actions
    login: (token: string, userEmail?: string) => void
    logout: () => Promise<void>
    clearError: () => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    updateUser: (user: Partial<User>) => void
    checkAuth: () => boolean
    initializeAuth: () => void
    fetchCurrentUser: () => Promise<void>
    refreshToken: () => Promise<boolean>
}