import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User } from '@ui/lib/types/user'
import type { AuthState } from '@/ui/lib/types/auth'
import { logoutApi, fetchCurrentUserApi, refreshTokenApi } from '@ui/lib/apis/auth'

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // Initial state
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Login action - now just sets authenticated state
            // TODO: Currently not used. Consider removing.
            login: () => {
                set({
                    isAuthenticated: true,
                    error: null,
                    isLoading: false
                })
            },

            // Logout action
            logout: async () => {
                try {
                    await logoutApi()
                } catch (error) {
                    console.error('Error during logout:', error)
                } finally {
                    // Always clear auth state regardless of backend response
                    set({
                        user: null,
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
            // TODO: this has a side effects which is fetching user data. Consider excluding that.
            checkAuth: async () => {
                try {
                    set({ isLoading: true })
                    
                    const user = await fetchCurrentUserApi()
                    set({ 
                        isAuthenticated: true, 
                        user,
                        error: null,
                        isLoading: false
                    })
                    return true
                } catch (error) {
                    console.error('Auth check failed:', error)
                    set({ isAuthenticated: false, user: null, isLoading: false })
                    return false
                }
            },

            // Initialize auth state (call on app startup)
            initializeAuth: async () => {
                // Set loading state first
                set({ isLoading: true })
                
                // Try to refresh token silently
                const refreshed = await get().refreshToken()
                
                if (refreshed) {
                    set({ isAuthenticated: true, isLoading: false })
                } else {
                    set({ isAuthenticated: false, user: null, isLoading: false })
                }
            },

            // Fetch current user from backend
            fetchCurrentUser: async () => {
                try {
                    const user = await fetchCurrentUserApi()
                    set({
                        user,
                        isAuthenticated: true,
                        error: null
                    })
                } catch (error) {
                    console.error('Error fetching current user:', error)
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch user data',
                        isAuthenticated: false
                    })
                }
            },

            refreshToken: async () => {
                try {
                    const user = await refreshTokenApi()
                    
                    if (user) {
                        set({
                            user,
                            isAuthenticated: true,
                            error: null,
                        })
                        return true
                    }

                    return false
                } catch (error) {
                    console.error('Error refreshing token:', error)
                    set({
                        error: error instanceof Error ? error.message : 'Failed to refresh token',
                    })
                    return false
                }
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
            }),
            onRehydrateStorage: () => {
                return (state) => {
                    if (state) {
                        state.isLoading = true
                        state.isAuthenticated = false // Reset until token is refreshed
                    }
                }
            }
        }
    )
)

// Selectors for easy access to specific state
export const useAuthState = () => {
    const auth = useAuthStore()
    return {
        user: auth.user,
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