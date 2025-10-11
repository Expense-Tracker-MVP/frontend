import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User, BackendUserResponse } from '@/types/user'
import { parseJWT, isTokenExpired } from '@/utils/auth'

interface AuthState {
    // State
    user: User | null
    token: string | null
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

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // Initial state
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Login action
            login: (token: string, userEmail?: string) => {
                try {
                    // Parse token to get user data
                    const tokenData = parseJWT(token)

                    if (!tokenData) {
                        throw new Error('Invalid token format')
                    }

                    console.log('JWT Token Data:', tokenData) // Debug log

                    // Check if token is expired
                    if (isTokenExpired(token)) {
                        throw new Error('Token has expired')
                    }

                    // Create user object from token
                    const user: User = {
                        id: tokenData.userId || tokenData.sub || '',
                        email: tokenData.email || userEmail || tokenData.sub || 'No email',
                        provider: tokenData.provider || 'google',
                        created_at: tokenData.iat ? new Date(tokenData.iat * 1000).toISOString() : new Date().toISOString()
                    }

                    set({
                        user,
                        token,
                        isAuthenticated: true,
                        error: null,
                        isLoading: false
                    })

                } catch (error) {
                    console.error('Login error:', error)
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        error: error instanceof Error ? error.message : 'Login failed',
                        isLoading: false
                    })
                }
            },

            // Logout action
            logout: async () => {
                try {
                    const { token } = get()

                    // Call backend logout endpoint
                    if (token) {
                        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/logout`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                            credentials: 'include'
                        })
                    }
                } catch (error) {
                    console.error('Error during logout:', error)
                } finally {
                    // Always clear auth state regardless of backend response
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        error: null,
                        isLoading: false
                    })
                }
            },

            // Clear error
            clearError: () => {
                set({ error: null })
            },

            // Set loading state
            setLoading: (loading: boolean) => {
                set({ isLoading: loading })
            },

            // Set error
            setError: (error: string | null) => {
                set({ error })
            },

            // Update user data
            updateUser: (userData: Partial<User>) => {
                const currentUser = get().user
                if (currentUser) {
                    set({
                        user: { ...currentUser, ...userData }
                    })
                }
            },

            // Check authentication status
            checkAuth: () => {
                const { token } = get()

                if (!token) {
                    set({ isAuthenticated: false, user: null })
                    return false
                }

                if (isTokenExpired(token)) {
                    // Token expired, clear auth state
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        error: 'Session expired'
                    })
                    return false
                }

                set({ isAuthenticated: true, error: null })
                return true
            },

            // Initialize auth state (call on app startup)
            initializeAuth: () => {
                const { token, checkAuth } = get()

                if (token) {
                    checkAuth()
                } else {
                    set({ isLoading: false })
                }
            },

            // Fetch current user from backend
            fetchCurrentUser: async () => {
                try {
                    const { token } = get()

                    if (!token) {
                        throw new Error('No authentication token')
                    }

                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/user`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include'
                    })

                    if (!response.ok) {
                        throw new Error(`Failed to fetch user: ${response.status}`)
                    }

                    const responseData: BackendUserResponse = await response.json()
                    console.log('Backend user response:', responseData) // Debug log

                    // Handle the nested structure from your backend
                    if (responseData.authenticated && responseData.user) {
                        const backendUser = responseData.user

                        // Map backend fields to our User interface
                        const user: User = {
                            id: backendUser.id,
                            email: backendUser.email,
                            provider: backendUser.provider,
                            created_at: backendUser.createdAt
                        }

                        set({
                            user,
                            isAuthenticated: true,
                            error: null
                        })
                    } else {
                        throw new Error('Invalid response format from backend')
                    }
                } catch (error) {
                    console.error('Error fetching current user:', error)
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch user data',
                        isAuthenticated: false
                    })
                }
            },

            // Refresh authentication token
            refreshToken: async () => {
                try {
                    const { token } = get()

                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/refresh`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include'
                    })

                    if (!response.ok) {
                        throw new Error('Failed to refresh token')
                    }

                    const data = await response.json()

                    if (data.token) {
                        // Update token and parse user data if needed
                        const tokenData = parseJWT(data.token)

                        if (tokenData) {
                            const user: User = {
                                id: tokenData.userId || tokenData.sub || '',
                                email: tokenData.email || tokenData.sub || 'No email',
                                provider: tokenData.provider || 'google',
                                created_at: tokenData.iat ? new Date(tokenData.iat * 1000).toISOString() : new Date().toISOString()
                            }

                            set({
                                token: data.token,
                                user,
                                isAuthenticated: true,
                                error: null
                            })

                            return true
                        }
                    }

                    return false
                } catch (error) {
                    console.error('Error refreshing token:', error)
                    set({
                        error: error instanceof Error ? error.message : 'Failed to refresh token'
                    })
                    return false
                }
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated
            }), // only persist these fields
        }
    )
)

// Selectors for easy access to specific state
export const useAuth = () => {
    const auth = useAuthStore()
    return {
        user: auth.user,
        token: auth.token,
        isAuthenticated: auth.isAuthenticated,
        isLoading: auth.isLoading,
        error: auth.error
    }
}

export const useAuthActions = () => {
    const auth = useAuthStore()
    return {
        login: auth.login,
        logout: auth.logout,
        clearError: auth.clearError,
        setLoading: auth.setLoading,
        setError: auth.setError,
        updateUser: auth.updateUser,
        checkAuth: auth.checkAuth,
        initializeAuth: auth.initializeAuth,
        fetchCurrentUser: auth.fetchCurrentUser,
        refreshToken: auth.refreshToken
    }
}