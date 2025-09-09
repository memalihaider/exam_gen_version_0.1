'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function TeacherProtectedRoute({ children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkTeacherAuth = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
          router.push("/login");
          return;
        }

        const response = await fetch("https://edu.largifysolutions.com/auth.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            action: "checkAuth",
            email: userEmail,
          }),
        });

        const data = await response.json();
        
        // Only allow admin and administrator roles
        if (data.success && (data.user?.role === "admin" || data.user?.role === "administrator")) {
          setIsAuthorized(true);
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkTeacherAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthorized ? children : null;
}