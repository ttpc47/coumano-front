import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (matricule: string, password: string) => Promise<boolean>;
  logout: () => void;
  updatePassword: (newPassword: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user data
const mockUsers: User[] = [
  {
    id: '1',
    matricule: 'ADM001',
    firstName: 'Marie',
    lastName: 'Ngozi',
    email: 'admin@university.cm',
    role: 'admin',
    isFirstLogin: false,
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    matricule: 'LEC001',
    firstName: 'Dr. Paul',
    lastName: 'Mbarga',
    email: 'p.mbarga@university.cm',
    role: 'lecturer',
    department: 'Computer Science',
    isFirstLogin: false,
    createdAt: '2024-02-01T00:00:00Z',
  },
  {
    id: '3',
    matricule: 'STU2024001',
    firstName: 'Aminata',
    lastName: 'Fouda',
    email: 'a.fouda@student.university.cm',
    role: 'student',
    department: 'Computer Science',
    specialty: 'Software Engineering',
    isFirstLogin: true,
    createdAt: '2024-03-01T00:00:00Z',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('coumano_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (matricule: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.matricule === matricule);
    if (foundUser && (password === 'password123' || password === 'newpassword')) {
      setUser(foundUser);
      localStorage.setItem('coumano_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('coumano_user');
  };

  const updatePassword = async (newPassword: string): Promise<boolean> => {
    if (user) {
      const updatedUser = { ...user, isFirstLogin: false };
      setUser(updatedUser);
      localStorage.setItem('coumano_user', JSON.stringify(updatedUser));
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updatePassword, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};