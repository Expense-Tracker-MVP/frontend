import { fetchWithAuth } from '@ui/lib/utils/fetchWithAuth'
import type { User, CreateUserResponse, BackendUserResponse, LogoutResponse, RefreshTokenResponse } from '@ui/lib/types/user'

const BASE_URL = import.meta.env.VITE_PUBLIC_BACKEND_URL

export async function createUserApi(user: User): Promise<User> {
    const res = await fetchWithAuth(`${BASE_URL}/api/v1/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(user),
    })

    if (!res.ok) {
        let msg = `Request failed with status ${res.status}`
        try {
            const json: CreateUserResponse = await res.json()
            if (json?.message) msg = json.message
        } catch (_err) {
            // ignore parse errors
        }
        throw new Error(msg)
    }

    const json: CreateUserResponse = await res.json()
    if (!json || json.status !== 'success' || !json.data) {
        throw new Error(json?.message ?? 'Unexpected response from server')
    }

    return json.data
}

export async function logoutApi(): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })

    if (!res.ok) {
        let msg = `Logout failed with status ${res.status}`
        try {
            const json: LogoutResponse = await res.json()
            if (json?.message) msg = json.message
        } catch (_err) {
            // ignore parse errors
        }
        throw new Error(msg)
    }
}

export async function fetchCurrentUserApi(): Promise<User> {
    const res = await fetchWithAuth(`${BASE_URL}/api/v1/auth/user`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (!res.ok) {
        throw new Error(`Failed to fetch user: ${res.status}`)
    }

    const responseData: BackendUserResponse = await res.json()

    if (!responseData.authenticated || !responseData.user) {
        throw new Error('Invalid response format from backend')
    }

    const user: User = {
        id: responseData.user.id,
        email: responseData.user.email,
        provider: responseData.user.provider,
        created_at: responseData.user.createdAt
    }

    return user
}

export async function refreshTokenApi(): Promise<User | null> {
    const res = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })

    if (!res.ok) {
        throw new Error('Failed to refresh token')
    }

    const data: RefreshTokenResponse = await res.json()

    return data.user ?? null
}

export default {
    createUserApi,
    logoutApi,
    fetchCurrentUserApi,
    refreshTokenApi,
}
