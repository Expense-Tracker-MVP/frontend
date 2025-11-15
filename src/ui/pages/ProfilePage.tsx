import { useState, useEffect } from 'react'
import { useAuthState, useAuthActions } from '@ui/lib/store/authStore'

const ProfilePage = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthState()
  const { logout, fetchCurrentUser } = useAuthActions()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated && !authLoading && !user) {
      fetchUserProfile()
    }
  }, [isAuthenticated, authLoading, user])

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true)
      await fetchCurrentUser()
    } catch (err) {
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
    await logout()
    window.location.href = '/sign-in'
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-slate-300">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="max-w-md w-full space-y-8 p-8 bg-[var(--surface)] rounded-lg shadow-md">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">Error Loading Profile</h1>
            <p className="text-gray-600 dark:text-slate-300 mb-4">{error}</p>
            <button
              onClick={fetchUserProfile}
              className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
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
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <p className="text-gray-600 dark:text-slate-300">No user data found</p>
          <a href="/sign-in" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 mt-2 inline-block">
            Sign In
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-[var(--surface)] rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {user.email?.charAt(0)?.toUpperCase() || user.id?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">{user.email || 'No email available'}</h1>
                <p className="text-gray-600 dark:text-slate-300">
                  Signed in with {getProviderDisplayName(user.provider)}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-red-600 dark:bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-[var(--surface)] rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-6">Profile Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                User ID
              </label>
              <div className="bg-[var(--input)] p-3 rounded-md">
                <code className="text-sm text-gray-800 dark:text-slate-100 break-all">{user.id}</code>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <div className="bg-[var(--input)] p-3 rounded-md">
                <span className="text-sm text-gray-800 dark:text-slate-100">{user.email || 'No email available'}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Authentication Provider
              </label>
              <div className="bg-[var(--input)] p-3 rounded-md">
                <span className="text-sm text-gray-800 dark:text-slate-100">{getProviderDisplayName(user.provider)}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Account Created
              </label>
              <div className="bg-[var(--input)] p-3 rounded-md">
                <span className="text-sm text-gray-800 dark:text-slate-100">{formatDate(user.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Additional Actions */}
          <div className="mt-8 pt-6 border-t border-[var(--border)]">
            <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4">Account Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                Edit Profile
              </button>
              <button className="bg-gray-600 dark:bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 dark:hover:bg-slate-500 transition-colors">
                Privacy Settings
              </button>
              <button className="bg-yellow-600 dark:bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-700 dark:hover:bg-yellow-600 transition-colors">
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
