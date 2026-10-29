import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { appStore, DEMO_USERS } from '../services/store';

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (
    displayName: string,
    email: string,
    pass: string,
    collegeId: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  savedEvents: string[];
  savedSocieties: string[];
  toggleSaveEvent: (eventId: string) => boolean;
  toggleSaveSociety: (societyId: string) => boolean;
  updateProfile: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(appStore.getCurrentUser());
  const [savedEvents, setSavedEvents] = useState<string[]>(appStore.getSavedEventIds());
  const [savedSocieties, setSavedSocieties] = useState<string[]>(appStore.getSavedSocietyIds());

  useEffect(() => {
    const unsub = appStore.subscribe(() => {
      setUser(appStore.getCurrentUser());
      setSavedEvents(appStore.getSavedEventIds());
      setSavedSocieties(appStore.getSavedSocietyIds());
    });
    return unsub;
  }, []);

  const login = async (email: string, _pass: string) => {
    // Check if matches any demo user
    const matched = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      appStore.setCurrentUser(matched);
      return { success: true };
    }
    // Else create / log in as student
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      displayName: email.split('@')[0],
      selectedCollegeId: appStore.getSelectedCollegeId(),
      role: 'student',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    appStore.setCurrentUser(newUser);
    return { success: true };
  };

  const signup = async (
    displayName: string,
    email: string,
    _pass: string,
    collegeId: string
  ) => {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      displayName,
      selectedCollegeId: collegeId || appStore.getSelectedCollegeId(),
      role: 'student',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    appStore.setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    appStore.setCurrentUser(null);
  };

  const switchRole = (role: UserRole) => {
    const demo = DEMO_USERS.find((u) => u.role === role);
    if (demo) {
      appStore.setCurrentUser(demo);
    } else if (user) {
      appStore.setCurrentUser({ ...user, role });
    }
  };

  const toggleSaveEvent = (eventId: string) => {
    return appStore.toggleSaveEvent(eventId);
  };

  const toggleSaveSociety = (societyId: string) => {
    return appStore.toggleSaveSociety(societyId);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    appStore.updateUserProfile(data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        switchRole,
        savedEvents,
        savedSocieties,
        toggleSaveEvent,
        toggleSaveSociety,
        updateProfile,
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
