import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, lozinka: string) => boolean;
  logout: () => void;
  register: (userData: Omit<User, 'id'>) => boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  const login = (email: string, lozinka: string): boolean => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const found = users.find((u) => u.email === email && u.lozinka === lozinka);
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  const register = (userData: Omit<User, 'id'>): boolean => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find((u) => u.email === userData.email)) return false;
    const newUser: User = { ...userData, id: crypto.randomUUID() };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    setUser(newUser);
    return true;
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...userData };
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx !== -1) users[idx] = updated;
    localStorage.setItem('users', JSON.stringify(users));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
