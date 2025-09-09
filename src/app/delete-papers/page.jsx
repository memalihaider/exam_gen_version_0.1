"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { toast, Toaster } from "react-hot-toast"
import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function DeletedPapers() {
  const [papers, setPapers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState(false)

  useEffect(() => {
    fetchDeletedPapers()
  }, [])

  const fetchDeletedPapers = async () => {
    try {
      setLoading(true)
      // Add a cache-busting parameter to prevent caching issues
      const timestamp = new Date().getTime()
      const response = await fetch(`https://edu.largifysolutions.com/api-papers.php?status=DELETED&_t=${timestamp}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
      })

      // First check if we can parse the response
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        if (response.status === 404) {
          setPapers([])
          return
        }
        // Handle 500 error specifically
        if (response.status === 500) {
          setPapers([])
          toast.error("Database connection error. Please try again in a few minutes.")
          return
        }
        throw new Error(data?.message || `Server error: ${response.status}`)
      }

      // Check if data is valid
      if (!data) {
        setPapers([])
        toast.error("No data received from server")
        return
      }

      // Set papers data
      setPapers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching papers:", error)
      setPapers([])
      if (!navigator.onLine) {
        toast.error("You are offline. Please check your internet connection.")
      } else {
        toast.error("Unable to connect to server. Please try again later.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async (paperId) => {
    try {
      const response = await fetch(`https://edu.largifysolutions.com/api-papers.php/${paperId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ status: "SAVED" }),
      })

      if (!response.ok) {
        if (response.status === 500) {
          throw new Error("Database error. Please try again.")
        }
        throw new Error("Failed to restore paper")
      }

      toast.success("Paper restored successfully")
      fetchDeletedPapers()
    } catch (error) {
      console.error("Error restoring paper:", error)
      toast.error(error.message)
    }
  }

  const handlePermanentDelete = async (paperId) => {
    if (!confirm("Are you sure you want to permanently delete this paper? This action cannot be undone.")) {
      return
    }

    try {
      // First, remove the paper from the local state immediately for better UX
      setPapers((prevPapers) => prevPapers.filter((paper) => paper.id !== paperId))

      // Clear any previous debug info
      setDebugInfo(null)

      // Create the payload
      const deletePayload = {
        id: paperId,
        action: "permanent_delete",
        force: true,
      }

      console.log("Attempting to delete paper with ID:", paperId)

      // Try using XMLHttpRequest instead of fetch for better error handling
      const xhr = new XMLHttpRequest()
      xhr.open("DELETE", "https://edu.largifysolutions.com/api-papers.php", true)
      xhr.setRequestHeader("Content-Type", "application/json")
      xhr.setRequestHeader("Accept", "application/json")

      // Set up response handler
      xhr.onload = () => {
        let responseData
        try {
          responseData = JSON.parse(xhr.responseText)
        } catch (e) {
          responseData = { raw: xhr.responseText }
        }

        if (debugInfo) {
          setDebugInfo({
            request: deletePayload,
            response: responseData,
            status: xhr.status,
            ok: xhr.status >= 200 && xhr.status < 300,
          })
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          toast.success("Paper permanently deleted")

          // Force refresh the papers list after a delay
          setTimeout(() => {
            fetchDeletedPapers()
          }, 1000)
        } else {
          toast.error(`Failed to delete paper: ${xhr.status}`)
          fetchDeletedPapers() // Revert UI change
        }
      }

      // Error handler
      xhr.onerror = () => {
        console.error("Network error occurred")
        if (debugInfo) {
          setDebugInfo({
            request: deletePayload,
            response: { error: "Network error" },
            status: 0,
            ok: false,
          })
        }
        toast.error("Network error. Please check your connection.")
        fetchDeletedPapers() // Revert UI change
      }

      // Send the request
      xhr.send(JSON.stringify(deletePayload))

      // Fallback: Try to update the status to a special value that you can filter out in the UI
      try {
        const updateResponse = await fetch(`https://edu.largifysolutions.com/api-papers.php/${paperId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            status: "PERMANENTLY_DELETED",
            deleted_at: new Date().toISOString(),
          }),
        })

        console.log("Fallback update response:", updateResponse.ok)
      } catch (updateError) {
        console.error("Fallback update failed:", updateError)
      }
    } catch (error) {
      console.error("Error in delete handler:", error)
      toast.error(error.message || "Failed to delete paper")
      fetchDeletedPapers() // Revert UI change
    }
  }

  // Filter papers based on search query and exclude any with PERMANENTLY_DELETED status
  const filteredPapers = papers.filter(
    (paper) =>
      paper.status !== "PERMANENTLY_DELETED" &&
      (paper.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.subject.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pattern-grid-lg">
      <div className="container mx-auto px-4 py-12">
        {/* Enhanced Header Section */}
        <div className="mb-16 text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-blue-500/5 blur-3xl -z-10" />
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Deleted Papers
          </h1>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Manage your deleted papers. You can restore papers or permanently delete them from the system.
          </p>
          <div className="flex items-center justify-center gap-3 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">Deleted Papers</span>
          </div>
        </div>

        {/* Debug Info Panel (only visible when there's debug info) */}
        {debugInfo ? (
          <div className="max-w-4xl mx-auto mb-8 bg-white rounded-xl shadow-lg p-6 overflow-auto">
            <h3 className="text-lg font-semibold mb-2">Debug Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-gray-500 mb-1">Request</h4>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(debugInfo.request, null, 2)}
                </pre>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-500 mb-1">Response</h4>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(debugInfo.response, null, 2)}
                </pre>
              </div>
            </div>
            <div className="mt-2 text-sm">
              <span className="font-medium">Status:</span> {debugInfo.status} ({debugInfo.ok ? "OK" : "Failed"})
            </div>
            <button onClick={() => setDebugInfo(false)} className="mt-3 px-3 py-1 bg-gray-200 rounded text-sm">
              Hide Debug Info
            </button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto mb-4 flex justify-end">
            <button
              onClick={() => setDebugInfo({ request: {}, response: {}, status: 0, ok: false })}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Show Debug Panel
            </button>
          </div>
        )}

        {/* Enhanced Search and Actions Bar */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-lg bg-opacity-90">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search papers by class, subject, or date..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-gray-700"
                />
                <svg
                  className="w-6 h-6 text-gray-400 absolute left-5 top-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={fetchDeletedPapers}
                  className="px-8 py-4 bg-white border-2 border-gray-100 text-gray-700 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh
                </button>
                <button className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl hover:from-indigo-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                  Arrange Papers
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {filteredPapers.map(
            (
              paper,
              index, // Changed from papers to filteredPapers
            ) => (
              <div
                key={paper.id} // Changed from index to paper.id for better key management
                className="group relative transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-300" />
                <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="h-3 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-t-2xl" />
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">{paper.class}</h2>
                      <span className="px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-sm font-medium flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                        Deleted
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-700 mb-6">{paper.subject}</h3>

                    <div className="space-y-4">
                      <p className="flex items-center gap-3 text-gray-600">
                        <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Exam Date: {paper.date}
                      </p>
                      <p className="flex items-center gap-3 text-gray-600">
                        <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Duration: {paper.duration || "N/A"} minutes
                      </p>
                      <p className="flex items-center gap-3 text-gray-600">
                        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        Total Marks: {paper.totalMarks}
                      </p>
                      <p className="flex items-center gap-3 text-gray-600">
                        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 2 0 01-2 2z"
                          />
                        </svg>
                        Paper Type: {paper.paperType || "Standard"}
                      </p>
                      <p className="flex items-center gap-3 text-gray-600">
                        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Created By: {paper.generatedBy}
                      </p>
                      <p className="flex items-center gap-3 text-gray-600">
                        <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Created On: {new Date(paper.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-4">
                      <button
                        onClick={() => handlePermanentDelete(paper.id)}
                        className="px-6 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete Permanently
                      </button>
                      <button
                        onClick={() => handleRestore(paper.id)}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl hover:from-indigo-600 hover:to-blue-700 transition-all shadow-md hover:shadow-xl flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Restore
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
    </ProtectedRoute>
  )
}

