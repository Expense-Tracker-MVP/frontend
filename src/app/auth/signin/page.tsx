"use client"

import React, { useState } from 'react'
import GoogleButton from '@/components/GoogleButton'

const SignInPage = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement Google OAuth signin logic here
      console.log("Google sign in clicked!")
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
    } catch (error) {
      console.error("Google sign in failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
          <p className="mt-2 text-gray-600">Welcome back!</p>
        </div>
        
        <div className="space-y-4">
          <GoogleButton 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          />
          
          {isLoading && (
            <p className="text-center text-gray-500">Signing in...</p>
          )}
          
          {/* Navigation */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/auth/signup" className="text-blue-600 hover:text-blue-500">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInPage