"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function LoginHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loginHistory, setLoginHistory] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  const fetchLoginHistory = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        device: selectedDevice,
      });

      const response = await fetch(`https://edu.largifysolutions.com/login-history.php?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      if (data.success) {
        setLoginHistory(data.history);
        setTotalItems(data.total);
      } else {
        console.error('Failed to fetch login history:', data.error);
      }
    } catch (error) {
      console.error('Error fetching login history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoginHistory();
  }, [currentPage, searchTerm, selectedDevice]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDeviceFilter = (e) => {
    setSelectedDevice(e.target.value);
    setCurrentPage(1);
  };

  return (
    <ProtectedRoute adminOnly={true}>
    <ProtectedRoute>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pattern-grid-lg">
      <div className="container mx-auto px-4 py-12">
        {/* Enhanced Header Section */}
        <div className="mb-16 text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 via-blue-600/5 to-indigo-600/5 blur-3xl"></div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent relative">
            Login History
          </h1>
          <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
            Track and monitor all login activities across your devices
          </p>
          <div className="flex items-center justify-center gap-3 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors font-medium">Dashboard</Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-600 font-medium">Login History</span>
          </div>
        </div>

        {/* Enhanced Warning Message */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-red-50 to-red-50/50 border-l-4 border-red-500 p-6 rounded-xl shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-red-800 font-semibold mb-1">Security Alert</h3>
                <p className="text-red-700">If you notice any suspicious login activity, please change your password immediately and contact support.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search login history..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <select
                  value={selectedDevice}
                  onChange={handleDeviceFilter}
                  className="w-full py-3 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none appearance-none bg-white"
                >
                  <option value="">All Devices</option>
                  <option value="Computer">Computer</option>
                  <option value="Mobile Phone">Mobile Phone</option>
                  <option value="Tablet">Tablet</option>
                </select>
              </div>
              <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Table */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Account</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Login Device</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">IP Address</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Login Browser</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : loginHistory.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No login history found
                    </td>
                  </tr>
                ) : (
                  loginHistory.map((login, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-all duration-300">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {login.account}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{login.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{login.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium ${
                          login.device === 'Computer' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}>
                          {login.device}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-600">{login.ipAddress}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium ${
                          login.browser === 'Chrome'
                            ? 'bg-purple-50 text-purple-700 border border-purple-100'
                            : 'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}>
                          {login.browser}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
              <span className="font-medium">{totalItems}</span> results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium ${
                  currentPage === 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-gray-50'
                } transition-colors`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage * itemsPerPage >= totalItems}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  currentPage * itemsPerPage >= totalItems
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white transition-colors`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
    </ProtectedRoute>
  );
}