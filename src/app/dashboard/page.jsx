'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ninthBiology } from '@/data/dummyQuestions';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useUser } from '@/contexts/UserContext'; // Add this import
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const dashboardStats = [
  { 
    title: 'Generate Paper', 
    status: 'Ready to Generate',
    statusColor: 'text-emerald-100',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
    ), 
    color: 'from-teal-400 to-teal-600', 
    action: 'Generate Now', 
    path: '/generate-paper' 
  },
  { 
    title: 'Saved Papers', 
    status: 'Recently Updated',
    statusColor: 'text-green-100',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
      </svg>
    ), 
    color: 'from-green-400 to-green-600', 
    action: 'Open Now', 
    path: '/saved-papers' 
  },
  { 
    title: 'Past Papers', 
    status: 'Archive Available',
    statusColor: 'text-yellow-100',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ), 
    color: 'from-yellow-400 to-yellow-600', 
    action: 'Print Now', 
    path: '/past-papers' 
  },
  { 
    title: 'Teachers', 
    status: 'Manage Access',
    statusColor: 'text-red-100',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ), 
    color: 'from-red-400 to-red-600', 
    action: 'View Now', 
    path: '/teachers' 
  },
];

// Update the dashboardQuickLinks array paths
const dashboardQuickLinks = [

  { 
    title: 'Add Questions', 
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ), 
    subtitle: 'Add new questions to bank',
    path: '/add-questions' // Updated path
  },
  { 
    title: 'View Questions', 
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ), 
    count: ninthBiology.length,
    suffix: 'Questions',
    path: '/view-questions' // Updated path
  },
  // { 
  //   title: 'Draft Papers', 
  //   icon: (
  //     <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  //     </svg>
  //   ), 
  //   count: '21', 
  //   suffix: 'Papers', 
  //   path: '/draft-papers' 
  // },
  { 
    title: 'Profile', 
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ), 
    subtitle: 'Profile Details', 
    path: '/profile' 
  },
  // { 
  //   title: 'Default Paper Settings', 
  //   icon: (
  //     <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
  //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  //     </svg>
  //   ), 
  //   count: '21', 
  //   suffix: 'Settings', 
  //   path: '/default-paper-setting' 
  // },
  { 
    title: 'Deleted Saved Papers', 
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m4-6v.01M5 7V4h4m4 0h4v3" />
      </svg>
    ), 
    count: '15', 
    suffix: 'Papers', 
    path: '/delete-papers' 
  },
  { 
    title: 'Paper Generate History', 
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ), 
    count: '3187', 
    suffix: 'Papers', 
    path: '/papers-history' 
  },
  { 
    title: 'Login History', 
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ), 
    count: '2655', 
    suffix: 'Logins', 
    path: '/login-history' 
  },
  // { 
  //   title: 'Draft Papers', 
  //   icon: (
  //     <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  //     </svg>
  //   ), 
  //   count: '21', 
  //   suffix: 'Papers', 
  //   path: '/draft-papers' 
  // },


  { 
    title: 'Past Papers', 
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    subtitle: 'Browse Past Papers',
    path: '/past-papers'
  },
  { 
    title: 'Teachers', 
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    subtitle: 'Manage Teachers',
    path: '/teachers'
  },
  { 
    title: 'Papers History', 
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    subtitle: 'View Generation History',
    path: '/papers-history'
  },
  // { 
  //   title: 'Login History', 
  //   icon: (
  //     <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  //     </svg>
  //   ),
  //   subtitle: 'Access History',
  //   path: '/login-history'
  // },
  { 
    title: 'Default Paper Settings', 
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    subtitle: 'Configure Settings',
    path: '/default-paper-setting'
  },
  // Coming Soon Items
  { 
    title: 'AI Diagram Generator', 
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    subtitle: 'Generate Diagrams with AI',
    path: '/diagram-generator',
    comingSoon: true,
    bgColor: 'bg-slate-200/80'
  },
  { 
    title: 'AI Exam Generator', 
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    subtitle: 'Auto Generate Exams',
    path: '/exam-generator',
    comingSoon: true,
    bgColor: 'bg-blue-200/80'
  },
  { 
    title: 'Student Management', 
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    subtitle: 'Manage Students',
    path: '/student-management',
    comingSoon: true,
    bgColor: 'bg-gray-200/80'
  },
  { 
    title: 'Teacher Management', 
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
    subtitle: 'Manage Teachers',
    path: '/teachers-management',
    comingSoon: true,
    bgColor: 'bg-gray-200/80'
  },
  { 
    title: 'AI Assistant', 
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    subtitle: 'AI Powered Help',
    path: '#',
    comingSoon: true,
    bgColor: 'bg-gray-200/80'
  },
  { 
    title: 'AI Exam Checker', 
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    subtitle: 'Auto Check Exams',
    path: '#',
    comingSoon: true,
    bgColor: 'bg-cyan-200/80'
  }
]

