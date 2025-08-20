import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import Login from "@/pages/login";

interface DevAuthGuardProps {
  children: ReactNode;
}

export default function DevAuthGuard({ children }: DevAuthGuardProps) {
  const { user, loading, initialized } = useAuth();

  // Development mode - skip Firebase auth
  if (import.meta.env.DEV) {
    console.log("🔧 Development mode: Bypassing authentication");
    return <>{children}</>;
  }

  // Show loading spinner while checking auth state
  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-[#121214] flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
          </div>
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
