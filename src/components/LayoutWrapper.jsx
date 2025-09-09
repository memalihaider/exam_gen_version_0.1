"use client";

import Sidebar from './Sidebar';
import { useUser } from "@/contexts/UserContext";
import { usePathname } from 'next/navigation';

export default function LayoutWrapper({ children }) {
  const { user, loading } = useUser();
  const pathname = usePathname();

  const publicRoutes = ['/login/', '/saas-package/', '/payment/basic/', '/'];
  const isPublicRoute = publicRoutes.some(route => pathname === route);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Don't show sidebar for public routes or when user is not authenticated
  if (isPublicRoute || !user) {
    return children;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 bg-gray-50">{children}</main>
    </div>
  );
}