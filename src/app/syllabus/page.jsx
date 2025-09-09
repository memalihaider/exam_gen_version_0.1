'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ListOrdered, GraduationCap, Book, X, ChevronDown } from 'lucide-react';

/**
 * Syllabus mapping UI:
 * - Maps chapters and units for AI paper generation.
 * - This version uses localStorage for data persistence, mimicking API calls.
 */
const DYNAMIC_SYLLABUS = {
  '9th': {
    'Biology': [
      { id: 1, title: 'Cell Structure', units: ['Cell Theory', 'Organelles', 'Microscope'] },
      { id: 2, title: 'Bioenergetics', units: ['ATP', 'Photosynthesis', 'Respiration'] },
      { id: 3, title: 'Genetics', units: ['DNA', 'Genes', 'Heredity', 'Mutations'] },
      { id: 4, title: 'Ecology', units: ['Ecosystems', 'Food Chains', 'Biodiversity', 'Biomes'] },
      { id: 5, title: 'Human Biology', units: ['Circulatory System', 'Nervous System', 'Endocrine System', 'Reproduction'] },
    ],
    'Physics': [
      { id: 101, title: 'Motion', units: ['Distance & Displacement', 'Speed & Velocity', 'Acceleration'] },
      { id: 102, title: 'Force & Laws of Motion', units: ['Newton\'s Laws', 'Friction', 'Momentum'] },
    ],
    'Chemistry': [
      { id: 301, title: 'Matter', units: ['States of Matter', 'Atoms', 'Elements'] },
    ],
  },
  '10th': {
    'Biology': [
      { id: 201, title: 'Homeostasis', units: ['Kidneys', 'Liver', 'Skin'] },
      { id: 202, title: 'Support & Movement', units: ['Skeletal System', 'Muscles', 'Joints'] },
    ],
    'Chemistry': [
      { id: 301, title: 'Chemical Reactions', units: ['Types of Reactions', 'Balancing Equations'] },
      { id: 302, title: 'Acids, Bases & Salts', units: ['pH Scale', 'Neutralization'] },
    ],
    'Mathematics': [
      { id: 401, title: 'Algebraic Expressions', units: ['Polynomials', 'Rational Expressions'] },
    ],
  },
  '11th': {
    'Biology': [
      { id: 501, title: 'The Cell', units: ['Cell Wall', 'Prokaryotic Cells', 'Eukaryotic Cells', 'Cell Cycle'] },
      { id: 502, title: 'Variety of Life', units: ['Viruses', 'Kingdoms', 'Fungi', 'Algae'] },
    ],
    'Physics': [
      { id: 601, title: 'Vectors & Equilibrium', units: ['Vector Addition', 'Torque', 'Equilibrium of Forces'] },
      { id: 602, title: 'Motion & Momentum', units: ['Projectile Motion', 'Elastic Collisions', 'Inelastic Collisions'] },
    ],
    'Chemistry': [
      { id: 701, title: 'Stoichiometry', units: ['Mole Concept', 'Limiting Reactant', 'Yield'] },
      { id: 702, title: 'Atomic Structure', units: ['Bohr\'s Model', 'Quantum Numbers', 'Electron Configuration'] },
    ],
  },
  '12th': {
    'Biology': [
      { id: 801, title: 'Evolution', units: ['Darwinism', 'Lamarckism', 'Genetic Drift'] },
      { id: 802, title: 'Biotechnology', units: ['Genetic Engineering', 'Recombinant DNA', 'Cloning'] },
    ],
    'Physics': [
      { id: 901, title: 'Electrostatics', units: ['Coulomb\'s Law', 'Electric Field', 'Electric Potential'] },
      { id: 902, title: 'Current Electricity', units: ['Ohm\'s Law', 'Kirchhoff\'s Rules', 'Circuit Analysis'] },
    ],
    'Mathematics': [
      { id: 1001, title: 'Calculus', units: ['Limits', 'Derivatives', 'Integrals'] },
      { id: 1002, title: 'Trigonometry', units: ['Identities', 'Equations', 'Inverse Functions'] },
    ],
  },
};

