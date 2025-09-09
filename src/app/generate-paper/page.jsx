"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const GeneratePaper = () => {
  const classes = [
    { name: '12th', color: 'from-emerald-400 to-emerald-600', path: '/generate-paper/12th', icon: '🎓' },
    { name: '11th', color: 'from-pink-400 to-pink-600', path: '/generate-paper/11th', icon: '📚' },
    { name: '10th', color: 'from-cyan-400 to-cyan-600', path: '/generate-paper/10th', icon: '✏️' },
    { name: '9th', color: 'from-purple-400 to-purple-600', path: '/generate-paper/9th', icon: '📝' },
    { name: '8th', color: 'from-orange-400 to-orange-600', path: '#', icon: '📖' },
    { name: '7th', color: 'from-blue-400 to-blue-600', path: '#', icon: '📓' },
    { name: '6th', color: 'from-rose-400 to-rose-600', path: '#', icon: '✍️' },
    { name: '5th', color: 'from-teal-400 to-teal-600', path: '#', icon: '📘' },
    // { name: '8th', color: 'from-orange-400 to-orange-600', path: '/generate-paper/8th', icon: '📖' },
    // { name: '7th', color: 'from-blue-400 to-blue-600', path: '/generate-paper/7th', icon: '📓' },
    // { name: '6th', color: 'from-rose-400 to-rose-600', path: '/generate-paper/6th', icon: '✍️' },
    // { name: '5th', color: 'from-teal-400 to-teal-600', path: '/generate-paper/5th', icon: '📘' },
  ];

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Generate Paper
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">Home</Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-500">Select Class</span>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Available Classes</p>
                <p className="text-2xl font-bold text-gray-800">{classes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-50 rounded-xl">
                <svg className="w-8 h-8 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Paper Types</p>
                <p className="text-2xl font-bold text-gray-800">Multiple</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 rounded-xl">
                <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Generation Time</p>
                <p className="text-2xl font-bold text-gray-800">Instant</p>
              </div>
            </div>
          </div>
        </div>

        {/* Class Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          {classes.map((classItem, index) => (
            <Link href={classItem.path} key={classItem.name}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`
                  bg-gradient-to-br ${classItem.color}
                  rounded-2xl p-6 h-48
                  transform transition-all duration-300
                  hover:scale-105 hover:shadow-xl
                  group relative
                  cursor-pointer
                  overflow-hidden
                `}
              >
                <div className="absolute top-4 right-4 text-2xl">{classItem.icon}</div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-black opacity-10"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-sm font-medium">Click to generate paper</p>
                  </div>
                </div>
                
                <div className="h-full flex flex-col items-center justify-center">
                  <h2 className="text-white text-3xl font-bold text-center mb-2">
                    {classItem.name}
                  </h2>
                  <div className="w-16 h-1 bg-white/30 rounded-full"></div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default GeneratePaper;