"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function DraftPapers() {
  const [searchQuery, setSearchQuery] = useState('');

  const draftPapers = [
    {
      sr: 1,
      class: '1st Year',
      subject: 'کلی نظریہ',
      chapters: ['سرسری نظر پر مضمون', 'مرکزی خیال'],
      pcm: true,
      date: '13-03-2025/09:38:23pm',
      generatedBy: 'Admin'
    },
    {
      sr: 2,
      class: '2nd Year',
      subject: 'اصول تنقید',
      chapters: ['تنقید کی تعریف'],
      pcm: true,
      date: '13-03-2025/09:33:11pm',
      generatedBy: 'Admin'
    },
    {
      sr: 3,
      class: '9th',
      subject: 'Physics',
      chapters: [
        'Unit 3: Dynamics',
        '3.1 Force, Inertia and Momentum',
        '3.2 Newton\'s Laws of Motion',
        '3.3 Friction'
      ],
      pcm: true,
      date: '13-03-2025/04:31:50pm',
      generatedBy: 'Admin'
    },
    {
      sr: 4,
      class: '1st Year',
      subject: 'تنقید اور ادبی تاریخ',
      chapters: ['تنقید', 'تاریخ'],
      pcm: true,
      date: '13-03-2025/03:12:38pm',
      generatedBy: 'Admin'
    }
  ];

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative">
      {/* Decorative pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none" />
      
      <div className="container mx-auto px-4 py-12 relative">
        {/* Enhanced Header Section */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Draft Papers
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors font-medium">Home</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 font-medium">Draft Papers</span>
          </div>
        </div>

        {/* Enhanced Instructions */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white border-l-4 border-indigo-500 p-6 rounded-lg shadow-sm">
            <p className="text-indigo-700 flex items-center gap-3 font-medium">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Click on "Open" in the Action column to edit or view the paper details.
            </p>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by class, subject, or chapter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-gray-600"
                />
                <svg className="w-6 h-6 text-gray-400 absolute left-5 top-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-3 min-w-[200px] font-medium">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                Arrange Papers
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-500">
                Showing <span className="font-medium text-gray-700">{draftPapers.length}</span> papers
              </span>
              {searchQuery && (
                <span className="text-indigo-600">
                  Filtering by: "{searchQuery}"
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm bg-opacity-90">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="px-6 py-5 text-left font-semibold text-gray-600">Sr#</th>
                <th className="px-6 py-5 text-left font-semibold text-gray-600">Class</th>
                <th className="px-6 py-5 text-left font-semibold text-gray-600">Subject</th>
                <th className="px-6 py-5 text-left font-semibold text-gray-600">Chapters & Topics</th>
                <th className="px-6 py-5 text-left font-semibold text-gray-600">Date and Time</th>
                <th className="px-6 py-5 text-left font-semibold text-gray-600">Generated By</th>
                <th className="px-6 py-5 text-left font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {draftPapers.map((paper) => (
                <tr key={paper.sr} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5">{paper.sr}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">{paper.class}</span>
                      {paper.pcm && (
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">
                          PCM
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 font-medium text-gray-700">{paper.subject}</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-2">
                      {paper.chapters.map((chapter, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium"
                        >
                          {chapter}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-gray-500">{paper.date}</td>
                  <td className="px-6 py-5 font-medium text-gray-600">{paper.generatedBy}</td>
                  <td className="px-6 py-5">
                    <button className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all shadow-sm hover:shadow-md flex items-center gap-2 font-medium">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}