// Framer Motion variants for animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
};

// Custom animation variants for the dropdown menu
const dropdownVariants = {
  open: { opacity: 1, y: 0, scaleY: 1, transition: { type: 'spring', stiffness: 400, damping: 25 } },
  closed: { opacity: 0, y: -10, scaleY: 0.9, transition: { duration: 0.2 } },
};

export default function Page() {
  const initialGrade = '9th';
  const initialSubject = Object.keys(DYNAMIC_SYLLABUS[initialGrade])[0];

  const [grade, setGrade] = useState(initialGrade);
  const [subject, setSubject] = useState(initialSubject);
  const [chapters, setChapters] = useState([]);
  const [selected, setSelected] = useState({});
  const [isGradeDropdownOpen, setIsGradeDropdownOpen] = useState(false);
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);

  /**
   * Loads data from localStorage based on the current grade and subject.
   */
  const loadSyllabus = (currentGrade, currentSubject) => {
    try {
      const savedChaptersKey = `syllabus_chapters_${currentGrade}_${currentSubject}`;
      const savedSelectedKey = `syllabus_selected_${currentGrade}_${currentSubject}`;

      const savedChapters = localStorage.getItem(savedChaptersKey);
      const savedSelected = localStorage.getItem(savedSelectedKey);
      
      const newChapters = savedChapters ? JSON.parse(savedChapters) : DYNAMIC_SYLLABUS[currentGrade]?.[currentSubject] || [];
      const newSelected = savedSelected ? JSON.parse(savedSelected) : {};
      
      setChapters(newChapters);
      setSelected(newSelected);
      console.log(`Loaded syllabus for ${currentGrade} - ${currentSubject}`);

    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
    }
  };

  /**
   * Saves data to localStorage, using a key unique to the current grade and subject.
   */
  const saveSyllabus = () => {
    try {
      const chaptersKey = `syllabus_chapters_${grade}_${subject}`;
      const selectedKey = `syllabus_selected_${grade}_${subject}`;

      localStorage.setItem(chaptersKey, JSON.stringify(chapters));
      localStorage.setItem(selectedKey, JSON.stringify(selected));
      console.log('Syllabus mapping saved successfully!');
    } catch (error) {
      console.error('Failed to save data to localStorage:', error);
    }
  };

  // Load data whenever the grade or subject changes.
  useEffect(() => {
    // If the selected grade doesn't have the current subject, default to the first available subject
    const availableSubjects = DYNAMIC_SYLLABUS[grade] ? Object.keys(DYNAMIC_SYLLABUS[grade]) : [];
    if (!availableSubjects.includes(subject)) {
      setSubject(availableSubjects[0] || '');
    }
    loadSyllabus(grade, subject);
  }, [grade, subject]);

  const allSelectedUnits = useMemo(() => {
    return Object.entries(selected)
      .flatMap(([chapterId, units]) => units.map(unit => ({ chapterId, unit })))
      .filter(({ unit }) => unit);
  }, [selected]);

  function toggleUnit(chapterId, unit) {
    setSelected((prev) => {
      const arr = new Set(prev[chapterId] || []);
      arr.has(unit) ? arr.delete(unit) : arr.add(unit);
      return { ...prev, [chapterId]: Array.from(arr) };
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-10 max-w-7xl mx-auto font-sans text-gray-800">
      {/* Page Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center gap-2">
            <ListOrdered className="w-8 h-8 text-blue-600" /> Syllabus Alignment
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            Map chapters and units to drive AI paper generation and filtering.
          </p>
        </div>
      </motion.header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Sidebar for filters and summary */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl border border-gray-200 p-6 bg-white shadow-md"
        >
          {/* Class Selector - Custom Dropdown */}
          <div className="relative mb-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
              <GraduationCap className="w-4 h-4 text-blue-500" /> Class
            </div>
            <div className="relative mt-2" onBlur={() => setIsGradeDropdownOpen(false)} tabIndex={0}>
              <button
                onClick={() => setIsGradeDropdownOpen(!isGradeDropdownOpen)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-gray-50 text-gray-700 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <span>{grade}</span>
                <ChevronDown className={`transform transition-transform duration-200 ${isGradeDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <motion.ul
                initial="closed"
                animate={isGradeDropdownOpen ? "open" : "closed"}
                variants={dropdownVariants}
                style={{ originY: "top", pointerEvents: isGradeDropdownOpen ? "auto" : "none" }}
                className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-40 overflow-y-auto"
              >
                {Object.keys(DYNAMIC_SYLLABUS).map(g => (
                  <li
                    key={g}
                    onMouseDown={() => {
                      setGrade(g);
                      setIsGradeDropdownOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer rounded-xl transition-colors"
                  >
                    {g}
                  </li>
                ))}
              </motion.ul>
            </div>
          </div>

          {/* Subject Selector - Custom Dropdown */}
          <div className="relative mb-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
              <Book className="w-4 h-4 text-blue-500" /> Subject
            </div>
            <div className="relative mt-2" onBlur={() => setIsSubjectDropdownOpen(false)} tabIndex={0}>
              <button
                onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-gray-50 text-gray-700 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <span>{subject}</span>
                <ChevronDown className={`transform transition-transform duration-200 ${isSubjectDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <motion.ul
                initial="closed"
                animate={isSubjectDropdownOpen ? "open" : "closed"}
                variants={dropdownVariants}
                style={{ originY: "top", pointerEvents: isSubjectDropdownOpen ? "auto" : "none" }}
                className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-40 overflow-y-auto"
              >
                {Object.keys(DYNAMIC_SYLLABUS[grade] || {}).map(s => (
                  <li
                    key={s}
                    onMouseDown={() => {
                      setSubject(s);
                      setIsSubjectDropdownOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer rounded-xl transition-colors"
                  >
                    {s}
                  </li>
                ))}
              </motion.ul>
            </div>
          </div>

          {/* Selected Units Summary */}
          <div className="mt-6">
            <div className="text-sm font-semibold text-gray-600 mb-2">Selected Units:</div>
            <div className="flex flex-wrap gap-2">
              {allSelectedUnits.length > 0 ? (
                allSelectedUnits.map(({ unit, chapterId }) => (
                  <motion.div
                    key={`${chapterId}-${unit}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 border border-blue-200 shadow-sm cursor-pointer"
                    onClick={() => toggleUnit(chapterId, unit)}
                  >
                    <span>{unit}</span>
                    <X className="w-3 h-3 text-blue-500 hover:text-blue-700 transition-colors" />
                  </motion.div>
                ))
              ) : (
                <span className="text-gray-400 text-sm">No units selected</span>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={saveSyllabus}
              className="w-full px-4 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors transform hover:-translate-y-0.5 shadow-lg"
            >
              Save Mapping
            </button>
          </div>
        </motion.div>

        {/* Chapters & Units Section */}
        <div className="md:col-span-2 lg:col-span-3">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Chapters & Units</h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={`${grade}-${subject}`}
            className="space-y-6"
          >
            {chapters.length > 0 ? (
              chapters.map((ch) => (
                <motion.div
                  key={ch.id}
                  variants={itemVariants}
                  className="rounded-2xl border border-gray-200 p-5 bg-white shadow-sm"
                >
                  <div className="font-bold text-lg text-gray-900">{ch.title}</div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {ch.units.map((u) => {
                      const active = (selected[ch.id] || []).includes(u);
                      return (
                        <motion.button
                          key={u}
                          onClick={() => toggleUnit(ch.id, u)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 shadow-sm
                            ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                          `}
                        >
                          {u}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500">No chapters found for this subject and grade.</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}