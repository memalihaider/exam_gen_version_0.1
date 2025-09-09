'use client';

import { useEffect, useMemo, useState } from 'react';
import { Book, Plus, Search, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Books page - add/view books used for syllabus mapping and question sourcing.
 * This is a client-only page. Uses localStorage now, can be swapped to API later.
 */
export default function Page() {
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);

  // --- Load books from localStorage or fallback to defaults
  const [books, setBooks] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('books');
      if (stored) return JSON.parse(stored);
    }
    return [
      {
        id: 1,
        title: 'Physics Part I',
        author: 'Khan',
        subject: 'Physics',
        grade: '11th',
        year: '2024',
        publisher: 'Oxford',
        isbn: '978-0001',
      },
      {
        id: 2,
        title: 'Urdu Lazmi',
        author: 'Ayesha',
        subject: 'Urdu',
        grade: '9th',
        year: '2023',
        publisher: 'FEP',
        isbn: '978-0002',
      },
      {
        id: 3,
        title: 'Chemistry Fundamentals',
        author: 'Ali',
        subject: 'Chemistry',
        grade: '10th',
        year: '2022',
        publisher: 'Elite Press',
        isbn: '978-0003',
      },
    ];
  });

  // Keep localStorage synced whenever books change
  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books));
  }, [books]);

  const [form, setForm] = useState({
    title: '',
    author: '',
    subject: 'Physics',
    grade: '9th',
    year: '',
    publisher: '',
    isbn: '',
  });

  const filtered = useMemo(
    () =>
      books.filter((b) =>
        [b.title, b.author, b.subject, b.grade, b.publisher, b.isbn]
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [books, query]
  );

 function addBook(e) {
  e.preventDefault();
  const id = Date.now();
  setBooks([{ id, ...form }, ...books]);
  setForm({
    title: '',
    author: '',
    subject: 'Physics',
    grade: '9th',
    year: '',
    publisher: '',
    isbn: '',
  });
  setShowForm(false);
}

  const stats = useMemo(() => {
    const totalBooks = books.length;
    const subjects = new Set(books.map((b) => b.subject)).size;
    const latestYear =
      books.length > 0 ? Math.max(...books.map((b) => Number(b.year) || 0)) : 'N/A';
    const publishers = new Set(books.map((b) => b.publisher)).size;
    return { totalBooks, subjects, latestYear, publishers };
  }, [books]);

const statsVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
};

  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: 'easeIn' } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center gap-2">
            <Book className="w-8 h-8 text-blue-600" /> Book Management
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            Reference books for syllabus alignment & question sourcing.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 items-center w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, author, subject..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200 shadow-sm"
            />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200 transform hover:-translate-y-0.5 shadow-lg"
          >
            <Plus className="w-4 h-4" /> Add New Book
          </button>
        </div>
      </motion.header>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={statsVariants}
          className="rounded-2xl border border-gray-200 p-6 bg-white shadow-md"
        >
          <p className="text-sm text-gray-500 font-medium">Total Books</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalBooks}</p>
        </motion.div>
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={statsVariants}
          className="rounded-2xl border border-gray-200 p-6 bg-white shadow-md"
        >
          <p className="text-sm text-gray-500 font-medium">Unique Subjects</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.subjects}</p>
        </motion.div>
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={statsVariants}
          className="rounded-2xl border border-gray-200 p-6 bg-white shadow-md"
        >
          <p className="text-sm text-gray-500 font-medium">Latest Year</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.latestYear}</p>
        </motion.div>
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={statsVariants}
          className="rounded-2xl border border-gray-200 p-6 bg-white shadow-md"
        >
          <p className="text-sm text-gray-500 font-medium">Publishers</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.publishers}</p>
        </motion.div>
      </section>

      {/* Table */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={tableVariants}
        className="overflow-hidden rounded-2xl border border-gray-200 shadow-md bg-white"
      >
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-600 font-semibold uppercase tracking-wider">
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Author</th>
              <th className="px-6 py-4">Subject</th>
              <th className="px-6 py-4">Grade</th>
              <th className="px-6 py-4">Publisher</th>
              <th className="px-6 py-4">Year</th>
              <th className="px-6 py-4">ISBN</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <AnimatePresence>
              {filtered.map((b) => (
                <motion.tr
                  key={b.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">{b.title}</td>
                  <td className="px-6 py-4 text-gray-700">{b.author}</td>
                  <td className="px-6 py-4 text-gray-700">{b.subject}</td>
                  <td className="px-6 py-4 text-gray-700">{b.grade}</td>
                  <td className="px-6 py-4 text-gray-700">{b.publisher}</td>
                  <td className="px-6 py-4 text-gray-700">{b.year}</td>
                  <td className="px-6 py-4 text-gray-700">{b.isbn}</td>
                </motion.tr>
              ))}
              {!filtered.length && (
                <tr key="no-books">
                  <td
                    colSpan={7}
                    className="text-center p-12 text-gray-500 italic"
                  >
                    <p className="flex items-center justify-center gap-2">
                      <XCircle className="w-5 h-5" /> No books found. Try a
                      different search.
                    </p>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 grid place-items-center p-4"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={formVariants}
              className="bg-white w-full max-w-xl rounded-2xl p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-2xl text-gray-800">Add New Book</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <form
                onSubmit={addBook}
                className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <input
                  required
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
                <input
                  placeholder="Author"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                >
                  <option>Physics</option>
                  <option>Chemistry</option>
                  <option>Biology</option>
                  <option>Mathematics</option>
                  <option>Urdu</option>
                  <option>English</option>
                </select>
                <select
                  value={form.grade}
                  onChange={(e) => setForm({ ...form, grade: e.target.value })}
                  className="px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                >
                  <option>9th</option>
                  <option>10th</option>
                  <option>11th</option>
                  <option>12th</option>
                </select>
                <input
                  placeholder="Publisher"
                  value={form.publisher}
                  onChange={(e) =>
                    setForm({ ...form, publisher: e.target.value })
                  }
                  className="px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
                <input
                  placeholder="Year"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className="px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
                <input
                  placeholder="ISBN"
                  value={form.isbn}
                  onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                  className="px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors md:col-span-2"
                />
                <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
                    Save Book
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
