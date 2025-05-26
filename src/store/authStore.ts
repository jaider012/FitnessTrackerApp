import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserPreferences } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  forgotPassword: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock user creation
          const user: User = {
            id: '1',
            email,
            name: email.split('@')[0],
            createdAt: new Date().toISOString(),
            preferences: {
              units: 'metric',
              notifications: {
                workoutReminders: true,
                restTimerAlerts: true,
                progressUpdates: true,
              },
              restTimerDuration: 90,
              theme: 'system',
            },
          };
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user: User = {
            id: Date.now().toString(),
            email,
            name,
            createdAt: new Date().toISOString(),
            preferences: {
              units: 'metric',
              notifications: {
                workoutReminders: true,
                restTimerAlerts: true,
                progressUpdates: true,
              },
              restTimerDuration: 90,
              theme: 'system',
            },
          };
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      logout: () => set({ user: null, isAuthenticated: false }),
      
      updateProfile: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
      
      updatePreferences: (preferences: Partial<UserPreferences>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ 
            user: { 
              ...currentUser, 
              preferences: { ...currentUser.preferences, ...preferences } 
            } 
          });
        }
      },
      
      forgotPassword: async (email: string) => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 