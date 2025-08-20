import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import Login from "@/pages/login";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading, initialized } = useAuth();

  // For local development, bypass authentication
  const isLocalDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';
  
  if (isLocalDevelopment) {
    return <>{children}</>;
  }

  // In production, check if Firebase is properly configured
  const hasFirebaseConfig = import.meta.env.VITE_FIREBASE_API_KEY && 
    import.meta.env.VITE_FIREBASE_API_KEY !== 'your_firebase_api_key_here';

  if (!hasFirebaseConfig) {
    // If Firebase is not configured, allow access (fallback for development)
    return <>{children}</>;
  }

  // Show loading spinner while checking auth state
  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-[#121214] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-[#5a5a60]">Carregando...</p>
        </div>
      </div>
    );
  }

  // Show login page if user is not authenticated
  if (!user) {
    return <Login />;
  }

  // Show protected content if user is authenticated
  return <>{children}</>;
}