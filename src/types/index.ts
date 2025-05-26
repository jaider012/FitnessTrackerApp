// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  units: 'metric' | 'imperial';
  notifications: {
    workoutReminders: boolean;
    restTimerAlerts: boolean;
    progressUpdates: boolean;
  };
  restTimerDuration: number; // in seconds
  theme: 'light' | 'dark' | 'system';
}

// Exercise and Workout Types
export interface ExerciseSet {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
  restTime?: number; // in seconds
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  muscleGroups: MuscleGroup[];
  sets: ExerciseSet[];
  notes?: string;
  personalRecord?: {
    weight: number;
    reps: number;
    date: string;
  };
}

export interface Workout {
  id: string;
  name: string;
  date: string; // ISO string
  exercises: Exercise[];
  duration: number; // in seconds
  completed: boolean;
  notes?: string;
  templateId?: string; // if created from a template
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: Omit<Exercise, 'sets'>[];
  createdAt: string;
  lastUsed?: string;
}

// Exercise Categories and Muscle Groups
export type ExerciseCategory = 
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'arms'
  | 'legs'
  | 'core'
  | 'cardio'
  | 'full-body';

export type MuscleGroup = 
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'quadriceps'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'abs'
  | 'obliques';

// Progress and Statistics Types
export interface WorkoutStats {
  totalWorkouts: number;
  totalDuration: number; // in seconds
  totalVolume: number; // total weight lifted
  averageWorkoutDuration: number;
  workoutsThisWeek: number;
  workoutsThisMonth: number;
  currentStreak: number;
  longestStreak: number;
}

export interface ExerciseProgress {
  exerciseName: string;
  data: Array<{
    date: string;
    maxWeight: number;
    totalVolume: number;
    totalReps: number;
  }>;
}

export interface ProgressData {
  workoutFrequency: Array<{
    date: string;
    count: number;
  }>;
  volumeProgress: Array<{
    date: string;
    volume: number;
  }>;
  exerciseProgress: ExerciseProgress[];
}

// Timer Types
export interface RestTimer {
  isActive: boolean;
  duration: number; // in seconds
  remaining: number; // in seconds
  exerciseId?: string;
  setId?: string;
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  WorkoutDetail: { workoutId: string };
  CreateWorkout: undefined;
  ActiveWorkout: { workoutId?: string; templateId?: string };
  ExerciseDetail: { exerciseId: string };
  ProgressDetail: { exerciseName: string };
  Settings: undefined;
  EditProfile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Workouts: undefined;
  Exercises: undefined;
  Progress: undefined;
  Profile: undefined;
};

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordForm {
  email: string;
}

export interface CreateWorkoutForm {
  name: string;
  exercises: string[];
}

export interface ExerciseForm {
  name: string;
  category: ExerciseCategory;
  muscleGroups: MuscleGroup[];
} 