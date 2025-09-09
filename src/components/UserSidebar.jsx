import React from 'react';

export function UserSidebar({ user }) {
  const getAccessLevel = (packageType) => {
    switch (packageType) {
      case 'pro':
        return { text: 'Limited Access', color: 'text-amber-600' };
      case 'business':
      case 'exceptional':
        return { text: 'Full Access', color: 'text-green-600' };
      default:
        return { text: 'Basic Access', color: 'text-gray-600' };
    }
  };

  const access = getAccessLevel(user?.package);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-bold text-lg">{user?.name?.charAt(0)}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{user?.name}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
        
        <div className="space-y-2 pt-3 border-t">
          <div>
            <label className="text-xs text-gray-500">School</label>
            <p className="font-medium text-gray-800">{user?.schoolName || 'N/A'}</p>
          </div>
          
          <div>
            <label className="text-xs text-gray-500">Package</label>
            <p className="font-medium text-gray-800">{user?.package || 'Basic'}</p>
          </div>
          
          <div>
            <label className="text-xs text-gray-500">Access Level</label>
            <p className={`font-medium ${access.color}`}>{access.text}</p>
          </div>
          
          <div>
            <label className="text-xs text-gray-500">Expiry Date</label>
            <p className="font-medium text-gray-800">
              {user?.expiryDate || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}