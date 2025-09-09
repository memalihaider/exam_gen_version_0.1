"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/UserContext"

export function ProtectedRoute({ children, adminOnly = false }) {
  const router = useRouter()
  const { user, loading } = useUser()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (!loading && adminOnly && user?.role !== "super_admin" && user?.role !== "admin") {
      router.push("/dashboard")
      return
    }
  }, [user, loading, router, adminOnly])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return user ? children : null;
}