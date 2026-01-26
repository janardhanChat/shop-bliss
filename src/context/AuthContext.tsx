import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'minimal_users';
const CURRENT_USER_KEY = 'minimal_current_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const getUsers = (): Record<string, { user: User; password: string }> => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
  };

  const saveUsers = (users: Record<string, { user: User; password: string }>) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const users = getUsers();
    const userRecord = users[email.toLowerCase()];

    if (!userRecord) {
      return { success: false, error: 'No account found with this email' };
    }

    if (userRecord.password !== password) {
      return { success: false, error: 'Incorrect password' };
    }

    setUser(userRecord.user);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userRecord.user));
    return { success: true };
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    const users = getUsers();
    const emailLower = email.toLowerCase();

    if (users[emailLower]) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email: emailLower,
      name,
      createdAt: new Date().toISOString(),
    };

    users[emailLower] = { user: newUser, password };
    saveUsers(users);

    setUser(newUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
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
