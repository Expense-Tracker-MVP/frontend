"use client"

import React, { useState, useEffect } from 'react'
import { User } from '@/lib/types/user'
import { useAuth, useAuthActions } from '@/lib/store/authStore'
import { authenticatedFetch } from '@/lib/utils/auth'

const ProfilePage = () => {
    const { user, isAuthenticated, token, isLoading: authLoading } = useAuth()
    const { logout, fetchCurrentUser, checkAuth } = useAuthActions()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Only fetch additional profile data if we're authenticated
        if (isAuthenticated && user) {
            fetchUserProfile()
        } else if (!authLoading && !isAuthenticated) {
            // Redirect to signin if not authenticated and auth loading is complete
            window.location.href = '/auth/signin'
        }
    }, [isAuthenticated, authLoading])

    const fetchUserProfile = async () => {
        try {
            setIsLoading(true)

            // Check if user is authenticated
            if (!isAuthenticated || !token) {
                window.location.href = '/auth/signin'
                return
            }

            // Check auth status (handles token expiration)
            if (!checkAuth()) {
                window.location.href = '/auth/signin'
                return
            }

            // Use the new fetchCurrentUser method from Zustand store
            await fetchCurrentUser()
        } catch (err) {
            if (err instanceof Error && err.message.includes('token')) {
                // Token related error, redirect to signin
                window.location.href = '/auth/signin'
                return
            }
            setError(err instanceof Error ? err.message : 'Failed to load profile')
            console.error('Error fetching profile:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getProviderDisplayName = (provider: string) => {
        switch (provider.toLowerCase()) {
            case 'google':
                return 'Google'
            case 'facebook':
                return 'Facebook'
            case 'github':
                return 'GitHub'
            default:
                return provider.charAt(0).toUpperCase() + provider.slice(1)
        }
    }

    const handleSignOut = async () => {
        try {
            // Call backend logout endpoint if we have a token
            if (token) {
                await authenticatedFetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/logout`, {
                    method: 'POST'
                })
            }
        } catch (err) {
            console.error('Error during logout:', err)
        } finally {
            // Always clear Zustand auth state
            logout()
            // Redirect to signin page
            window.location.href = '/auth/signin'
        }
    }

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Profile</h1>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={fetchUserProfile}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600">No user data found</p>
                    <a href="/auth/signin" className="text-blue-600 hover:text-blue-500 mt-2 inline-block">
                        Sign In
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">
                                    {user.email?.charAt(0)?.toUpperCase() || user.id?.charAt(0)?.toUpperCase() || '?'}
                                </span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{user.email || 'No email available'}</h1>
                                <p className="text-gray-600">
                                    Signed in with {getProviderDisplayName(user.provider)}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Profile Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                User ID
                            </label>
                            <div className="bg-gray-50 p-3 rounded-md">
                                <code className="text-sm text-gray-800 break-all">{user.id}</code>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="bg-gray-50 p-3 rounded-md">
                                <span className="text-sm text-gray-800">{user.email || 'No email available'}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Authentication Provider
                            </label>
                            <div className="bg-gray-50 p-3 rounded-md">
                                <span className="text-sm text-gray-800">{getProviderDisplayName(user.provider)}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Account Created
                            </label>
                            <div className="bg-gray-50 p-3 rounded-md">
                                <span className="text-sm text-gray-800">{formatDate(user.created_at)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Additional Actions */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>
                        <div className="flex flex-wrap gap-3">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                                Edit Profile
                            </button>
                            <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
                                Privacy Settings
                            </button>
                            <button className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors">
                                Export Data
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-6 text-center">
                    <a
                        href="/"
                        className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                        ← Back to Dashboard
                    </a>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
