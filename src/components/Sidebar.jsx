"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

const Sidebar = () => {
  const { user, logout } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Update the getAccessLevel function to handle teacher role
  const getAccessLevel = (role, packageType) => {
    if (role === "teacher") {
      return { text: "Teacher Access", color: "text-blue-600" };
    }

    switch (packageType) {
      case "pro":
        return { text: "Limited Access", color: "text-amber-600" };
      case "business":
      case "exceptional":
        return { text: "Full Access", color: "text-green-600" };
      default:
        return { text: "Basic Access", color: "text-gray-600" };
    }
  };

  // Menu items with SVG icons from the new sidebar
  const menuItems = [
    // {
    //   title: "Admin Panel",
    //   icon: (
    //     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={2}
    //         d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
    //       />
    //     </svg>
    //   ),
    //   path: "/admin",
    //   adminOnly: true,
    // },
    {
      title: "Dashboard",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
      path: "/dashboard",
    },
    {
      title: "Generate Paper",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
      ),
      path: "/generate-paper",
    },
    {
      title: "Add Questions",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      ),
      path: "/add-questions",
    },
    {
      title: "View Questions",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
      path: "/view-questions",
    },
    {
      title: "Profile",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      path: "/profile",
    },

    {
      title: "Saved Papers",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
          />
        </svg>
      ),
      path: "/saved-papers",
    },
    {
      title: "Past Papers",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      path: "/past-papers",
    },
    {
      title: "Teachers",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      path: "/teachers",
      // Removed adminOnly and roles restrictions
    },
    {
      title: "Papers History",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      path: "/papers-history",
    },
    {
      title: "Login History",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
      path: "/login-history",
      adminOnly: true, // Add this line
    },
    {
      title: "Default Paper Settings",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      path: "/default-paper-setting",
    },
    {
      title: "AI Diagram Generator",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      path: "coming-soon-diagram",
      comingSoon: true,
    },
    {
      title: "AI Exam Generator",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      path: "coming-soon-exam",
      comingSoon: true,
    },
    {
      title: "Student Management",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      path: "coming-soon-student",
      comingSoon: true,
    },
    {
      title: "Teacher Management",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      ),
      path: "coming-soon-teacher",
      comingSoon: true,
    },
    {
      title: "AI Assistant",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      ),
      path: "coming-soon-assistant",
      comingSoon: true,
    },
    {
      title: "AI Exam Checker",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      ),
      path: "coming-soon-checker",
      comingSoon: true,
    },
    // ... existing menu items after this
  ];

  // Update the filter function
  const filteredMenuItems = menuItems.filter((item) => {
    if (
      item.adminOnly &&
      (!user || (user.role !== "admin" && user.role !== "super_admin"))
    ) {
      return false;
    }
    if (item.roles && (!user || !item.roles.includes(user.role))) {
      return false;
    }
    return true;
  });

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Add this check at the beginning of the return statement
  if (!user) {
    return null; // or return a loading state or redirect to login
  }

  // Update the user profile section
  return (
    <div className="relative">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-12 top-4 p-2.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <div className="flex flex-col gap-1.5 w-5">
          <span className="w-full h-0.5 bg-white rounded-full shadow-sm"></span>
          <span className="w-full h-0.5 bg-white rounded-full shadow-sm"></span>
          <span className="w-full h-0.5 bg-white rounded-full shadow-sm"></span>
        </div>
      </button>

      <div
        className={`${
          isCollapsed ? "w-20" : "w-64"
        } fixed h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col transition-all duration-300 shadow-xl overflow-hidden`}
      >
        {/* Logo Section - Fixed */}
        <div className="flex-shrink-0 p-6 border-b border-gray-700/50">
          <div className="flex justify-center">
            <span
              className={`text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-500 text-transparent bg-clip-text ${
                isCollapsed ? "text-center" : ""
              }`}
            >
              {isCollapsed ? "LS" : "LARGIFY SOLUTIONS"}
            </span>
          </div>
        </div>

        {/* Updated User Profile Section */}
        {!isCollapsed && (
          <div className="flex-shrink-0 p-4 border-b border-gray-700/50">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user?.teacherName?.charAt(0) || user?.name?.charAt(0) || "A"}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-base text-white">
                  {user?.teacherName || user?.name || "Admin"}
                </h3>
                <p className="text-sm text-gray-300">
                  {user?.role || "Administrator"}
                </p>
              </div>
            </div>

            <div className="space-y-1.5 text-sm">
              {user?.role === "teacher" ? (
                <>
                  <p className="text-gray-200">Class: {user?.class}</p>
                  <p className="text-gray-200">
                    Subject:{" "}
                    {Array.isArray(user?.subject)
                      ? user.subject.join(", ")
                      : user?.subject}
                  </p>
                </>
              ) : user?.role === "super_admin" ? (
                <>
                  <p className="text-gray-200">
                    School:{" "}
                    {user?.school_name ||
                      user?.schoolName ||
                      "Largify Solutions"}
                  </p>
                  <p className="text-gray-200">
                    Package: {user?.package || "Enterprise"}
                  </p>
                  <p className="text-gray-200">
                    Email: {user?.email || "admin@largify.com"}
                  </p>
                  <p className="text-gray-200">
                    Total Teachers: {user?.totalTeachers || "0"}
                  </p>
                  <p className="text-gray-200">
                    Active Teachers: {user?.activeTeachers || "0"}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-200">
                    School:{" "}
                    {user?.school_name ||
                      user?.schoolName ||
                      "Largify Solutions"}
                  </p>
                  <p className="text-gray-200">
                    Package: {user?.package || "Standard"}
                  </p>
                  <p className="text-gray-200">Email: {user?.email}</p>
                </>
              )}
              <p className={`text-base flex items-center gap-2`}>
                <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                <span
                  className={`${
                    getAccessLevel(user?.role, user?.package).color
                  }`}
                >
                  {getAccessLevel(user?.role, user?.package).text}
                </span>
              </p>
              {user?.role !== "teacher" && (
                <p className="text-gray-200 text-base font-medium">
                  Expires: {user?.expiry_date || user?.expiryDate || "N/A"}
                </p>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={handleLogout}
                className="w-full py-2 bg-gradient-to-r from-teal-400 to-teal-500 rounded-lg text-sm font-medium hover:from-teal-500 hover:to-teal-600 transition-all duration-300"
              >
                Logout
              </button>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full py-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300"
              >
                Change Password
              </button>
            </div>
          </div>
        )}

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Change Password
              </h3>
              <p className="text-gray-600 mb-6">
                Please contact the super administrator to change your password.
                They will assist you with the password reset process.
              </p>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Navigation Menu - Scrollable */}
        <nav className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
          <ul className="p-4 space-y-2">
            {filteredMenuItems.map((item) => (
              <li key={item.path}>
                {item.comingSoon ? (
                  <span
                    className={`flex items-center ${
                      isCollapsed ? "justify-center" : ""
                    } gap-3 px-4 py-3 rounded-lg transition-all duration-300 cursor-not-allowed opacity-60`}
                    title="Coming Soon!"
                  >
                    <span className="text-xl">{item.icon}</span>
                    {!isCollapsed && (
                      <>
                        <span className="font-medium">{item.title}</span>
                        <span className="ml-auto text-xs bg-gray-600 px-2 py-1 rounded">
                          Soon
                        </span>
                      </>
                    )}
                  </span>
                ) : (
                  <Link href={item.path}>
                    <span
                      className={`flex items-center ${
                        isCollapsed ? "justify-center" : ""
                      } gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                        pathname === item.path
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-md"
                          : "hover:bg-gray-700/50"
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      {!isCollapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {/* Add a spacer div to prevent content from hiding under the fixed sidebar */}
      <div className={`${isCollapsed ? "w-20" : "w-64"}`}></div>
    </div>
  );
};

export default Sidebar;
