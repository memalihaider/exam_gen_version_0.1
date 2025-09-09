"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/contexts/UserContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function Profile() {
  const { user } = useUser();
  // First, remove these fields from the initial state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    role: '',
    schoolName: '',
    package: '',
    expiryDate: '',
    class: '',
    subject: [],
    status: '',
    fatherName: ''
  });
  
  // Update the useEffect to remove these fields
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.teacherName || user.name || '',
        email: user.email || '',
        role: user.role || '',
        schoolName: user.schoolName || user.school_name || '',
        package: user.package || '',
        expiryDate: user.expiryDate || user.expiry_date || '',
        class: user.class || '',
        subject: Array.isArray(user.subject) ? user.subject : [],
        status: user.status || '',
        fatherName: user.fatherName || user.father_name || ''
      });
    }
  }, [user]);
  
  const handleUpdate = async () => {
    try {
      const response = await fetch('https://edu.largifysolutions.com/auth.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: user.role === 'teacher' ? 'updateTeacher' : 'updateUser',
          teacher: user.role === 'teacher' ? {
            id: user.id,
            teacherName: profileData.name,
            email: profileData.email,
            class: profileData.class,
            subject: profileData.subject,
            status: profileData.status,
            address: profileData.address, // Add address field
            fatherName: profileData.fatherName // Add father name field
          } : null,
          user: user.role !== 'teacher' ? {
            id: user.id,
            name: profileData.name,
            email: profileData.email,
            schoolName: profileData.schoolName,
            package: profileData.package,
            expiryDate: profileData.expiryDate,
            status: profileData.status,
            phone: profileData.phone, // Add phone field
            address: profileData.address // Add address field
          } : null
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Profile updated successfully!');
      } else {
        throw new Error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    }
  };

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Profile
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">Home</Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-500">Profile</span>
          </div>
        </div>

        {/* Profile Content */}
        <div className="max-w-4xl mx-auto">
          {/* Banner and Logo */}
          <div className="relative mb-12">
            <div className="h-48 rounded-xl overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/5088008/pexels-photo-5088008.jpeg"
                alt="Profile Banner"
                className="w-full h-full object-cover"
                width={1200}
                height={300}
                priority
              />
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                <Image
                  src="https://images.pexels.com/photos/3747139/pexels-photo-3747139.jpeg"
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                  width={128}
                  height={128}
                  priority
                />
              </div>
            </div>
          </div>

          
          
          {/* Profile Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mt-12">
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 outline-none cursor-not-allowed"
                  readOnly
                />
              </div>

              {user?.role === 'teacher' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Father Name
                  </label>
                  <input
                    type="text"
                    value={profileData.fatherName || ''}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 outline-none cursor-not-allowed"
                    readOnly
                  />
                </div>
              )}

              {/* Remove phone and address fields here */}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  readOnly
                />
              </div>

              {/* Role Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={profileData.role}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  readOnly
                />
              </div>

              {user?.role === 'teacher' ? (
                <>
                  {/* Class Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class
                    </label>
                    <input
                      type="text"
                      value={profileData.class}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 outline-none cursor-not-allowed"
                      readOnly
                    />
                  </div>

                  {/* School Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      School Name
                    </label>
                    <input
                      type="text"
                      value={profileData.schoolName}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 outline-none cursor-not-allowed"
                      readOnly
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 outline-none cursor-not-allowed"
                      readOnly
                    />
                  </div>

                  {/* Remove all onChange handlers and update styling for remaining fields */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subjects
                    </label>
                    <input
                      type="text"
                      value={profileData.subject.join(', ')}
                      readOnly
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* School Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      School Name
                    </label>
                    <input
                      type="text"
                      value={profileData.schoolName}
                      onChange={(e) => setProfileData({ ...profileData, schoolName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    />
                  </div>

                  {/* Package Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Package
                    </label>
                    <input
                      type="text"
                      value={profileData.package}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                      readOnly
                    />
                  </div>

                  {/* Expiry Date Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={profileData.expiryDate}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                      readOnly
                    />
                  </div>
                </>
              )}

              {/* Status Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <input
                  type="text"
                  value={profileData.status}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 outline-none cursor-not-allowed"
                  readOnly
                />
              </div>
              {/* Remove the Update Button section entirely */}
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}