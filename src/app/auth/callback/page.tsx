"use client"

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthActions } from '@/lib/store/authStore'

const AuthCallbackPage = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { login, setError, setLoading } = useAuthActions()
    const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
    const [error, setLocalError] = useState<string | null>(null)

    useEffect(() => {
        handleAuthCallback()
    }, [])

    const handleAuthCallback = async () => {
        try {
            setLoading(true)

            // Extract token and user info from URL parameters
            const token = searchParams.get('token')
            const user = searchParams.get('user')

            if (!token) {
                throw new Error('No authentication token received')
            }

            // Use Zustand store to handle login
            login(token, user ? decodeURIComponent(user) : undefined)

            setStatus('success')

            // Redirect to profile or dashboard after a brief success message
            setTimeout(() => {
                router.push('/profile')
            }, 2000)

        } catch (err) {
            console.error('Authentication callback error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Authentication failed'
            setLocalError(errorMessage)
            setError(errorMessage)
            setStatus('error')
        } finally {
            setLoading(false)
        }
    }

    const handleRetryAuth = () => {
        // Clear auth state and redirect to signin
        router.push('/sign-in')
    }

    if (status === 'processing') {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto" style={{ borderColor: 'var(--primary)' }}></div>
                    <h1 className="mt-6 text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>Processing Authentication</h1>
                    <p className="mt-2" style={{ color: 'var(--gray)' }}>Please wait while we complete your sign-in...</p>
                </div>
            </div>
        )
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
                <div className="text-center">
                    <div className="text-6xl mb-4" style={{ color: 'var(--primary)' }}>✅</div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Authentication Successful!</h1>
                    <p className="mb-4" style={{ color: 'var(--gray)' }}>Welcome! You've been successfully signed in.</p>
                    <p className="text-sm" style={{ color: 'var(--gray)' }}>Redirecting to your profile...</p>
                    <div className="mt-6">
                        <div className="w-64 rounded-full h-2 mx-auto" style={{ background: 'var(--gray)' }}>
                            <div className="h-2 rounded-full animate-pulse" style={{ width: '100%', background: 'var(--primary)' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
                <div className="max-w-md w-full space-y-8 p-8 rounded-lg shadow-md" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
                    <div className="text-center">
                        <div className="text-6xl mb-4" style={{ color: '#e53935' }}>❌</div>
                        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Authentication Failed</h1>
                        <p className="mb-4" style={{ color: 'var(--gray)' }}>{error}</p>
                        <div className="space-y-3">
                            <button
                                onClick={handleRetryAuth}
                                className="w-full px-4 py-2 rounded-md transition-colors"
                                style={{ background: 'var(--primary)', color: 'var(--background)' }}
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => router.push('/')}
                                className="w-full px-4 py-2 rounded-md transition-colors"
                                style={{ background: 'var(--gray)', color: 'var(--background)' }}
                            >
                                Go to Homepage
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return null
}

export default AuthCallbackPage