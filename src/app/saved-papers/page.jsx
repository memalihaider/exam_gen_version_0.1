"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { toast, Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function SavedPapers() {
  const [papers, setPapers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [filterClass, setFilterClass] = useState('')
  const [filterSubject, setFilterSubject] = useState('')

  // Add state for available filters
  const [availableClasses, setAvailableClasses] = useState([])
  const [availableSubjects, setAvailableSubjects] = useState([])

  useEffect(() => {
    fetchPapers()
  }, [])

  // Update filters when papers change
  useEffect(() => {
    const classes = [...new Set(papers.map(paper => paper.class))]
    const subjects = [...new Set(papers.map(paper => paper.subject))]
    setAvailableClasses(classes)
    setAvailableSubjects(subjects)
  }, [papers])

  const fetchPapers = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://edu.largifysolutions.com/api-papers.php?status=SAVED', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        cache: 'no-cache'
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
          toast.error('Database connection error. Please try again in a few minutes.')
          return
        }
        throw new Error(data?.message || `Server error: ${response.status}`)
      }
  
      // Check if data is valid
      if (!data) {
        setPapers([])
        toast.error('No data received from server')
        return
      }
  
      // Set papers data
      setPapers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching papers:', error)
      setPapers([])
      if (!navigator.onLine) {
        toast.error('You are offline. Please check your internet connection.')
      } else {
        toast.error('Unable to connect to server. Please try again later.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (paperId) => {
    try {
      console.log('Attempting to delete paper with ID:', paperId); // Add this line
      
      const response = await fetch('https://edu.largifysolutions.com/api-papers.php', {
        method: 'POST', // Changed from PATCH to POST
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        cache: 'no-cache',
        body: JSON.stringify({ 
          action: 'update_status', // Add action identifier
          paperId: paperId,
          status: 'DELETED' 
        })
      })
  
      console.log('Response status:', response.status); // Add this line
      
      // Get response text for debugging
      const responseText = await response.text();
      console.log('Response text:', responseText); // Add this line
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        throw new Error('Invalid JSON response from server');
      }
  
      if (!response.ok) {
        if (response.status === 500) {
          throw new Error(responseData.error || 'Database error. Please try again.');
        }
        if (response.status === 404) {
          throw new Error('Paper not found');
        }
        throw new Error(responseData.error || 'Failed to delete paper');
      }
      
      toast.success('Paper moved to trash');
      fetchPapers();
    } catch (error) {
      console.error('Error deleting paper:', error);
      if (!navigator.onLine) {
        toast.error('You are offline. Please check your internet connection.');
      } else {
        toast.error(error.message || 'Unable to connect to server. Please try again later.');
      }
    }
  }

  const handlePrint = (paper) => {
    try {
      const content = typeof paper.content === 'string' ? JSON.parse(paper.content) : paper.content
      
      // Check if we have the new format with paperSettings and HTML
      if (content.html && content.paperSettings) {
        // Use the saved HTML layout directly
        const printWindow = window.open('', '_blank')
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${paper.class} - ${paper.subject}</title>
              <style>
                @page { 
                  size: A4;
                  margin: 2cm 1.5cm;
                }
                
                body {
                  font-family: 'Times New Roman', serif;
                  line-height: 1.3;
                  color: #000;
                  margin: 0;
                  padding: 0;
                }
  
                /* Copy all the styles from the preview page */
                .paper-container {
                  max-width: 210mm;
                  margin: 0 auto;
                  background: white;
                  box-shadow: none;
                  border: none;
                }
  
                .header {
                  text-align: center;
                  margin-bottom: 25px;
                }
  
                .school-logo {
                  width: ${content.paperSettings?.logoWidth || 70}px;
                  height: ${content.paperSettings?.logoHeight || 70}px;
                  margin: 0 auto 10px;
                }
  
                .school-name {
                  font-size: ${content.paperSettings?.headerFontSize || 24}px;
                  font-weight: bold;
                  margin: 6px 0;
                  color: ${content.paperSettings?.headerFontColor || '#000'};
                }
  
                .school-address {
                  font-size: 12px;
                  color: #000;
                  margin: 3px 0;
                }
  
                .paper-info {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 25px;
                }
  
                .paper-info td {
                  border: 1px solid #000;
                  padding: 8px 10px;
                  font-size: ${content.paperSettings?.textFontSize || 14}px;
                }
  
                .instruction-heading {
                  font-size: ${content.paperSettings?.headingFontSize || 14}px;
                  font-weight: bold;
                  margin-bottom: 20px;
                  display: flex;
                  justify-content: space-between;
                  color: ${content.paperSettings?.headingFontColor || '#000'};
                }
  
                .marks {
                  font-weight: normal;
                }
  
                .question {
                  font-size: ${content.paperSettings?.textFontSize || 14}px;
                  margin-bottom: 15px;
                  margin-left: 0;
                  line-height: ${content.paperSettings?.lineHeight || 1.5};
                  color: ${content.paperSettings?.textFontColor || '#000'};
                }
  
                .short-question {
                  line-height: ${content.paperSettings?.shortQuestionLineHeight || 1.2};
                }
  
                .long-question {
                  line-height: ${content.paperSettings?.longQuestionLineHeight || 1.2};
                }
  
                /* Hide screen-only elements */
                .no-print {
                  display: none !important;
                }
  
                /* Ensure proper spacing for different layouts */
                .flex {
                  display: flex;
                }
  
                .flex-col {
                  flex-direction: column;
                }
  
                .items-center {
                  align-items: center;
                }
  
                .justify-center {
                  justify-content: center;
                }
  
                .text-center {
                  text-align: center;
                }
  
                .mb-4 {
                  margin-bottom: 1rem;
                }
  
                .mb-6 {
                  margin-bottom: 1.5rem;
                }
  
                .p-6 {
                  padding: 1.5rem;
                }
  
                .border-b {
                  border-bottom: 1px solid #e5e7eb;
                }
  
                @media print {
                  body { margin: 0; }
                  .paper-container { box-shadow: none; }
                }
              </style>
            </head>
            <body>
              ${content.html}
              <script>
                window.onload = () => {
                  setTimeout(() => {
                    window.print();
                    window.onafterprint = () => {
                      window.close();
                    };
                  }, 1000);
                };
              </script>
            </body>
          </html>
        `)
        printWindow.document.close()
      } else {
        // Fallback to old format for backward compatibility
        const questionsHtml = `
          <div class="instruction-heading">
            03. ATTEMPT ANY 2 OF THE FOLLOWING
            <span class="marks">(3 × 5) = 15</span>
          </div>
          ${content.questions?.map((question, index) => `
            <div class="question">
              ${index + 1}. ${question.text}
            </div>
          `).join('\n')}`;
    
        const printWindow = window.open('', '_blank')
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${paper.class} - ${paper.subject}</title>
              <style>
                @page { 
                  size: A4;
                  margin: 2cm 1.5cm;
                }
                
                body {
                  font-family: 'Times New Roman', serif;
                  line-height: 1.3;
                  color: #000;
                  margin: 0;
                  padding: 0;
                }
  
                .header {
                  text-align: center;
                  margin-bottom: 25px;
                }
  
                .school-logo {
                  width: 70px;
                  height: 70px;
                  margin: 0 auto 10px;
                }
  
                .school-name {
                  font-size: 24px;
                  font-weight: bold;
                  margin: 6px 0;
                }
  
                .school-address {
                  font-size: 12px;
                  color: #000;
                  margin: 3px 0;
                }
  
                .paper-info {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 25px;
                }
  
                .paper-info td {
                  border: 1px solid #000;
                  padding: 8px 10px;
                  font-size: 14px;
                }
  
                .instruction-heading {
                  font-size: 14px;
                  font-weight: bold;
                  margin-bottom: 20px;
                  display: flex;
                  justify-content: space-between;
                }
  
                .marks {
                  font-weight: normal;
                }
  
                .question {
                  font-size: 14px;
                  margin-bottom: 15px;
                  margin-left: 0;
                }
  
                @media print {
                  body { margin: 0; }
                }
              </style>
            </head>
            <body>
              <div class="header">
                <img src="/logo.png" alt="School Logo" class="school-logo" onerror="this.style.display='none'" />
                <div class="school-name">LEAP EVENING COACHING</div>
                <div class="school-address">155/A-Block, Arabia Islamia Road, Burewala.<br/>District Vehari, Punjab, Pakistan • Ph: 0301-6509222</div>
              </div>
  
              <table class="paper-info">
                <tr>
                  <td><strong>Class:</strong> ${paper.class}</td>
                  <td><strong>Subject:</strong> ${paper.subject}</td>
                  <td><strong>Maximum Marks:</strong> 15</td>
                </tr>
                <tr>
                  <td><strong>Student Name:</strong> _____________</td>
                  <td><strong>Section:</strong> _______</td>
                  <td><strong>Roll No.:</strong> _______</td>
                </tr>
                <tr>
                  <td><strong>Time:</strong> 30 mins</td>
                  <td><strong>Paper Type:</strong> _______</td>
                  <td><strong>Obtained Marks:</strong> _______</td>
                </tr>
              </table>
  
              ${questionsHtml}
  
              <script>
                window.onload = () => {
                  setTimeout(() => {
                    window.print();
                    window.onafterprint = () => {
                      window.close();
                    };
                  }, 1000);
                };
              </script>
            </body>
          </html>
        `)
        printWindow.document.close()
      }
    } catch (error) {
      console.error('Error printing paper:', error)
      toast.error('Error preparing paper for print')
    }
  }

  // Filter papers based on search and filters
  const filteredPapers = papers.filter(paper => {
    const matchesSearch = searchQuery === '' || 
      paper.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.subject.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesClass = filterClass === '' || paper.class === filterClass
    const matchesSubject = filterSubject === '' || paper.subject === filterSubject
    
    return matchesSearch && matchesClass && matchesSubject
  })

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50/30 to-cyan-50 relative overflow-hidden">
      {/* Enhanced decorative patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,#f1f5f9_25%,transparent_25%,transparent_75%,#f1f5f9_75%,#f1f5f9)] bg-[length:20px_20px] pointer-events-none opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-20" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-blue-200/20 via-purple-200/20 to-cyan-200/20 blur-3xl rounded-full transform translate-x-1/4 -translate-y-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-indigo-200/20 via-pink-200/20 to-purple-200/20 blur-3xl rounded-full transform -translate-x-1/4 translate-y-1/4 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12 relative"
      >
        {/* Enhanced Header Section */}
        <div className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent drop-shadow-sm"
          >
            Saved Papers Archive
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 max-w-2xl mx-auto mb-4"
          >
            Access and manage all your saved question papers in one place. Print or delete papers as needed.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-2 text-sm"
          >
            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">Home</Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-500">Saved Papers</span>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100/50 hover:border-blue-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl shadow-sm">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Papers</p>
                <p className="text-2xl font-bold text-gray-800">{papers.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100/50 hover:border-cyan-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-50 rounded-xl shadow-sm">
                <svg className="w-8 h-8 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Unique Subjects</p>
                <p className="text-2xl font-bold text-gray-800">{availableSubjects.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100/50 hover:border-indigo-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 rounded-xl shadow-sm">
                <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Available Classes</p>
                <p className="text-2xl font-bold text-gray-800">{availableClasses.length}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-100/50">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text ">Find Saved Papers</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Search Input */}
                <div className="md:col-span-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by class or subject..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Class Filter */}
                <div className="relative">
                  <select
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                    className="w-full p-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all appearance-none cursor-pointer shadow-sm"
                  >
                    <option value="">All Classes</option>
                    {availableClasses.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Subject Filter */}
                <div className="relative">
                  <select
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                    className="w-full p-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all appearance-none cursor-pointer shadow-sm"
                  >
                    <option value="">All Subjects</option>
                    {availableSubjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Generate New Paper Button */}
                <div className="md:col-span-3">
                  <Link 
                    href="/generate-paper"
                    className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2 mx-auto transform hover:scale-105 duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Generate New Paper
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Papers Grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 shadow-lg"></div>
          </div>
        ) : filteredPapers.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center min-h-[400px] text-center rounded-2xl shadow-lg p-12 backdrop-blur-sm bg-white/80 border border-gray-100/50"
          >
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="text-xl font-semibold text-gray-700 mb-2">No saved papers found</div>
            <p className="text-gray-500 mb-8">Try adjusting your search or filters</p>
            <Link 
              href="/generate-paper"
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all shadow-md hover:shadow-xl flex items-center gap-2 transform hover:scale-105 duration-300"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Generate New Paper
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPapers.map((paper, index) => (
              <motion.div
                key={paper.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100/50 hover:border-blue-100/80"
              >
                <div className="p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full opacity-70 pointer-events-none"></div>
                  
                  <div className="flex justify-between items-start mb-4 relative">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <h2 className="text-xl font-bold text-gray-800">{paper.class}</h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <h3 className="text-lg text-gray-700">{paper.subject}</h3>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium shadow-sm">
                      Saved
                    </span>
                  </div>
                  
                  <div className="space-y-3 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Created: {new Date(paper.created_at).toLocaleDateString()}
                    </p>
                    <p className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Modified: {new Date(paper.updated_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
                    <button
                      onClick={() => handleDelete(paper.id)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300 flex items-center gap-2 hover:shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                    <button
                      onClick={() => handlePrint(paper)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all shadow-sm hover:shadow-md flex items-center gap-2 transform hover:scale-105 duration-300"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Print
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
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
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#ECFDF5',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FEF2F2',
            },
          },
        }} 
      />
    </div>
    </ProtectedRoute>
  )
}