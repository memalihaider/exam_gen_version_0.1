'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

interface Student {
  id: number;
  student_name: string;
  father_name: string;
  admission_number: string;
  email: string;
  class: string;
  address: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  status: 'active' | 'inactive';
}

interface FormData {
  studentName: string;
  fatherName: string;
  admissionNumber: string;
  email: string;
  class: string;
  address: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  status: 'active' | 'inactive';
}

export default function StudentManagement() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState<FormData>({
    studentName: '',
    fatherName: '',
    admissionNumber: '',
    email: '',
    class: '',
    address: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    status: 'active',
  });

  const classOptions: string[] = ['9th', '10th', '11th', '12th'];

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://edu.largifysolutions.com/api-students.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ action: 'getAllStudents' }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (data.success) {
        setStudents(data.students || []);
      } else {
        setError(data.error || 'Failed to load students');
      }
    } catch (err) {
      setError('Connection failed. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (student.student_name || '').toLowerCase().includes(searchLower) ||
      (student.father_name || '').toLowerCase().includes(searchLower) ||
      (student.admission_number || '').toLowerCase().includes(searchLower) ||
      (student.email || '').toLowerCase().includes(searchLower) ||
      (student.class || '').toLowerCase().includes(searchLower)
    );
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      studentName: student.student_name || '',
      fatherName: student.father_name || '',
      admissionNumber: student.admission_number || '',
      email: student.email || '',
      class: student.class || '',
      address: student.address || '',
      phone: student.phone || '',
      dateOfBirth: student.date_of_birth || '',
      gender: student.gender || 'Male',
      status: student.status || 'active',
    });
    setShowModal(true);
  };

  const handleDelete = async (studentId: number) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const response = await fetch('https://edu.largifysolutions.com/api-students.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'deleteStudent', studentId }),
        });
        const data = await response.json();
        if (data.success) {
          setSuccessMessage('Student deleted successfully');
          fetchStudents();
        } else {
          throw new Error(data.error || 'Failed to delete student');
        }
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err: any) {
        setError(err.message || 'Failed to delete student');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const action = editingStudent ? 'updateStudent' : 'addStudent';
      const body = editingStudent
        ? { action, studentId: editingStudent.id, ...formData }
        : { action, ...formData };

      const response = await fetch('https://edu.largifysolutions.com/api-students.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (data.success) {
        setSuccessMessage(`Student ${editingStudent ? 'updated' : 'added'} successfully`);
        setShowModal(false);
        setEditingStudent(null);
        setFormData({
          studentName: '',
          fatherName: '',
          admissionNumber: '',
          email: '',
          class: '',
          address: '',
          phone: '',
          dateOfBirth: '',
          gender: 'Male',
          status: 'active',
        });
        fetchStudents();
      } else {
        throw new Error(data.error || 'Failed to save student');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save student');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              LS Student Management
            </h1>
          </div>

          {successMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow-md">
              <p>{successMessage}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-md">
              <p>{error}</p>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-md"
          >
            {/* Search + Add Button */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="relative w-full md:w-1/2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => {
                  setEditingStudent(null);
                  setFormData({
                    studentName: '',
                    fatherName: '',
                    admissionNumber: '',
                    email: '',
                    class: '',
                    address: '',
                    phone: '',
                    dateOfBirth: '',
                    gender: 'Male',
                    status: 'active',
                  });
                  setShowModal(true);
                }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
              >
                <Plus size={20} />
                Add New Student
              </button>
            </div>

            {/* Students Table */}
            {filteredStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4">{student.student_name}</td>
                        <td className="px-6 py-4">{student.email}</td>
                        <td className="px-6 py-4">{student.class}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              student.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button onClick={() => handleEdit(student)} className="text-blue-600 mr-4">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(student.id)} className="text-red-600">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">No students found.</div>
            )}
          </motion.div>

          {/* Modal Form */}
          {showModal && (
            <div className="absolute inset-0 min-h-fit bg-gray-600 bg-opacity-50 py-20 flex items-center justify-center z-50">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="relative p-8 bg-white rounded-lg shadow-xl w-full max-w-lg" 
              >
                <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400">
                  ✕
                </button>
                <h3 className="text-2xl font-semibold mb-6">{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    required
                    placeholder="Student Name"
                    className="w-full border rounded-md p-2"
                  />
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    placeholder="Father's Name"
                    className="w-full border rounded-md p-2"
                  />
                  <input
                    type="text"
                    name="admissionNumber"
                    value={formData.admissionNumber}
                    onChange={handleInputChange}
                    required
                    placeholder="Admission Number"
                    className="w-full border rounded-md p-2"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Email"
                    className="w-full border rounded-md p-2"
                  />
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded-md p-2"
                  >
                    <option value="">Select a class</option>
                    {classOptions.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Address"
                    className="w-full border rounded-md p-2"
                  />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone"
                    className="w-full border rounded-md p-2"
                  />
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full border rounded-md p-2"
                  />
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full border rounded-md p-2"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border rounded-md p-2"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="mr-2 px-4 py-2 bg-gray-200 rounded"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                      {editingStudent ? 'Save Changes' : 'Add Student'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
