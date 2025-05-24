import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Exercise {
  id: string;
  name: string;
  sets: Array<{
    id: string;
    reps: number;
    weight: number;
    completed: boolean;
  }>;
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  date: string; // ISO string
  exercises: Exercise[];
  duration: number; // in seconds
  completed: boolean;
  notes?: string;
}

interface WorkoutState {
  workouts: Workout[];
  currentWorkout: Workout | null;
  workoutStartTime: number | null;
  addWorkout: (workout: Workout) => void;
  updateWorkout: (id: string, workout: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  startWorkout: (workout: Workout) => void;
  endWorkout: () => void;
  updateCurrentWorkout: (updates: Partial<Workout>) => void;
  addExerciseToCurrentWorkout: (exercise: Exercise) => void;
  updateExerciseInCurrentWorkout: (exerciseId: string, updates: Partial<Exercise>) => void;
  removeExerciseFromCurrentWorkout: (exerciseId: string) => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set) => ({
      workouts: [],
      currentWorkout: null,
      workoutStartTime: null,
      
      addWorkout: (workout) =>
        set((state) => ({
          workouts: [...state.workouts, workout],
        })),
        
      updateWorkout: (id, updates) =>
        set((state) => ({
          workouts: state.workouts.map((workout) =>
            workout.id === id ? { ...workout, ...updates } : workout
          ),
        })),
        
      deleteWorkout: (id) =>
        set((state) => ({
          workouts: state.workouts.filter((workout) => workout.id !== id),
        })),
        
      startWorkout: (workout) =>
        set({
          currentWorkout: workout,
          workoutStartTime: Date.now(),
        }),
        
      endWorkout: () =>
        set((state) => {
          if (!state.currentWorkout || !state.workoutStartTime) return state;
          
          const duration = Math.floor((Date.now() - state.workoutStartTime) / 1000);
          const completedWorkout = {
            ...state.currentWorkout,
            duration,
            completed: true,
          };
          
          return {
            workouts: [...state.workouts, completedWorkout],
            currentWorkout: null,
            workoutStartTime: null,
          };
        }),
        
      updateCurrentWorkout: (updates) =>
        set((state) => ({
          currentWorkout: state.currentWorkout
            ? { ...state.currentWorkout, ...updates }
            : null,
        })),
        
      addExerciseToCurrentWorkout: (exercise) =>
        set((state) => ({
          currentWorkout: state.currentWorkout
            ? {
                ...state.currentWorkout,
                exercises: [...state.currentWorkout.exercises, exercise],
              }
            : null,
        })),
        
      updateExerciseInCurrentWorkout: (exerciseId, updates) =>
        set((state) => ({
          currentWorkout: state.currentWorkout
            ? {
                ...state.currentWorkout,
                exercises: state.currentWorkout.exercises.map((exercise) =>
                  exercise.id === exerciseId
                    ? { ...exercise, ...updates }
                    : exercise
                ),
              }
            : null,
        })),
        
      removeExerciseFromCurrentWorkout: (exerciseId) =>
        set((state) => ({
          currentWorkout: state.currentWorkout
            ? {
                ...state.currentWorkout,
                exercises: state.currentWorkout.exercises.filter(
                  (exercise) => exercise.id !== exerciseId
                ),
              }
            : null,
        })),
    }),
    {
      name: 'workout-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        workouts: state.workouts,
      }),
    }
  )
); 