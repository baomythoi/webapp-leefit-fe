import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { accountAPI } from '@/services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  token: string | null;
  email: string | null;
  login: (token: string, email: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and email on mount
    const storedToken = localStorage.getItem('authToken');
    const storedEmail = localStorage.getItem('userEmail');
    
    if (storedToken && storedEmail) {
      setToken(storedToken);
      setEmail(storedEmail);
      setIsAuthenticated(true);
      fetchUserProfile(storedEmail);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (userEmail: string) => {
    try {
      const result = await accountAPI.getUserProfile(userEmail);
      if (result.data) {
        setUser(result.data);
      } else {
        // Fallback to default user for testing
        setUser({
          email: userEmail,
          full_name: "Nguyễn Văn A",
          age: 28,
          height_cm: 175,
          weight_kg: 75
        });
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Use fallback user data for testing
      setUser({
        email: userEmail,
        full_name: "Nguyễn Văn A", 
        age: 28,
        height_cm: 175,
        weight_kg: 75
      });
    } finally {
      setLoading(false);
    }
  };

  const login = (authToken: string, userEmail: string) => {
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('userEmail', userEmail);
    setToken(authToken);
    setEmail(userEmail);
    setIsAuthenticated(true);
    fetchUserProfile(userEmail);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    setToken(null);
    setEmail(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      token,
      email,
      login,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}