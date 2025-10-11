"use client"

import React from 'react'
import GoogleButton from '@/components/GoogleButton'
import { useGoogleAuth } from '@/hooks/useGoogleAuth'

const SignUpPage = () => {
  const { isGoogleAuthLoading, handleGoogleAuth } = useGoogleAuth()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sign Up</h1>
          <p className="mt-2 text-gray-600">Create your account</p>
        </div>
        
        <div className="space-y-4">
          <GoogleButton 
            onClick={handleGoogleAuth}
            disabled={isGoogleAuthLoading}
          />
          
          {isGoogleAuthLoading && (
            <p className="text-center text-gray-500">Signing up with Google...</p>
          )}
          
          {/* You can add other signup methods here */}
          <div className="text-center">
            <span className="text-gray-500">or</span>
          </div>
          
          {/* Email signup form would go here */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/auth/signin" className="text-blue-600 hover:text-blue-500">
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