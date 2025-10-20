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
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
                    <h1 className="mt-6 text-2xl font-semibold text-gray-900">Processing Authentication</h1>
                    <p className="mt-2 text-gray-600">Please wait while we complete your sign-in...</p>
                </div>
            </div>
        )
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-green-500 text-6xl mb-4">✅</div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Authentication Successful!</h1>
                    <p className="text-gray-600 mb-4">Welcome! You've been successfully signed in.</p>
                    <p className="text-sm text-gray-500">Redirecting to your profile...</p>

                    <div className="mt-6">
                        <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto">
                            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                        <div className="text-red-500 text-6xl mb-4">❌</div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h1>
                        <p className="text-gray-600 mb-4">{error}</p>

                        <div className="space-y-3">
                            <button
                                onClick={handleRetryAuth}
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Try Again
                            </button>

                            <button
                                onClick={() => router.push('/')}
                                className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
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