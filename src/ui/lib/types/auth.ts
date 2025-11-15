import type { User } from '@ui/lib/types/user'

export interface AuthState {
    // State
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null

    // Actions
    login: () => void
    logout: () => Promise<void>
    clearError: () => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    updateUser: (user: Partial<User>) => void
    checkAuth: () => Promise<boolean>
    initializeAuth: () => void
    fetchCurrentUser: () => Promise<void>
    refreshToken: () => Promise<boolean>
}