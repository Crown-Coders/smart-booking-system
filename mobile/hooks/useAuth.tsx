import React, { createContext, useContext, useState, ReactNode } from 'react';


// User type
type UserType = {
  email: string;
  role: 'CLIENT' | 'ADMIN' | 'THERAPIST';
};

// Context type
type AuthContextType = {
  user: UserType | null;
  login: (user: UserType) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);

  const login = (userData: UserType) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}