import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import Login from "@/pages/login";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading, initialized } = useAuth();

  // Check if Firebase is properly configured (check both env and window variables)
  const hasFirebaseConfig = () => {
    // Check import.meta.env (development/build time)
    const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    const envProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
    const envAppId = import.meta.env.VITE_FIREBASE_APP_ID;
    
    if (envApiKey && envApiKey !== 'your_firebase_api_key_here' &&
        envProjectId && envProjectId !== 'your_firebase_project_id_here' &&
        envAppId && envAppId !== 'your_firebase_app_id_here') {
      return true;
    }
    
    // Check window variables (production runtime)
    if (typeof window !== 'undefined') {
      const winApiKey = (window as any).VITE_FIREBASE_API_KEY;
      const winProjectId = (window as any).VITE_FIREBASE_PROJECT_ID;
      const winAppId = (window as any).VITE_FIREBASE_APP_ID;
      
      if (winApiKey && winApiKey !== 'your_firebase_api_key_here' &&
          winProjectId && winProjectId !== 'your_firebase_project_id_here' &&
          winAppId && winAppId !== 'your_firebase_app_id_here') {
        return true;
      }
    }
    
    return false;
  };

  // For development, allow access without Firebase
  if (!hasFirebaseConfig() && import.meta.env.DEV) {
    console.log("Development mode: Firebase not configured, allowing access");
    return <>{children}</>;
  }

  if (!hasFirebaseConfig()) {
    // If Firebase is not configured, show error
    return (
      <div className="min-h-screen bg-[#121214] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-2xl mb-4">Erro de Configuração</h1>
          <p className="text-[#5a5a60]">Firebase não está configurado corretamente.</p>
        </div>
      </div>
    );
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