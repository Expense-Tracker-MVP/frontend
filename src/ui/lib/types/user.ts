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

export type CreateUserResponse = {
    status: "success" | "error"
    message?: string
    data?: User
}

export type LogoutResponse = {
    success: boolean
    message?: string
}

export type RefreshTokenResponse = {
    user?: User
    message?: string
}

export interface UserProfileData {
    user: User
    // Add any additional profile data here
}