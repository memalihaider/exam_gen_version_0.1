"use client";

import { usePathname } from 'next/navigation';
import LayoutWrapper from "./LayoutWrapper";
import { useUser } from "@/contexts/UserContext";

export default function RootLayoutContent({ children }) {
  const pathname = usePathname();
  const { user } = useUser();

  // Define public routes where sidebar should not appear
  const publicRoutes = ['/login', '/saas-package', '/payment/basic', '/'];
  const isPublicRoute = publicRoutes.some(route => pathname === route);

  // If it's a public route, render without layout
  if (isPublicRoute) {
    return children;
  }

  // For all other routes, use the LayoutWrapper
  return <LayoutWrapper>{children}</LayoutWrapper>;
}