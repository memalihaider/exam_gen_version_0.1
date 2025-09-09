"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function PapersHistory() {
  const [papers, setPapers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [filterClass, setFilterClass] = useState('');
  const [filterSubject, setFilterSubject] = useState('');

  useEffect(() => {
    fetchPapers();
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchPapers, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update filters when papers change
  useEffect(() => {
    const classes = [...new Set(papers.map(paper => paper.class))];
    const subjects = [...new Set(papers.map(paper => paper.subject))];
    setAvailableClasses(classes);
    setAvailableSubjects(subjects);
  }, [papers]);

  const fetchPapers = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://edu.largifysolutions.com/api-papers.php?status=SAVED', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        cache: 'no-cache'
      });
  
      const data = await response.json().catch(() => null);
      
      if (!response.ok) {
        if (response.status === 404) {
          setPapers([]);
          return;
        }
        if (response.status === 500) {
          setPapers([]);
          toast.error('Database connection error. Please try again in a few minutes.');
          return;
        }
        throw new Error(data?.message || `Server error: ${response.status}`);
      }
  
      if (!data) {
        setPapers([]);
        toast.error('No data received from server');
        return;
      }
  
      // Transform the data to match the expected format
      const transformedPapers = Array.isArray(data) ? data.map(paper => {
        let content;
        try {
          content = typeof paper.content === 'string' ? JSON.parse(paper.content) : paper.content;
        } catch (e) {
          console.error('Error parsing content:', e);
          content = { chapters: [], topics: [] };
        }
  
        // Extract chapters and topics from the questions array
        const questions = content.questions || [];
        const uniqueChapters = [...new Set(questions.map(q => q.chapter))].filter(Boolean);
        const uniqueTopics = [...new Set(questions.map(q => q.topic))].filter(Boolean);
  
        return {
          id: paper.id,
          class: paper.class,
          subject: paper.subject,
          chapters: uniqueChapters,
          topics: uniqueTopics,
          dateTime: new Date(paper.created_at).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          generatedBy: content.generatedBy || 'System',
          created_at: paper.created_at
        };
      }) : [];
  
      setPapers(transformedPapers);
    } catch (error) {
      console.error('Error fetching papers:', error);
      setPapers([]);
      if (!navigator.onLine) {
        toast.error('You are offline. Please check your internet connection.');
      } else {
        toast.error('Unable to connect to server. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter papers based on search and filters
  const filteredPapers = papers.filter(paper => {
    const matchesSearch = searchTerm === '' || 
      paper.class?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = filterClass === '' || paper.class === filterClass;
    const matchesSubject = filterSubject === '' || paper.subject === filterSubject;
    
    return matchesSearch && matchesClass && matchesSubject;
  });

  // Calculate stats outside of JSX
  const stats = {
    total: papers.length,
    thisMonth: papers.filter(paper => {
      const paperDate = new Date(paper.created_at);
      const now = new Date();
      return paperDate.getMonth() === now.getMonth() && 
             paperDate.getFullYear() === now.getFullYear();
    }).length,
    thisWeek: papers.filter(paper => {
      const paperDate = new Date(paper.created_at);
      const now = new Date();
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      return paperDate >= weekStart;
    }).length,
    today: papers.filter(paper => {
      const paperDate = new Date(paper.created_at);
      const today = new Date();
      return paperDate.toDateString() === today.toDateString();
    }).length
  };

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        {/* Enhanced Header Section */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Papers Generation History
          </h1>
          <div className="flex items-center justify-center gap-3 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors font-medium">Home</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 font-medium">Papers History</span>
          </div>
        </div>

        {/* Statistics Section - Fixed */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">
          {[
            { label: 'Total Papers', value: stats.total, color: 'blue' },
            { label: 'This Month', value: stats.thisMonth, color: 'green' },
            { label: 'This Week', value: stats.thisWeek, color: 'purple' },
            { label: 'Today', value: stats.today, color: 'cyan' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`bg-${color}-50 rounded-2xl p-6 border border-${color}-100`}>
              <p className={`text-${color}-600 text-sm font-medium mb-1`}>{label}</p>
              <p className={`text-${color}-700 text-3xl font-bold`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Enhanced Warning Message */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-6 rounded-xl shadow-sm">
            <p className="text-red-700 flex items-center gap-3 font-medium">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              If you find any unknown generated paper then change your password immediately for adequate security
            </p>
          </div>
        </div>

        {/* Enhanced Search and Actions Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col sm:flex-row gap-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by ID, class, subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-600"
              />
              <svg className="w-6 h-6 text-gray-400 absolute left-5 top-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-3 min-w-[200px] font-medium">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
              Filter History
            </button>
          </div>
        </div>

        {/* Enhanced Table */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <th className="px-6 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Sr#</th>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Class</th>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Chapters</th>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Topics</th>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date and Time</th>
                    <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Generated By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                      </td>
                    </tr>
                  ) : filteredPapers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        No papers found
                      </td>
                    </tr>
                  ) : (
                    filteredPapers.map((paper) => (
                      <tr key={paper.id} className="hover:bg-slate-50 transition-all duration-300">
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="inline-flex items-center px-3.5 py-2 rounded-lg text-xs font-bold bg-gray-100 text-gray-800">
                            {paper.id}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">{paper.class}</td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">{paper.subject}</td>
                        <td className="px-6 py-5">
                          <div className="flex flex-wrap gap-1.5">
                            {paper.chapters?.map((chapter, index) => (
                              <span key={index} className="inline-block px-3 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                                {chapter}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-wrap gap-1.5">
                            {paper.topics?.map((topic, index) => (
                              <span key={index} className="inline-block px-3 py-1 text-xs font-medium bg-cyan-50 text-cyan-600 rounded-full border border-cyan-100">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">{paper.dateTime}</td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100">
                            {paper.generatedBy}
                          </span>
                        </td>
                      </tr>
                    )))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#333',
            borderRadius: '10px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            padding: '12px 20px',
          },
        }} 
      />
    </div>
    </ProtectedRoute>
  );
}