// Authentication utility functions
export const AuthTokens = {
    // Get the stored auth token
    getToken: (): string | null => {
        if (typeof window === 'undefined') return null
        const raw = localStorage.getItem('auth-storage')
        if (!raw) return null

        try {
            const parsed = JSON.parse(raw)
            return parsed?.state?.token
        } catch (err) {
            console.warn('Failed to parse auth-storage from localStorage', err)
            return null
        }
    },

    // Set the auth token
    setToken: (token: string): void => {
        if (typeof window === 'undefined') return
        localStorage.setItem('authToken', token)
    },

    // Remove the auth token
    removeToken: (): void => {
        if (typeof window === 'undefined') return
        localStorage.removeItem('authToken')
        localStorage.removeItem('userEmail')
    },

    // Get stored user id
    getUserId: (): string | null => {
        if (typeof window === 'undefined') return null
        const raw = localStorage.getItem('auth-storage')
        if (!raw) return null

        try {
            const parsed = JSON.parse(raw)
            return parsed?.state?.user?.id ?? null
        } catch (err) {
            console.warn('Failed to parse auth-storage from localStorage', err)
            return null
        }
    },

    // Get stored user email
    getUserEmail: (): string | null => {
        if (typeof window === 'undefined') return null
        return localStorage.getItem('userEmail')
    },

    // Set user email
    setUserEmail: (email: string): void => {
        if (typeof window === 'undefined') return
        localStorage.setItem('userEmail', email)
    },

    // Check if user is authenticated
    isAuthenticated: (): boolean => {
        return !!AuthTokens.getToken()
    }
}

// Parse JWT token
export const parseJWT = (token: string) => {
    try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))

        return JSON.parse(jsonPayload)
    } catch (error) {
        console.error('Error parsing JWT:', error)
        return null
    }
}

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
    try {
        const payload = parseJWT(token)
        if (!payload || !payload.exp) return true

        const currentTime = Date.now() / 1000
        return payload.exp < currentTime
    } catch (error) {
        return true
    }
}

// API request helper with httpOnly cookie authentication
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...options.headers
    }

    return fetch(url, {
        ...options,
        headers: defaultHeaders,
        credentials: 'include' // This automatically sends httpOnly cookies
    })
}