// Update the rendering section:
{dashboardQuickLinks.map((link, index) => (
  <div key={link.title} className={`relative group ${link.comingSoon ? 'cursor-none' : ''}`}>
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 + index * 0.1 }}
      className={`${link.comingSoon ? `${link.bgColor} bg-opacity-90` : 'bg-white'} rounded-2xl p-6 shadow-md border border-gray-100/50 ${link.comingSoon ? 'cursor-none select-none' : ''} relative`}
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl bg-white/50 p-3 rounded-xl transition-colors">
          {link.icon}
        </span>
        <div>
          <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
            {link.title}
            {link.comingSoon && (
              <span className="text-xs bg-gray-600 px-2 py-1 rounded-full text-white font-medium">
                Coming Soon
              </span>
            )}
          </h3>
          <p className="text-gray-600 mt-1">{link.subtitle}</p>
        </div>
      </div>
      {link.comingSoon && (
        <div className="absolute top-0 right-0 mt-2 mr-2 text-sm text-gray-500 font-medium">
          Coming Soon
        </div>
      )}
    </motion.div>
  </div>
))}
const bottomSections = (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6 }}
    className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12"
  >
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100/50 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
          <span className="bg-blue-50 p-2 rounded-xl text-blue-600">📊</span>
          Question Statistics
        </h3>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total MCQs</span>
          <span className="font-semibold">{ninthBiology.filter(q => q.type === 'mcqs').length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Short Questions</span>
          <span className="font-semibold">{ninthBiology.filter(q => q.type === 'short').length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Long Questions</span>
          <span className="font-semibold">{ninthBiology.filter(q => q.type === 'long').length}</span>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100/50 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
          <span className="bg-cyan-50 p-2 rounded-xl text-cyan-600">📚</span>
          Chapter Coverage
        </h3>
      </div>
      <div className="space-y-4">
        {Array.from(new Set(ninthBiology.map(q => q.chapter))).map(chapter => (
          <div key={chapter} className="flex justify-between items-center">
            <span className="text-gray-600">{chapter}</span>
            <span className="font-semibold">
              {ninthBiology.filter(q => q.chapter === chapter).length} questions
            </span>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

export default function Dashboard() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, []);

  if (!user) {
    return null;
  }

  // Filter dashboard stats to hide Teachers for teacher users
  const filteredDashboardStats = dashboardStats.filter(stat => {
    if (user?.role === 'teacher' && stat.title === 'Teachers') {
      return false;
    }
    return true;
  });

  // Filter quick links to hide Teachers and Login History for teacher users
  const filteredQuickLinks = dashboardQuickLinks.filter(link => {
    if (user?.role === 'teacher' && (link.title === 'Teachers' || link.title === 'Login History')) {
      return false;
    }
    return true;
  });

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            LS Dashboard | 1.1
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">Home</Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-500">Dashboard</span>
          </div>
        </div>

        {/* Main Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredDashboardStats.map((stat, index) => (
            <motion.div 
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{stat.title}</h2>
                  <p className={`${stat.statusColor} bg-white/10 px-3 py-1 rounded-full inline-block text-sm`}>
                    {stat.status}
                  </p>
                </div>
                <span className="text-3xl bg-white/20 p-3 rounded-xl backdrop-blur-sm">{stat.icon}</span>
              </div>
              <Link href={stat.path}>
                <button className="mt-4 bg-white/20 w-full py-2 rounded-xl hover:bg-white/30 transition-colors font-medium backdrop-blur-sm">
                  {stat.action}
                </button>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Links */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
        >
          {filteredQuickLinks.map((link, index) => (
            <Link key={link.title} href={link.path}>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100/50 group"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl bg-gray-50 p-3 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    {link.icon}
                  </span>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{link.title}</h3>
                    {link.count ? (
                      <p className="text-gray-600 mt-1">
                        {link.count} {link.suffix}
                      </p>
                    ) : (
                      <p className="text-gray-600 mt-1">{link.subtitle}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Bottom Sections */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12"
        >
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                <span className="bg-blue-50 p-2 rounded-xl text-blue-600">📢</span>
                Latest News
              </h3>
              <button className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg">
                
              </button>
            </div>
            {/* Add your news content here */}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                <span className="bg-cyan-50 p-2 rounded-xl text-cyan-600">📚</span>
                Recently Added Books
              </h3>
              <button className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg">
                
              </button>
            </div>
            {/* Add your books content here */}
          </div>
        </motion.div>
      </div>
    </div>
    </ProtectedRoute>
  );
}