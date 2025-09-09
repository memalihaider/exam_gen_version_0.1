"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

const TwelfthClass = () => {
  const subjects = [
    // F.Sc Subjects
    { name: 'Biology', color: 'from-teal-400 to-teal-600', path: '/generate-paper/12th/biology', icon: '🔬', stream: 'F.Sc' },
    { name: 'Chemistry', color: 'from-pink-400 to-pink-600', path: '/generate-paper/12th/chemistry', icon: '🧪', stream: 'F.Sc' },
    { name: 'Physics', color: 'from-purple-400 to-purple-600', path: '/generate-paper/12th/physics', icon: '⚡', stream: 'F.Sc' },
    
    // ICS Subjects
    { name: 'Mathematics', color: 'from-blue-400 to-blue-600', path: '/generate-paper/12th/mathematics', icon: '📐', stream: 'ICS' },
    { name: 'Computer Science', color: 'from-indigo-400 to-indigo-600', path: '/generate-paper/12th/computer-science', icon: '💻', stream: 'ICS' },
    // { name: 'Statistics', color: 'from-cyan-400 to-cyan-600', path: '/generate-paper/12th/statistics', icon: '📊', stream: 'ICS' },
    // { name: 'Economics', color: 'from-green-400 to-green-600', path: '/generate-paper/12th/economics', icon: '📈', stream: 'ICS' },

    // I.COM Subjects
    // { name: 'Principles of Accounting', color: 'from-amber-400 to-amber-600', path: '/generate-paper/12th/principles-of-accounting', icon: '📒', stream: 'I.COM' },
    // { name: 'Principles of Economics', color: 'from-lime-400 to-lime-600', path: '/generate-paper/12th/principles-of-economics', icon: '📊', stream: 'I.COM' },
    // { name: 'Principles of Commerce', color: 'from-orange-400 to-orange-600', path: '/generate-paper/12th/principles-of-commerce', icon: '🏢', stream: 'I.COM' },
    // { name: 'Business Mathematics', color: 'from-sky-400 to-sky-600', path: '/generate-paper/12th/business-mathematics', icon: '🔢', stream: 'I.COM' },

    // Common Subjects
    { name: 'English', color: 'from-green-400 to-green-600', path: '/generate-paper/12th/english', icon: '📚', stream: 'Common' },
    { name: 'Pakistan Studies', color: 'from-purple-400 to-purple-600', path: '/generate-paper/12th/pakistan-studies', icon: '🇵🇰', stream: 'Common' },
    { name: 'اردو لازمی', color: 'from-rose-400 to-rose-600', path: '/generate-paper/12th/urdu-lazmi', icon: '📖', stream: 'Common' },
    { name: 'ترجمۃالقرآن المجید', color: 'from-amber-400 to-amber-600', path: '/generate-paper/12th/quran-translation', icon: '📿', stream: 'Common' },
    // { name: 'تاریخِ پاکستان', color: 'from-purple-400 to-purple-600', path: '/generate-paper/12th/pakistan-history', icon: '🇵🇰', stream: 'Common' },
    // { name: 'فارسی', color: 'from-rose-400 to-rose-600', path: '/generate-paper/12th/persian', icon: '📚', stream: 'F.A' },
    // { name: 'مبادیاتِ فلسفہ', color: 'from-blue-400 to-blue-600', path: '/generate-paper/12th/principles-of-philosophy', icon: '🤔', stream: 'F.A' },
    // { name: 'مُرَقَّعِ ادَب', color: 'from-amber-400 to-amber-600', path: '/generate-paper/12th/urdu-optional', icon: '📝', stream: 'F.A' },
    // { name: 'لائبریری سائنس', color: 'from-indigo-400 to-indigo-600', path: '/generate-paper/12th/library-science', icon: '📚', stream: 'F.A' },
    // { name: 'ہوم اکنامکس', color: 'from-green-400 to-green-600', path: '/generate-paper/12th/home-economics', icon: '🏠', stream: 'F.A' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            12th Class Subjects
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm">
            <Link href="/" className="text-purple-600 hover:text-purple-800 transition-colors">Home</Link>
            <span className="text-gray-500">/</span>
            <Link href="/generate-paper" className="text-purple-600 hover:text-purple-800 transition-colors">Generate Paper</Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-500">12th Class</span>
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

        {/* Stream Sections */}
        {['F.Sc', 'ICS', 'Common'].map(stream => (
          <div key={stream} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{stream}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {subjects
                .filter(subject => subject.stream === stream)
                .map((subject, index) => (
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
                        <h2 className={`text-white text-xl font-bold text-center mb-2 ${subject.name.match(/[\u0600-\u06FF]/) ? 'font-nastaliq text-2xl leading-relaxed' : ''}`}>
                          {subject.name}
                        </h2>
                        <div className="w-16 h-1 bg-white/30 rounded-full"></div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TwelfthClass;