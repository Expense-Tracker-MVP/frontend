import { refreshTokenApi } from '@ui/lib/apis/auth'

let isRefreshing = false
let failedQueue: Array<{
    resolve: (value?: unknown) => void
    reject: (reason?: unknown) => void
}> = []

const processQueue = (error: Error | null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve()
        }
    })
    failedQueue = []
}

export const fetchWithAuth = async (
    url: string,
    options: RequestInit = {}
): Promise<Response> => {
    // Ensure credentials are included
    const config: RequestInit = {
        ...options,
        credentials: 'include',
    }

    let response = await fetch(url, config)

    if (response.status === 401) {
        if (isRefreshing) {
            // If a refresh is already in progress, queue this request
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject })
            }).then(() => {
                // Retry the original request after refresh completes
                return fetch(url, config)
            })
        }

        isRefreshing = true

        try {
            const user = await refreshTokenApi()
            
            if (user) {
                processQueue(null)
                isRefreshing = false
                return fetch(url, config)
            } else {
                processQueue(new Error('Token refresh failed'))
                isRefreshing = false

                if (!window.location.pathname.includes('/sign-in') && !window.location.pathname.includes('/sign-up')) {
                    window.location.href = '/sign-in'
                }

                throw new Error('Session expired. Please log in again.')
            }
        } catch (error) {
            processQueue(error instanceof Error ? error : new Error('Unknown error'))
            isRefreshing = false

            if (!window.location.pathname.includes('/sign-in') && !window.location.pathname.includes('/sign-up')) {
                window.location.href = '/sign-in'
            }
            throw error
        }
    }

    return response
}