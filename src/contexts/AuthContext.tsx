import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  userEmail: string | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const authStatus = localStorage.getItem('isAuthenticated');
    const role = localStorage.getItem('userRole');
    const email = localStorage.getItem('userEmail');
    
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      setUserRole(role);
      setUserEmail(email);
    }
  }, []);

  const login = () => {
    const role = localStorage.getItem('userRole');
    const email = localStorage.getItem('userEmail');
    setIsAuthenticated(true);
    setUserRole(role);
    setUserEmail(email);
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUserRole(null);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      userRole,
      userEmail,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};