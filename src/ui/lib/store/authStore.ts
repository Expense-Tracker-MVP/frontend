import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { type User, type BackendUserResponse } from '@ui/lib/types/user'
import { isTokenExpired } from '@ui/lib/utils/auth'
import type { AuthState } from '@/ui/lib/types/auth'

const BASE_URL = import.meta.env.VITE_PUBLIC_BACKEND_URL

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // Initial state
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Login action
            login: (accessToken: string) => {
                try {
                    // Check if token is expired
                    if (isTokenExpired(accessToken)) {
                        throw new Error('Token has expired')
                    }

                    set({
                        accessToken: accessToken,
                        isAuthenticated: true,
                        error: null,
                        isLoading: false
                    })

                } catch (error) {
                    console.error('Login error:', error)
                    set({
                        accessToken: null,
                        isAuthenticated: false,
                        error: error instanceof Error ? error.message : 'Login failed',
                        isLoading: false
                    })
                }
            },

            // Logout action
            logout: async () => {
                try {
                    const { accessToken } = get()

                    // Call backend logout endpoint
                    if (accessToken) {
                        await fetch(`${BASE_URL}/api/v1/auth/logout`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${accessToken}`,
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
                        accessToken: null,
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
                const { accessToken } = get()

                if (!accessToken) {
                    set({ isAuthenticated: false, user: null })
                    return false
                }

                if (isTokenExpired(accessToken)) {
                    // Token expired, clear auth state
                    set({
                        user: null,
                        accessToken: null,
                        isAuthenticated: false,
                        error: 'Session expired'
                    })
                    return false
                }

                set({ isAuthenticated: true, error: null })
                return true
            },

            // Initialize auth state (call on app startup)
            initializeAuth: async () => {
                // Set loading state first
                set({ isLoading: true })

                // Call the refreshToken action from the store (use get())
                await get().refreshToken()
                const { accessToken, checkAuth } = get()

                if (accessToken) {
                    checkAuth()
                }

                // Always set loading to false when done
                set({ isLoading: false })
            },

            // Fetch current user from backend
            fetchCurrentUser: async () => {
                try {
                    const { accessToken } = get()

                    if (!accessToken) {
                        throw new Error('No access token')
                    }

                    const response = await fetch(`${BASE_URL}/api/v1/auth/user`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
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

            refreshToken: async () => {
                try {
                    const response = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include', // sends refresh cookie
                    });

                    if (!response.ok) {
                        throw new Error('Failed to refresh token');
                    }

                    const data = await response.json();
                    console.log('Token refresh response:', data); // Debug log
                    if (data.accessToken) {
                        // Update token and user info directly from backend
                        set({
                            accessToken: data.accessToken,
                            user: data.user,
                            isAuthenticated: true,
                            error: null,
                        });

                        return true;
                    }

                    return false;
                } catch (error) {
                    console.error('Error refreshing token:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to refresh token',
                    });
                    return false;
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
export const useAuth = () => {
    const auth = useAuthStore()
    return {
        user: auth.user,
        token: auth.accessToken,
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