"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/UserContext"

export function AuthForm() {
  const router = useRouter()
  const { login } = useUser()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("Submitting login for:", email);
    console.log("Password:", password);
    try {
      const response = await fetch("https://edu.largifysolutions.com/auth.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "Origin": "http://localhost:3000"
        },
        mode: "cors",
        body: JSON.stringify({
          action: "login",
          email,
          password,
        }),
      })
      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (data.success) {
        // Store user data
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userRole", data.user.role);
        
        // Call login from UserContext
        login(data.user);
        
        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError("An error occurred during login");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  )
}

