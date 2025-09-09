"use client"
import { useState, useEffect } from "react"
// import { useEffect } from "react"
import { Users, FileText, BookOpen, History, Search, Plus, Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import Link from "next/link"

export default function TeachersManagement() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [teachers, setTeachers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingTeacher, setEditingTeacher] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [error, setError] = useState("")

  // Form data for adding/editing teachers
  const [formData, setFormData] = useState({
    teacherName: "",
    fatherName: "",
    username: "",
    password: "",
    email: "",
    class: "",
    subject: [],
    address: "",
    profilePicture: null,
    status: "active",
  })

  // Demo data for dropdowns
  const classOptions = ["9th", "10th", "11th", "12th"]
  const subjectOptions = [
    "English",
    "Mathematics",
    "Biology",
    "Chemistry",
    "Physics",
    "Computer Science",
    "History",
    "Urdu",
    "Tarjuma-Quran",
    "Islamyat",
  ]

  // Stats for teacher dashboard
  const [teacherStats, setTeacherStats] = useState({
    totalTeachers: 0,
    activeTeachers: 0,
    totalSubjects: subjectOptions.length,
    papersGenerated: 247,
  })

  // Tabs for teacher dashboard
  const tabs = [
    { id: "overview", label: "Overview", icon: <Users className="w-5 h-5" /> },
    { id: "papers", label: "Papers", icon: <FileText className="w-5 h-5" /> },
    { id: "subjects", label: "Subjects", icon: <BookOpen className="w-5 h-5" /> },
    { id: "activities", label: "Activities", icon: <History className="w-5 h-5" /> },
  ]

  // Modify the useEffect to remove login redirection
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail")
        if (!userEmail) {
          return
        }
        // Fetch teachers data
        fetchTeachers()
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  // Filter teachers based on search query
  const filteredTeachers = teachers.filter((teacher) => {
    if (!searchQuery) return true

    const searchLower = searchQuery.toLowerCase()
    return (
      (teacher.teacherName || teacher.teacher_name || "").toLowerCase().includes(searchLower) ||
      (teacher.fatherName || teacher.father_name || "").toLowerCase().includes(searchLower) ||
      (teacher.username || "").toLowerCase().includes(searchLower) ||
      (teacher.email || "").toLowerCase().includes(searchLower) ||
      (teacher.class || "").toLowerCase().includes(searchLower) ||
      (teacher.subject || []).some((sub) => sub.toLowerCase().includes(searchLower))
    )
  })

  // Add the following function to handle fetching teachers
  const fetchTeachers = async () => {
    try {
      const response = await fetch('https://edu.largifysolutions.com/api-teachers.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          action: 'getAllTeachers',
          email: localStorage.getItem('userEmail')
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data); // Add this for debugging

      if (data.success) {
        setTeachers(data.teachers || []);
        setTeacherStats((prev) => ({
          ...prev,
          totalTeachers: (data.teachers || []).length,
          activeTeachers: (data.teachers || []).filter((t) => t.status === 'active').length,
        }));
      } else {
        console.error("Server error:", data.error);
        setError(data.error || 'Failed to load teachers');
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setError("Connection failed. Please check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add these missing handler functions
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubjectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value)
    setFormData((prev) => ({ ...prev, subject: selectedOptions }))
  }

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher)
    setFormData({
      teacherName: teacher.teacherName || teacher.teacher_name || "",
      fatherName: teacher.fatherName || teacher.father_name || "",
      username: teacher.username || "",
      password: "", // Don't populate password for security
      email: teacher.email || "",
      class: teacher.class || "",
      subject: teacher.subject || [],
      address: teacher.address || "",
      profilePicture: null,
      status: teacher.status || "active",
    })
    setShowModal(true)
  }

  const handleDelete = async (teacherId) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        const response = await fetch('https://edu.largifysolutions.com/api-teachers.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'deleteTeacher',
            teacherId: teacherId
          })
        });

        const data = await response.json();

        if (data.success) {
          // Update local state
          setTeachers(prev => prev.filter(t => t.id !== teacherId));

          // Update stats
          setTeacherStats(prev => ({
            ...prev,
            totalTeachers: prev.totalTeachers - 1,
            activeTeachers: teachers.filter(t => t.status === "active" && t.id !== teacherId).length
          }));

          setSuccessMessage("Teacher deleted successfully");

          // Refresh the teachers list
          await fetchTeachers();
        } else {
          throw new Error(data.error || 'Failed to delete teacher');
        }

        // Clear message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error("Error deleting teacher:", error);
        setError(error.message || "Failed to delete teacher");
        setTimeout(() => setError(""), 3000);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingTeacher) {
        // Handle edit teacher
        const response = await fetch('https://edu.largifysolutions.com/api-teachers.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'updateTeacher',
            teacherId: editingTeacher.id,
            ...formData
          })
        });

        const data = await response.json();
        if (data.success) {
          setTeachers(prev => prev.map(t => t.id === editingTeacher.id ? { ...t, ...formData } : t));
          setSuccessMessage("Teacher updated successfully");
        } else {
          throw new Error(data.error || 'Failed to update teacher');
        }
      } else {
        // Handle add new teacher
        const response = await fetch('https://edu.largifysolutions.com/api-teachers.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'addTeacher',
            ...formData
          })
        });

        const data = await response.json();
        if (data.success) {
          setTeachers(prev => [...prev, data.teacher]);
          setSuccessMessage("Teacher added successfully");
        } else {
          throw new Error(data.error || 'Failed to add teacher');
        }
      }

      // Update stats
      setTeacherStats((prev) => ({
        ...prev,
        totalTeachers: editingTeacher ? teachers.length : teachers.length + 1,
        activeTeachers: teachers.filter((t) => t.status === "active").length + (formData.status === "active" ? 1 : 0),
      }));

      // Reset form and close modal
      setShowModal(false);
      setEditingTeacher(null);
      setFormData({
        teacherName: "",
        fatherName: "",
        username: "",
        password: "",
        email: "",
        class: "",
        subject: [],
        address: "",
        profilePicture: null,
        status: "active",
      });

      // Refresh teachers list
      fetchTeachers();

    } catch (error) {
      console.error("Error saving teacher:", error);
      setError(error.message || "Failed to save teacher");
      setTimeout(() => setError(""), 3000);
    }
  };
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
          return;
        }
        // Fetch teachers data
        fetchTeachers();
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []); // Empty dependency array means this runs once when component mounts

  // Update the ProtectedRoute wrapper in the return statement
  return (
    <ProtectedRoute adminOnly={true}>  {/* Change adminOnly to true and remove duplicate wrapper */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Teachers Management
            </h1>
            <div className="flex items-center justify-center gap-2 text-sm">
              <Link href="/admin" className="text-blue-600 hover:text-blue-800 transition-colors">
                Admin
              </Link>
              <span className="text-gray-500">/</span>
              <span className="text-gray-500">Teachers</span>
            </div>
          </div>

          {/* Dashboard Tabs */}
          <div className="flex space-x-4 mb-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-white shadow-lg text-blue-600" : "hover:bg-white/50 text-gray-600"
                  }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded animate-fade-in-up">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {error && <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">{error}</div>}

          {/* Dashboard Content based on active tab */}
          {activeTab === "overview" && (
            <>
              {/* Dashboard Widgets and Search Bar */}
              <div className="w-[90%] max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {/* Total Teachers */}
                  <div className="bg-white rounded-xl shadow-md p-4 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Total Teachers</p>
                        <p className="text-xl font-bold text-gray-800">{teacherStats.totalTeachers}</p>
                      </div>
                    </div>
                  </div>

                  {/* Active Teachers */}
                  <div className="bg-white rounded-xl shadow-md p-4 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <Users className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Active Teachers</p>
                        <p className="text-xl font-bold text-gray-800">{teacherStats.activeTeachers}</p>
                      </div>
                    </div>
                  </div>

                  {/* Total Subjects */}
                  <div className="bg-white rounded-xl shadow-md p-4 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-cyan-50 rounded-lg">
                        <BookOpen className="w-6 h-6 text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Total Subjects</p>
                        <p className="text-xl font-bold text-gray-800">{teacherStats.totalSubjects}</p>
                      </div>
                    </div>
                  </div>

                  {/* Add Teacher Button */}
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl shadow-md p-4 flex items-center justify-center cursor-pointer transition-all duration-300 hover:from-blue-600 hover:to-cyan-700">
                    <button
                      onClick={() => {
                        setEditingTeacher(null);
                        setFormData({
                          teacherName: "",
                          fatherName: "",
                          username: "",
                          password: "",
                          email: "",
                          class: "",
                          subject: [],
                          address: "",
                          profilePicture: null,
                          status: "active",
                        });
                        setShowModal(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 text-white"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="text-base font-semibold">Add Teacher</span>
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                  <div className="relative w-[90%] md:max-w-2xl">
                    <input
                      type="text"
                      placeholder="Search teachers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    />
                    <Search className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Teachers Table */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100/50 w-[90%]">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 table-auto">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                          Teacher Name
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                          F Name
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                          Username
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                          Class/Category
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredTeachers.length > 0 ? (
                        filteredTeachers.map((teacher) => (
                          <tr key={teacher.id} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.id}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {teacher.teacher_name || teacher.teacherName}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {teacher.father_name || teacher.fatherName}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.username}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.email}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.class}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex flex-wrap gap-1">
                                {teacher.subject.map((sub) => (
                                  <span key={sub} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                    {sub}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${teacher.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                  }`}
                              >
                                {teacher.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleEdit(teacher)}
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                              >
                                <Edit className="w-4 h-4 inline mr-1" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(teacher.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4 inline mr-1" />
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={9} className="px-4 py-4 text-center text-sm text-gray-500">
                            No teachers found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === "papers" && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-6">Recent Papers</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-6 py-3 text-left">Paper Title</th>
                      <th className="px-6 py-3 text-left">Subject</th>
                      <th className="px-6 py-3 text-left">Class</th>
                      <th className="px-6 py-3 text-left">Teacher</th>
                      <th className="px-6 py-3 text-left">Date Created</th>
                      <th className="px-6 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">Mid-term Examination</td>
                      <td className="px-6 py-4">Mathematics</td>
                      <td className="px-6 py-4">Secondary</td>
                      <td className="px-6 py-4">John Smith</td>
                      <td className="px-6 py-4">2024-01-20</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Published</span>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">Final Examination</td>
                      <td className="px-6 py-4">English</td>
                      <td className="px-6 py-4">Primary</td>
                      <td className="px-6 py-4">Sarah Johnson</td>
                      <td className="px-6 py-4">2024-01-15</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">Draft</span>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">Quiz 3</td>
                      <td className="px-6 py-4">Chemistry</td>
                      <td className="px-6 py-4">Higher Secondary</td>
                      <td className="px-6 py-4">David Wilson</td>
                      <td className="px-6 py-4">2024-01-10</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Published</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "subjects" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subjectOptions.map((subject, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{subject}</h3>
                      <p className="text-gray-500 text-sm mt-1">Total Papers: {Math.floor(Math.random() * 50) + 10}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-blue-600 rounded-full" style={{ width: `${Math.random() * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "activities" && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-6">Recent Activities</h3>
              <div className="space-y-4">
                {[
                  { action: "Added new teacher", teacher: "John Smith", time: "2 hours ago" },
                  { action: "Updated teacher information", teacher: "Sarah Johnson", time: "4 hours ago" },
                  { action: "Deleted teacher", teacher: "Michael Brown", time: "1 day ago" },
                  { action: "Added new subject to teacher", teacher: "David Wilson", time: "2 days ago" },
                  { action: "Changed teacher status", teacher: "Emily Davis", time: "3 days ago" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border-b">
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.teacher}</p>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add/Edit Teacher Modal */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div
                className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm"
                onClick={() => setShowModal(false)}
              ></div>
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col relative z-10">
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
                  </h2>
                </div>

                <div className="p-6 overflow-y-auto">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teacher Name</label>
                      <input
                        type="text"
                        name="teacherName"
                        placeholder="Enter teacher name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.teacherName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Father Name</label>
                      <input
                        type="text"
                        name="fatherName"
                        placeholder="Enter father name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.fatherName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <input
                        type="text"
                        name="username"
                        placeholder="Enter username"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter email address"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input
                        type="password"
                        name="password"
                        placeholder={editingTeacher ? "Leave blank to keep current password" : "Enter password"}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.password}
                        onChange={handleInputChange}
                        required={!editingTeacher}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Class/Category</label>
                      <select
                        name="class"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.class}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Class</option>
                        {classOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subjects</label>
                      <select
                        multiple
                        name="subject"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.subject}
                        onChange={handleSubjectChange}
                        required
                      >
                        {subjectOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <small className="text-gray-500">Hold Ctrl button for multi subjects</small>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <textarea
                        name="address"
                        placeholder="Enter address"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        name="status"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                      <div className="mt-1 flex items-center">
                        <label className="w-full flex justify-center px-6 py-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                          <div className="space-y-1 text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4-4m4-4h8m-4-4v8m-12 4h.02"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <span className="relative cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
                                Upload a file
                              </span>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => setFormData((prev) => ({ ...prev, profilePicture: e.target.files[0] }))}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowModal(false)
                          setEditingTeacher(null)
                          setFormData({
                            teacherName: "",
                            fatherName: "",
                            username: "",
                            password: "",
                            email: "",
                            class: "",
                            subject: [],
                            address: "",
                            profilePicture: null,
                            status: "active",
                          })
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        {editingTeacher ? "Update Teacher" : "Add Teacher"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>

  )
}


