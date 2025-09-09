"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Users, BookOpen, FileText, Plus } from "lucide-react"
import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function TeachersDashboard() {
  const [teacherStats, setTeacherStats] = useState({
    totalTeachers: 0,
    activeTeachers: 0,
    totalSubjects: 0,
    papersGenerated: 0,
  })

  // Example fetching logic
  useEffect(() => {
    const fetchStats = async () => {
      const response = await fetch("https://edu.largifysolutions.com/api-teachers.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAllTeachers" }),
      })
      const data = await response.json()
      if (data.success) {
        setTeacherStats({
          totalTeachers: data.teachers.length,
          activeTeachers: data.teachers.filter((t: any) => t.status === "active").length,
          totalSubjects: new Set(data.teachers.flatMap((t: any) => t.subject)).size,
          papersGenerated: 247, // replace with API later
        })
      }
    }
    fetchStats()
  }, [])

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold mb-8 text-blue-600">Teachers Dashboard</h1>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <StatCard icon={<Users className="w-8 h-8 text-blue-600" />} label="Total Teachers" value={teacherStats.totalTeachers} />
            <StatCard icon={<Users className="w-8 h-8 text-green-600" />} label="Active Teachers" value={teacherStats.activeTeachers} />
            <StatCard icon={<BookOpen className="w-8 h-8 text-cyan-600" />} label="Subjects" value={teacherStats.totalSubjects} />
            <StatCard icon={<FileText className="w-8 h-8 text-amber-600" />} label="Papers" value={teacherStats.papersGenerated} />
          </div>

          {/* Button to go to Teacher Management */}
          <div className="flex justify-center">
            <Link
              href="/admin/teachers/manage"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg flex items-center gap-2 hover:from-blue-600 hover:to-cyan-700"
            >
              <Plus className="w-5 h-5" />
              Manage Teachers
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
      <div className="p-4 bg-gray-50 rounded-xl">{icon}</div>
      <div>
        <p className="text-gray-500">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  )
}
