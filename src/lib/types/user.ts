export interface User {
    id: string
    email: string
    provider: string
    created_at: string  // This will be mapped from backend's createdAt
}

// Backend response structure
export interface BackendUserResponse {
    authenticated: boolean
    user: {
        id: string
        email: string
        provider: string
        createdAt: string
    }
}

export interface UserProfileData {
    user: User
    // Add any additional profile data here
}