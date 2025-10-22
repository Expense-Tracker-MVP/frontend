"use client"

import React from 'react'
import GoogleButton from '@/components/GoogleButton'
import { useGoogleAuth } from '@/lib/hooks/useGoogleAuth'

const SignUpPage = () => {
  const { isGoogleAuthLoading, handleGoogleAuth } = useGoogleAuth()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-70">
      <div className="max-w-md w-full space-y-8 p-8 rounded-lg shadow-md dark:outline-1 outline-gray-200 dark:outline-gray-900 bg-[var(--surface)]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Sign In</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Create your account</p>
        </div>

        <div className="space-y-4">
          <GoogleButton
            onClick={handleGoogleAuth}
            disabled={isGoogleAuthLoading}
          />

          {isGoogleAuthLoading && (
            <p className="text-center text-gray-500">Signing up with Google...</p>
          )}

          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/sign-in" className="text-blue-600 hover:text-blue-500">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage