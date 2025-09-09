'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, Settings, Check, X } from 'lucide-react';

const PERMISSIONS = [
  { key: 'manageUsers', label: 'Manage Users' },
  { key: 'manageQuestions', label: 'Manage Questions' },
  { key: 'approveQuestions', label: 'Approve Questions' },
  { key: 'managePapers', label: 'Create/Manage Papers' },
  { key: 'viewAllPapers', label: 'View All Papers' },
  { key: 'viewAnalytics', label: 'View Analytics' },
  { key: 'manageIntegrations', label: 'Manage Integrations' },
  { key: 'manageBilling', label: 'Manage Billing' },
  { key: 'viewAuditLogs', label: 'View Audit Logs' },
];

const DEFAULT = {
  superAdmin: Object.fromEntries(PERMISSIONS.map((p) => [p.key, true])),
  admin: {
    manageUsers: true,
    manageQuestions: true,
    approveQuestions: true,
    managePapers: true,
    viewAllPapers: true,
    viewAnalytics: true,
    manageIntegrations: true,
    manageBilling: false,
    viewAuditLogs: true,
  },
  teacher: {
    manageQuestions: true,
    managePapers: true,
    viewAllPapers: false,
    viewAnalytics: true,
  },
};

// Variants for animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const permissionItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export default function Page() {
  const LOCAL_STORAGE_KEY = 'rolePermissions';

  const [roles, setRoles] = useState(DEFAULT);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRoles(parsed);
      } catch (error) {
        console.warn('Failed to parse stored roles. Using default.', error);
      }
    }
  }, []);

  // Toggle individual permission
  function toggle(role, key) {
    setRoles((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [key]: !prev[role]?.[key],
      },
    }));
  }

  // Save to localStorage
  function handleSave() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(roles));
    alert('Permissions saved locally.'); // Replace with toast/snackbar if needed
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
            Roles & Permissions
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            Fine-grained access control across different user roles.
          </p>
        </div>
      </motion.header>

      {/* Role Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {Object.entries(roles).map(([role, perms]) => (
          <motion.div
            key={role}
            variants={cardVariants}
            className="rounded-2xl border border-gray-200 p-6 bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-xl capitalize text-gray-800 flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-500" />
                {role.replace(/([A-Z])/g, ' $1')}
              </div>
              <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                {Object.values(perms || {}).filter(Boolean).length} / {PERMISSIONS.length}
              </span>
            </div>

            {/* Permissions */}
            <div className="space-y-3">
              {PERMISSIONS.map((p) => (
                <motion.label
                  key={p.key}
                  variants={permissionItemVariants}
                  className="flex items-center justify-between gap-3 text-sm p-2 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-gray-50"
                >
                  <span className="text-gray-700">{p.label}</span>
                  <div
                    className={`relative inline-flex items-center w-10 h-6 rounded-full transition-colors duration-300 ${
                      perms?.[p.key] ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!perms?.[p.key]}
                      onChange={() => toggle(role, p.key)}
                      className="sr-only"
                    />
                    <div
                      className={`absolute w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 transform ${
                        perms?.[p.key] ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    >
                      <div className="flex items-center justify-center w-full h-full">
                        {perms?.[p.key] ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <X className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.label>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex justify-end"
      >
        <button
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200 transform hover:-translate-y-0.5 shadow-lg"
        >
          <Settings className="w-5 h-5" /> Save Changes
        </button>
      </motion.div>
    </div>
  );
}
