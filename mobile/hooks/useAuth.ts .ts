// hooks/useAuth.ts
import React, { createContext, useContext, useState, ReactNode } from 'react';

// ---------------------------
// 1. Define User Type
// ---------------------------
export type UserType = {
  email: string;
  role: 'admin' | 'user' | 'client' | 'therapist'; // extend roles if needed
};

// ---------------------------
// 2. Define Auth Context Type
// ---------------------------
export type AuthContextType = {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  login: (userData: UserType) => void;
  logout: () => void;
};

// ---------------------------
// 3. Default context value
// ---------------------------
const defaultAuth: AuthContextType = {
  user: null,
  setUser: () => {},
  login: () => {},
  logout: () => {},
};

// ---------------------------
// 4. Create Context
// ---------------------------
const AuthContext = createContext<AuthContextType>(defaultAuth);

// ---------------------------
// 5. AuthProvider component
// ---------------------------
type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserType | null>(null);

  // Login function
  const login = (userData: UserType) => {
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ---------------------------
// 6. Custom hook
// ---------------------------
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};