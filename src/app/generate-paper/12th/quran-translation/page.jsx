"use client";
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { quranTranslationUnits } from './unitsData';
import { ProtectedRoute } from "@/components/ProtectedRoute";

const QuranTranslation12th = () => {
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUnitCheckboxChange = (unit) => {
    const unitExercises = unit.exercises;
    const allSelected = unitExercises.every(ex => selectedExercises.includes(ex));
    
    if (allSelected) {
      setSelectedExercises(prev => prev.filter(ex => !unitExercises.includes(ex)));
    } else {
      setSelectedExercises(prev => [...prev, ...unitExercises.filter(ex => !prev.includes(ex))]);
    }
  };

  const handleExerciseCheckboxChange = (exercise) => {
    setSelectedExercises(prev => 
      prev.includes(exercise)
        ? prev.filter(ex => ex !== exercise)
        : [...prev, exercise]
    );
  };

  const isUnitFullySelected = (unit) => {
    return unit.exercises.every(ex => selectedExercises.includes(ex));
  };

  const handleGeneratePaper = async () => {
    if (selectedExercises.length > 0) {
      setIsLoading(true);
      try {
        // Store selected exercises in localStorage
        localStorage.setItem("selectedQuranExercises", JSON.stringify(selectedExercises));
        
        // Navigate to the preview page
        window.location.href = "/generate-paper/12th/quran-translation/preview";
      } catch (error) {
        console.error("Error generating paper:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 font-nastaliq" dir="rtl">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent font-nastaliq">
              ترجمۃ القرآن المجید - دوئم سال
            </h1>
            <p className="text-gray-600 mb-6 text-2xl font-nastaliq">سورتوں کا انتخاب کریں</p>
            <div className="flex items-center justify-center gap-2 text-xl">
              <Link href="/" className="text-amber-600 hover:text-amber-800 transition-colors font-nastaliq">ہوم</Link>
              <span className="text-gray-500">/</span>
              <Link href="/generate-paper" className="text-amber-600 hover:text-amber-800 transition-colors font-nastaliq">پرچہ جات</Link>
              <span className="text-gray-500">/</span>
              <Link href="/generate-paper/12th" className="text-amber-600 hover:text-amber-800 transition-colors font-nastaliq">بارہویں جماعت</Link>
              <span className="text-gray-500">/</span>
              <span className="text-gray-500 font-nastaliq">ترجمۃ القرآن المجید</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8 max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="سورت تلاش کریں..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all text-xl"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </div>

          {/* Units Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {quranTranslationUnits
              .filter(unit => 
                unit.title.includes(searchTerm) ||
                unit.exercises.some(ex => ex.includes(searchTerm))
              )
              .map((unit, index) => (
              <motion.div
                key={unit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 overflow-hidden"
              >
                {/* Unit Header */}
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-yellow-50">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex-grow text-right">
                      <h3 className="text-3xl font-semibold text-gray-800 group-hover:text-amber-600 transition-colors font-nastaliq">
                        {unit.title}
                      </h3>
                      <p className="text-lg text-gray-500 mt-1 font-nastaliq">
                        {unit.exercises.length} سورتیں دستیاب ہیں
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isUnitFullySelected(unit)}
                        onChange={() => handleUnitCheckboxChange(unit)}
                        className="w-6 h-6 text-amber-600 rounded-lg border-gray-300 focus:ring-amber-500 transition-all"
                      />
                    </div>
                  </label>
                </div>

                {/* Topics List */}
                <div className="divide-y divide-gray-100">
                  {unit.exercises.map((exercise) => (
                    <label
                      key={exercise}
                      className="flex items-center space-x-3 cursor-pointer group hover:bg-amber-50 px-6 py-3 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={selectedExercises.includes(exercise)}
                        onChange={() => handleExerciseCheckboxChange(exercise)}
                        className="w-5 h-5 text-amber-600 rounded-lg border-gray-300 focus:ring-amber-500 transition-all ml-3"
                      />
                      <span className="text-gray-700 group-hover:text-amber-600 transition-colors text-right flex-grow text-xl font-nastaliq">
                        {exercise}
                      </span>
                    </label>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Generate Button */}
          <div className="mt-12 flex flex-col items-center">
            <p className="text-gray-600 mb-4 text-2xl">
              {selectedExercises.length} سورتیں منتخب کی گئیں
            </p>
            <button
              onClick={handleGeneratePaper}
              className={`
                px-10 py-4 rounded-xl font-semibold text-white text-2xl
                transition-all duration-300 transform
                flex items-center gap-2 font-nastaliq
                ${selectedExercises.length > 0
                  ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:scale-105 hover:shadow-xl'
                  : 'bg-gray-400 cursor-not-allowed'
                }
              `}
              disabled={selectedExercises.length === 0 || isLoading}
            >
              <span>{isLoading ? 'برائے مہربانی انتظار کریں...' : 'پرچہ تیار کریں'}</span>
              {!isLoading && selectedExercises.length > 0 && <span>←</span>}
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default QuranTranslation12th;