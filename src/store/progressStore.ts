import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutStats, ProgressData, ExerciseProgress } from '../types';
import { Workout } from './workoutStore';
import { startOfWeek, startOfMonth, isAfter, isSameDay, parseISO, format } from 'date-fns';

interface ProgressState {
  stats: WorkoutStats;
  progressData: ProgressData;
  calculateStats: (workouts: Workout[]) => void;
  calculateProgressData: (workouts: Workout[]) => void;
  getExerciseProgress: (exerciseName: string) => ExerciseProgress | null;
  getWorkoutStreak: (workouts: Workout[]) => number;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      stats: {
        totalWorkouts: 0,
        totalDuration: 0,
        totalVolume: 0,
        averageWorkoutDuration: 0,
        workoutsThisWeek: 0,
        workoutsThisMonth: 0,
        currentStreak: 0,
        longestStreak: 0,
      },
      progressData: {
        workoutFrequency: [],
        volumeProgress: [],
        exerciseProgress: [],
      },

      calculateStats: (workouts: Workout[]) => {
        const completedWorkouts = workouts.filter(w => w.completed);
        const now = new Date();
        const weekStart = startOfWeek(now);
        const monthStart = startOfMonth(now);

        const totalWorkouts = completedWorkouts.length;
        const totalDuration = completedWorkouts.reduce((sum, w) => sum + w.duration, 0);
        const totalVolume = completedWorkouts.reduce((sum, workout) => {
          return sum + workout.exercises.reduce((exerciseSum, exercise) => {
            return exerciseSum + exercise.sets.reduce((setSum, set) => {
              return setSum + (set.completed ? set.weight * set.reps : 0);
            }, 0);
          }, 0);
        }, 0);

        const workoutsThisWeek = completedWorkouts.filter(w => 
          isAfter(parseISO(w.date), weekStart)
        ).length;

        const workoutsThisMonth = completedWorkouts.filter(w => 
          isAfter(parseISO(w.date), monthStart)
        ).length;

        const currentStreak = get().getWorkoutStreak(completedWorkouts);
        
        // Calculate longest streak (simplified)
        const longestStreak = Math.max(currentStreak, get().stats.longestStreak);

        set({
          stats: {
            totalWorkouts,
            totalDuration,
            totalVolume,
            averageWorkoutDuration: totalWorkouts > 0 ? totalDuration / totalWorkouts : 0,
            workoutsThisWeek,
            workoutsThisMonth,
            currentStreak,
            longestStreak,
          }
        });
      },

      calculateProgressData: (workouts: Workout[]) => {
        const completedWorkouts = workouts.filter(w => w.completed);
        
        // Calculate workout frequency (last 30 days)
        const last30Days = Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return format(date, 'yyyy-MM-dd');
        }).reverse();

        const workoutFrequency = last30Days.map(date => ({
          date,
          count: completedWorkouts.filter(w => 
            format(parseISO(w.date), 'yyyy-MM-dd') === date
          ).length,
        }));

        // Calculate volume progress (weekly)
        const last12Weeks = Array.from({ length: 12 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (i * 7));
          return startOfWeek(date);
        }).reverse();

        const volumeProgress = last12Weeks.map(weekStart => {
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);
          
          const weekWorkouts = completedWorkouts.filter(w => {
            const workoutDate = parseISO(w.date);
            return workoutDate >= weekStart && workoutDate <= weekEnd;
          });

          const volume = weekWorkouts.reduce((sum, workout) => {
            return sum + workout.exercises.reduce((exerciseSum, exercise) => {
              return exerciseSum + exercise.sets.reduce((setSum, set) => {
                return setSum + (set.completed ? set.weight * set.reps : 0);
              }, 0);
            }, 0);
          }, 0);

          return {
            date: format(weekStart, 'yyyy-MM-dd'),
            volume,
          };
        });

        // Calculate exercise progress
        const exerciseMap = new Map<string, Array<{
          date: string;
          maxWeight: number;
          totalVolume: number;
          totalReps: number;
        }>>();

        completedWorkouts.forEach(workout => {
          workout.exercises.forEach(exercise => {
            if (!exerciseMap.has(exercise.name)) {
              exerciseMap.set(exercise.name, []);
            }

            const completedSets = exercise.sets.filter(set => set.completed);
            if (completedSets.length > 0) {
              const maxWeight = Math.max(...completedSets.map(set => set.weight));
              const totalVolume = completedSets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
              const totalReps = completedSets.reduce((sum, set) => sum + set.reps, 0);

              exerciseMap.get(exercise.name)!.push({
                date: workout.date,
                maxWeight,
                totalVolume,
                totalReps,
              });
            }
          });
        });

        const exerciseProgress: ExerciseProgress[] = Array.from(exerciseMap.entries()).map(([name, data]) => ({
          exerciseName: name,
          data: data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        }));

        set({
          progressData: {
            workoutFrequency,
            volumeProgress,
            exerciseProgress,
          }
        });
      },

      getExerciseProgress: (exerciseName: string) => {
        return get().progressData.exerciseProgress.find(ep => ep.exerciseName === exerciseName) || null;
      },

      getWorkoutStreak: (workouts: Workout[]) => {
        const completedWorkouts = workouts
          .filter(w => w.completed)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (completedWorkouts.length === 0) return 0;

        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        for (const workout of completedWorkouts) {
          const workoutDate = new Date(workout.date);
          workoutDate.setHours(0, 0, 0, 0);

          if (isSameDay(workoutDate, currentDate)) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
          } else if (workoutDate < currentDate) {
            // Gap in workouts, streak is broken
            break;
          }
        }

        return streak;
      },
    }),
    {
      name: 'progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 