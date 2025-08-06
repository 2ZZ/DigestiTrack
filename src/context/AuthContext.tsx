import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      // Check if user is stored in localStorage
      const storedUser = localStorage.getItem('digestive_health_user');
      const storedProfile = localStorage.getItem('digestive_health_profile');
      
      if (storedUser && storedProfile) {
        setUser(JSON.parse(storedUser));
        setUserProfile(JSON.parse(storedProfile));
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call - in real implementation, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const mockUser: User = {
        id: generateUserId(),
        email,
        name: email.split('@')[0],
        createdAt: new Date(),
        lastLoginAt: new Date()
      };

      const mockProfile: UserProfile = {
        user: mockUser,
        preferences: {
          notifications: true,
          reminderFrequency: 'daily',
          dataRetention: '1_year',
          shareWithResearch: false
        },
        healthcareProviders: []
      };

      localStorage.setItem('digestive_health_user', JSON.stringify(mockUser));
      localStorage.setItem('digestive_health_profile', JSON.stringify(mockProfile));
      
      setUser(mockUser);
      setUserProfile(mockProfile);
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: generateUserId(),
        email,
        name,
        createdAt: new Date(),
        lastLoginAt: new Date()
      };

      const newProfile: UserProfile = {
        user: newUser,
        preferences: {
          notifications: true,
          reminderFrequency: 'daily',
          dataRetention: '1_year',
          shareWithResearch: false
        },
        healthcareProviders: []
      };

      localStorage.setItem('digestive_health_user', JSON.stringify(newUser));
      localStorage.setItem('digestive_health_profile', JSON.stringify(newProfile));
      
      setUser(newUser);
      setUserProfile(newProfile);
      
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('digestive_health_user');
    localStorage.removeItem('digestive_health_profile');
    localStorage.removeItem('digestive_health_incidents');
    localStorage.removeItem('digestive_health_foods');
    
    setUser(null);
    setUserProfile(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!userProfile) return false;
    
    try {
      const updatedProfile = { ...userProfile, ...updates };
      localStorage.setItem('digestive_health_profile', JSON.stringify(updatedProfile));
      setUserProfile(updatedProfile);
      return true;
    } catch (error) {
      console.error('Profile update failed:', error);
      return false;
    }
  };

  const generateUserId = (): string => {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  };

  const value: AuthContextType = {
    user,
    userProfile,
    isLoading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};