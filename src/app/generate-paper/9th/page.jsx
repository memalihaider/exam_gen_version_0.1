"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const NinthClass = () => {
  const subjects = [
    { name: 'Mathematics', color: 'from-blue-400 to-blue-600', path: '/generate-paper/9th/mathematics', icon: '📐' },
    { name: 'English', color: 'from-green-400 to-green-600', path: '/generate-paper/9th/english', icon: '📚' },
    // { name: 'Pakistan Studies', color: 'from-red-400 to-red-600', path: '/generate-paper/9th/pakistan-studies', icon: '🗺️' },
    { name: 'Biology', color: 'from-teal-400 to-teal-600', path: '/generate-paper/9th/biology', icon: '🔬' },
    { name: 'Computer Science', color: 'from-indigo-400 to-indigo-600', path: '/generate-paper/9th/computer-science', icon: '💻' },
    { name: 'Chemistry', color: 'from-pink-400 to-pink-600', path: '/generate-paper/9th/chemistry', icon: '🧪' },
    { name: 'Physics', color: 'from-purple-400 to-purple-600', path: '/generate-paper/9th/physics', icon: '⚡' },
    { name: 'اردو لازمی', color: 'from-amber-400 to-amber-600', path: '/generate-paper/9th/urdu', icon: '📖', isUrdu: true },
    // { name: 'ایجوکیشن', color: 'from-lime-400 to-lime-600', path: '/generate-paper/9th/education', icon: '🎓', isUrdu: true },
    // { name: 'پنجابی', color: 'from-emerald-400 to-emerald-600', path: '/generate-paper/9th/punjabi', icon: '📚', isUrdu: true },
    { name: 'اسلامیات اختیاری', color: 'from-violet-400 to-violet-600', path: '/generate-paper/9th/islamiat-ikhtiari', icon: '🕌', isUrdu: true },
    // { name: 'جنرل سائنس', color: 'from-cyan-400 to-cyan-600', path: '/generate-paper/9th/general-science', icon: '🔭', isUrdu: true },
    // { name: 'ہوم اکنامکس', color: 'from-rose-400 to-rose-600', path: '/generate-paper/9th/home-economics', icon: '🏠', isUrdu: true },
    // { name: 'جنرل ریاضی', color: 'from-sky-400 to-sky-600', path: '/generate-paper/9th/general-math', icon: '🔢', isUrdu: true },
    // { name: 'سوکس', color: 'from-fuchsia-400 to-fuchsia-600', path: '/generate-paper/9th/civics', icon: '📋', isUrdu: true },
    // { name: 'اسلامیات لازمی (SNC)', color: 'from-orange-400 to-orange-600', path: '/generate-paper/9th/islamiat-lazmi-snc', icon: '🕌', isUrdu: true },
    { name: 'ترجمۃالقرآن المجید', color: 'from-emerald-400 to-emerald-600', path: '/generate-paper/9th/quran-translation', icon: '📿', isUrdu: true },
    // { name: 'اخلاقیات', color: 'from-blue-400 to-blue-600', path: '/generate-paper/9th/ethics', icon: '🤝', isUrdu: true },
    // { name: 'فزیکل ایجوکیشن', color: 'from-green-400 to-green-600', path: '/generate-paper/9th/physical-education', icon: '⚽', isUrdu: true },
    // { name: 'غذا اور غذائیت', color: 'from-red-400 to-red-600', path: '/generate-paper/9th/food-nutrition', icon: '🍎', isUrdu: true },
    // { name: 'پولٹری فارمنگ', color: 'from-yellow-400 to-yellow-600', path: '/generate-paper/9th/poultry-farming', icon: '🐔', isUrdu: true },
    // { name: 'معاشیات', color: 'from-purple-400 to-purple-600', path: '/generate-paper/9th/economics', icon: '📊', isUrdu: true },
    // { name: 'Chemistry (SNC)', color: 'from-pink-400 to-pink-600', path: '/generate-paper/9th/chemistry-snc', icon: '🧪' },
    // { name: 'Biology (SNC)', color: 'from-teal-400 to-teal-600', path: '/generate-paper/9th/biology-snc', icon: '🔬' },
    // { name: 'Physics (SNC)', color: 'from-indigo-400 to-indigo-600', path: '/generate-paper/9th/physics-snc', icon: '⚡' },
    // { name: 'Computer Science & Entrep. (SNC)', color: 'from-cyan-400 to-cyan-600', path: '/generate-paper/9th/cs-entrepreneurship-snc', icon: '💻' },
    // { name: 'Mathematics (SNC)', color: 'from-blue-400 to-blue-600', path: '/generate-paper/9th/mathematics-snc', icon: '📐' },
    // { name: 'English (SNC)', color: 'from-green-400 to-green-600', path: '/generate-paper/9th/english-snc', icon: '📚' },
    // { name: 'اردو لازمی (SNC)', color: 'from-amber-400 to-amber-600', path: '/generate-paper/9th/urdu-lazmi-snc', icon: '📖', isUrdu: true },
    // { name: 'اسلامیات لازمی (SNC 2025)', color: 'from-violet-400 to-violet-600', path: '/generate-paper/9th/islamiat-lazmi-snc-2025', icon: '🕌', isUrdu: true },
  ];

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            9th Class Subjects
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm">
            <Link href="/" className="text-purple-600 hover:text-purple-800 transition-colors">Home</Link>
            <span className="text-gray-500">/</span>
            <Link href="/generate-paper" className="text-purple-600 hover:text-purple-800 transition-colors">Generate Paper</Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-500">9th Class</span>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-xl">
                <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Available Subjects</p>
                <p className="text-2xl font-bold text-gray-800">{subjects.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 rounded-xl">
                <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Question Types</p>
                <p className="text-2xl font-bold text-gray-800">Multiple</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-violet-50 rounded-xl">
                <svg className="w-8 h-8 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          {subjects.map((subject, index) => (
            <Link href={subject.path} key={subject.name}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`
                  bg-gradient-to-br ${subject.color}
                  rounded-2xl p-6 h-48
                  transform transition-all duration-300
                  hover:scale-105 hover:shadow-xl
                  group relative
                  cursor-pointer
                  overflow-hidden
                `}
              >
                <div className="absolute top-4 right-4 text-2xl">{subject.icon}</div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-black opacity-10"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-sm font-medium">Click to generate paper</p>
                  </div>
                </div>
                
              
                <div className="h-full flex flex-col items-center justify-center">
                  <h2 className={`text-white text-2xl font-bold text-center mb-2 ${
                    subject.isUrdu ? 'font-nastaliq !text-3xl leading-relaxed' : ''
                  }`}>
                    {subject.name}
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

export default NinthClass;