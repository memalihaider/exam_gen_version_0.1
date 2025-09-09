"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { useEffect } from 'react';
import { useUser } from "@/contexts/UserContext" // Add this import

export default function ChangePasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const { user } = useUser(); // Move this up with other hooks

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user, router]); // Add proper dependencies

  if (!user) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    // Add your password change logic here
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Change Password</h1>
        {/* Add your password change form here */}
      </div>
    </ProtectedRoute>
  )
}