"use client";
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { urduUnits } from './unitsData';
import { ProtectedRoute } from "@/components/ProtectedRoute";

const UrduLazmi11th = () => {
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
        localStorage.setItem("selectedUrduLazmi11Exercises", JSON.stringify(selectedExercises));
        
        // Navigate to the preview page
        window.location.href = "/generate-paper/11th/urdu-lazmi/preview";
      } catch (error) {
        console.error("Error generating paper:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 bg-clip-text text-transparent font-nastaliq">
              اردو لازمی - جماعت گیارہویں
            </h1>
            <p className="text-gray-600 mb-6 text-2xl font-nastaliq">پرچہ تیار کرنے کے لیے عنوانات منتخب کریں</p>
            <div className="flex items-center justify-center gap-2 text-xl">
              <Link href="/" className="text-rose-600 hover:text-rose-800 transition-colors font-nastaliq">ہوم</Link>
              <span className="text-gray-500">/</span>
              <Link href="/generate-paper" className="text-rose-600 hover:text-rose-800 transition-colors font-nastaliq">پرچہ جات</Link>
              <span className="text-gray-500">/</span>
              <Link href="/generate-paper/11th" className="text-rose-600 hover:text-rose-800 transition-colors font-nastaliq">گیارہویں جماعت</Link>
              <span className="text-gray-500">/</span>
              <span className="text-gray-500 font-nastaliq">اردو لازمی</span>
            </div>
          </div>
  
          {/* Search Bar */}
          <div className="mb-8 max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="...تلاش کریں"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all text-right font-nastaliq text-xl"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </div>
  
          {/* Units Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {urduUnits
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
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex-grow text-right">
                      <h3 className="text-3xl font-semibold text-gray-800 group-hover:text-rose-600 transition-colors font-nastaliq">
                        {unit.title}
                      </h3>
                      <p className="text-lg text-gray-500 mt-1 font-nastaliq">
                        {unit.exercises.length} عنوانات دستیاب ہیں
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isUnitFullySelected(unit)}
                        onChange={() => handleUnitCheckboxChange(unit)}
                        className="w-6 h-6 text-rose-600 rounded-lg border-gray-300 focus:ring-rose-500 transition-all"
                      />
                    </div>
                  </label>
                </div>
  
                {/* Topics List */}
                <div className="divide-y divide-gray-100">
                  {unit.exercises.map((exercise) => (
                    <label
                      key={exercise}
                      className="flex items-center space-x-3 cursor-pointer group hover:bg-rose-50 px-6 py-3 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={selectedExercises.includes(exercise)}
                        onChange={() => handleExerciseCheckboxChange(exercise)}
                        className="w-5 h-5 text-rose-600 rounded-lg border-gray-300 focus:ring-rose-500 transition-all ml-3"
                      />
                      <span className="text-gray-700 group-hover:text-rose-600 transition-colors text-right w-full text-xl font-nastaliq">
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
            <p className="text-gray-600 mb-4 text-2xl font-nastaliq">
              {selectedExercises.length} عنوانات منتخب کیے گئے
            </p>
            <button
              onClick={handleGeneratePaper}
              className={`
                px-10 py-4 rounded-xl font-semibold text-white text-2xl font-nastaliq
                transition-all duration-300 transform
                flex items-center gap-2
                ${selectedExercises.length > 0
                  ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 hover:scale-105 hover:shadow-xl'
                  : 'bg-gray-400 cursor-not-allowed'
                }
              `}
              disabled={selectedExercises.length === 0 || isLoading}
            >
              {isLoading ? (
                <span>لوڈ ہو رہا ہے...</span>
              ) : (
                <>
                  <span>پرچہ تیار کریں</span>
                  {selectedExercises.length > 0 && <span>←</span>}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default UrduLazmi11th;