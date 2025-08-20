import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User } from "firebase/auth";
import { onAuthStateChange } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  initialized: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  initialized: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // For development mode without Firebase, skip auth
    if (import.meta.env.DEV && !import.meta.env.VITE_FIREBASE_API_KEY) {
      console.log("Development mode: Skipping Firebase auth");
      setUser(null);
      setLoading(false);
      setInitialized(true);
      return;
    }

    // Set up auth state listener
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
      setInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, initialized }}>
      {children}
    </AuthContext.Provider>
  );
};