import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, CurrencyCode, TravelStyle } from '../types';
import { db } from '../services/db';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, password?: string) => Promise<boolean>;
  loginAsJudgeDemo: () => void;
  loginAsAdmin: () => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  toggleBookmark: (cityId: string) => boolean;
  resetDemoData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { success, info } = useToast();

  const loadUser = useCallback(() => {
    const activeId = db.getActiveUserId();
    const existing = db.getUserById(activeId) || db.getUsers()[0] || null;
    setUser(existing);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string): Promise<boolean> => {
    const users = db.getUsers();
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      db.setActiveUserId(matched.id);
      setUser(matched);
      success(`Welcome back, ${matched.name}!`, 'Logged into GlobeTrotter successfully.');
      return true;
    }
    // Auto register demo user if not found
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' '),
      email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      bio: 'Travel enthusiast exploring the globe.',
      preferredCurrency: 'INR',
      travelStyle: 'Balanced',
      role: 'user',
      savedDestinationIds: ['city-paris', 'city-tokyo'],
    };
    const currentUsers = db.getUsers();
    currentUsers.push(newUser);
    localStorage.setItem('globetrotter_users_v1', JSON.stringify(currentUsers));
    db.setActiveUserId(newUser.id);
    setUser(newUser);
    success(`Account created! Welcome, ${newUser.name}.`, 'Your personalized travel workspace is ready.');
    return true;
  };

  const signup = async (name: string, email: string): Promise<boolean> => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
      bio: 'Ready to design my next journey.',
      preferredCurrency: 'INR',
      travelStyle: 'Balanced',
      role: 'user',
      savedDestinationIds: [],
    };
    const currentUsers = db.getUsers();
    currentUsers.push(newUser);
    localStorage.setItem('globetrotter_users_v1', JSON.stringify(currentUsers));
    db.setActiveUserId(newUser.id);
    setUser(newUser);
    success(`Welcome to GlobeTrotter, ${name}!`, 'Your account has been created.');
    return true;
  };

  const loginAsJudgeDemo = () => {
    db.setActiveUserId('user-demo');
    const demoUser = db.getUserById('user-demo') || db.getUsers()[0];
    setUser(demoUser);
    success('Logged in as Hackathon Demo Judge', 'Pre-seeded trips (European Summer, Rajasthan) are loaded.');
  };

  const loginAsAdmin = () => {
    db.setActiveUserId('user-admin');
    const adminUser = db.getUserById('user-admin') || db.getUsers()[1];
    setUser(adminUser);
    info('Logged in as Platform Administrator', 'Admin Analytics unlocked.');
  };

  const logout = () => {
    setUser(null);
    info('Logged out', 'See you on your next adventure!');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updated = db.updateUser(user.id, updates);
    if (updated) {
      setUser(updated);
      success('Profile updated', 'Your preferences have been saved.');
    }
  };

  const toggleBookmark = (cityId: string): boolean => {
    if (!user) return false;
    const isSaved = db.toggleSavedDestination(user.id, cityId);
    setUser(prev => {
      if (!prev) return null;
      const current = prev.savedDestinationIds || [];
      const newSaved = isSaved ? [...current, cityId] : current.filter(id => id !== cityId);
      return { ...prev, savedDestinationIds: newSaved };
    });
    if (isSaved) {
      success('Saved to Bucket List!', 'Destination added to your favorites.');
    } else {
      info('Removed from Bucket List', 'Destination removed from favorites.');
    }
    return isSaved;
  };

  const resetDemoData = () => {
    db.resetToSeedData();
    loadUser();
    success('Demo state reset', 'All sample trips and cities restored to fresh seed state.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        signup,
        loginAsJudgeDemo,
        loginAsAdmin,
        logout,
        updateProfile,
        toggleBookmark,
        resetDemoData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
