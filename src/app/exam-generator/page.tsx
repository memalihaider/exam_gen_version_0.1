"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Mock ProtectedRoute component for demonstration purposes
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, you would check the user's authentication status here.
    setIsAuthenticated(true);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600">You are not not authorized to view this page.</div>
      </div>
    );
  }

  return <>{children}</>;
};

const GenerateExam = () => {
  const [examSettings, setExamSettings] = useState({
    class: '',
    subject: '',
    difficulty: 'medium',
    questionCount: 10,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const classes = ['12th', '11th', '10th', '9th', '8th', '7th', '6th', '5th'];
  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Computer Science'
  ];
  const difficulties = ['easy', 'medium', 'hard'];

  const handleSelect = (field, value) => {
    setExamSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    setMessage({ type: '', text: '' });
    setIsLoading(true);

    // Simulate an AI API call
    try {
      // In a real application, you would use fetch() here
      // to send examSettings to your backend API for AI generation.
      // await fetch('/api/generate-exam', { method: 'POST', body: JSON.stringify(examSettings) });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000)); 

      console.log("Generating exam with settings:", examSettings);
      setMessage({ type: 'success', text: 'Exam generated successfully! Check the console for details.' });
    } catch (error) {
      console.error("Failed to generate exam:", error);
      setMessage({ type: 'error', text: 'Failed to generate exam. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 w-full max-w-4xl"
        >
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Generate Exam
            </h1>
            <p className="text-gray-500 text-lg">
              Create a custom exam by defining your specific requirements.
            </p>
          </div>

          <div className="space-y-8">
            {/* Class & Subject Selection */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">1. Select Class & Subject</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <p className="font-semibold text-gray-700 mb-2">Class</p>
                  <div className="grid grid-cols-4 gap-2">
                    {classes.map(cls => (
                      <motion.button
                        key={cls}
                        onClick={() => handleSelect('class', cls)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`py-2 px-3 rounded-lg font-medium transition-colors shadow-md ${
                          examSettings.class === cls
                            ? 'bg-purple-600 text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        {cls}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <p className="font-semibold text-gray-700 mb-2">Subject</p>
                  <div className="flex flex-wrap gap-2">
                    {subjects.map(sub => (
                      <motion.button
                        key={sub}
                        onClick={() => handleSelect('subject', sub)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`py-2 px-3 rounded-lg font-medium text-sm transition-colors shadow-md ${
                          examSettings.subject === sub
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        {sub}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Difficulty & Question Count */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">2. Define Exam Parameters</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <p className="font-semibold text-gray-700 mb-2">Difficulty</p>
                  <div className="flex gap-2">
                    {difficulties.map(diff => (
                      <motion.button
                        key={diff}
                        onClick={() => handleSelect('difficulty', diff)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex-1 py-3 px-4 rounded-lg capitalize font-medium transition-colors shadow-md ${
                          examSettings.difficulty === diff
                            ? 'bg-rose-500 text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        {diff}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <label htmlFor="questionCount" className="font-semibold text-gray-700 mb-2 block">
                    Number of Questions: <span className="font-bold text-rose-500">{examSettings.questionCount}</span>
                  </label>
                  <input
                    type="range"
                    id="questionCount"
                    name="questionCount"
                    value={examSettings.questionCount}
                    onChange={(e) => handleSelect('questionCount', parseInt(e.target.value))}
                    min="1"
                    max="50"
                    className="w-full h-2 bg-gradient-to-r from-gray-200 to-gray-400 rounded-lg appearance-none cursor-pointer"
                    style={{
                      '--webkit-slider-thumb-bg': '#ef4444',
                      '--moz-range-thumb-bg': '#ef4444'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Generate Button & Message */}
            <div className="text-center">
              <motion.button
                onClick={handleGenerate}
                type="button"
                disabled={isLoading || !examSettings.class || !examSettings.subject}
                whileHover={{ scale: (isLoading || !examSettings.class || !examSettings.subject) ? 1 : 1.02 }}
                whileTap={{ scale: (isLoading || !examSettings.class || !examSettings.subject) ? 1 : 0.98 }}
                className={`w-full max-w-sm mx-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-4 rounded-full shadow-lg transition-all duration-300 ${
                  (isLoading || !examSettings.class || !examSettings.subject) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Exam...
                  </span>
                ) : 'Generate Exam'}
              </motion.button>
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`mt-4 text-center px-4 py-3 rounded-lg shadow-sm ${
                    message.type === 'success'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {message.text}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
};

export default GenerateExam;
