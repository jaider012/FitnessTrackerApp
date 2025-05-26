import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, View } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  ButtonText,
} from '../../../components/ui/';
import { useWorkoutStore } from '../../store/workoutStore';
import { useTimerStore } from '../../store/timerStore';
import { useAuthStore } from '../../store/authStore';
import { RestTimer } from '../../components/RestTimer';
import { ExerciseInput } from '../../components/ui/ExerciseInput';
import { RootStackParamList } from '../../types';
import { theme } from '../../constants/theme';
import { format, parseISO, differenceInSeconds } from 'date-fns';
import uuid from 'react-native-uuid';

type WorkoutDetailRouteProp = RouteProp<RootStackParamList, 'WorkoutDetail'>;

export const WorkoutDetailScreen = () => {
  const route = useRoute<WorkoutDetailRouteProp>();
  const navigation = useNavigation();
  const { workoutId } = route.params;
  const { workouts, updateWorkout } = useWorkoutStore();
  const { startTimer } = useTimerStore();
  const { user } = useAuthStore();
  
  const workout = workouts.find(w => w.id === workoutId);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Start workout timer
  useEffect(() => {
    if (workout && !workout.completed && !startTime) {
      setStartTime(new Date());
    }
  }, [workout]);

  // Update elapsed time
  useEffect(() => {
    if (startTime && !workout?.completed) {
      const interval = setInterval(() => {
        setElapsedTime(differenceInSeconds(new Date(), startTime));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, workout?.completed]);

  if (!workout) {
    return (
      <Box className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl">Entrenamiento no encontrado</Text>
      </Box>
    );
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUpdateSet = (exerciseId: string, setId: string, updates: any) => {
    const updatedExercises = workout.exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          sets: exercise.sets.map(set => {
            if (set.id === setId) {
              return { ...set, ...updates };
            }
            return set;
          })
        };
      }
      return exercise;
    });

    updateWorkout(workoutId, { exercises: updatedExercises });
  };

  const handleAddSet = (exerciseId: string) => {
    const exercise = workout.exercises.find(e => e.id === exerciseId);
    if (!exercise) return;

    const lastSet = exercise.sets[exercise.sets.length - 1];
    const newSet = {
      id: uuid.v4() as string,
      reps: lastSet?.reps || 0,
      weight: lastSet?.weight || 0,
      completed: false,
    };

    const updatedExercises = workout.exercises.map(ex => {
      if (ex.id === exerciseId) {
        return { ...ex, sets: [...ex.sets, newSet] };
      }
      return ex;
    });

    updateWorkout(workoutId, { exercises: updatedExercises });
  };

  const handleRemoveSet = (exerciseId: string, setId: string) => {
    const updatedExercises = workout.exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          sets: exercise.sets.filter(set => set.id !== setId)
        };
      }
      return exercise;
    });

    updateWorkout(workoutId, { exercises: updatedExercises });
  };

  const handleStartTimer = () => {
    if (user?.preferences.restTimerDuration) {
      startTimer(user.preferences.restTimerDuration);
    }
  };

  const handleFinishWorkout = () => {
    updateWorkout(workoutId, { 
      completed: true,
      duration: elapsedTime
    });
    navigation.goBack();
  };

  const handleAddExercise = () => {
    // TODO: Navigate to exercise selection screen
    console.log('Add exercise');
  };

  const totalVolume = workout.exercises.reduce((sum, exercise) => {
    return sum + exercise.sets.reduce((setSum, set) => {
      return setSum + (set.completed ? set.weight * set.reps : 0);
    }, 0);
  }, 0);

  const completedSets = workout.exercises.reduce((sum, exercise) => {
    return sum + exercise.sets.filter(set => set.completed).length;
  }, 0);

  const totalSets = workout.exercises.reduce((sum, exercise) => {
    return sum + exercise.sets.length;
  }, 0);

  return (
    <Box className="flex-1 bg-gray-50">
      {/* Header */}
      <Box className="bg-white border-b border-gray-200 px-4 py-3">
        <VStack className="gap-2">
          <HStack className="justify-between items-center">
            <VStack>
              <Text className="text-xl font-bold text-gray-900">
                {workout.name}
              </Text>
              <Text className="text-sm text-gray-500">
                {format(parseISO(workout.date), 'EEEE, d MMMM')}
              </Text>
            </VStack>
            <VStack className="items-end">
              <Text className="text-2xl font-bold text-blue-600">
                {formatDuration(workout.completed ? workout.duration : elapsedTime)}
              </Text>
              <Text className="text-xs text-gray-500">Duración</Text>
            </VStack>
          </HStack>

          {/* Quick Stats */}
          <HStack className="gap-4 mt-2">
            <VStack>
              <Text className="text-lg font-semibold">{completedSets}/{totalSets}</Text>
              <Text className="text-xs text-gray-500">Series</Text>
            </VStack>
            <View className="w-px bg-gray-200" />
            <VStack>
              <Text className="text-lg font-semibold">{(totalVolume / 1000).toFixed(1)}k</Text>
              <Text className="text-xs text-gray-500">kg Total</Text>
            </VStack>
          </HStack>
        </VStack>
      </Box>

      <ScrollView className="flex-1">
        <VStack className="p-4 gap-4">
          {/* Exercises */}
          {workout.exercises.map((exercise) => (
            <ExerciseInput
              key={exercise.id}
              exerciseName={exercise.name}
              sets={exercise.sets}
              onUpdateSet={(setId, updates) => handleUpdateSet(exercise.id, setId, updates)}
              onAddSet={() => handleAddSet(exercise.id)}
              onRemoveSet={(setId) => handleRemoveSet(exercise.id, setId)}
              onStartTimer={handleStartTimer}
            />
          ))}

          {/* Add Exercise Button */}
          <Pressable
            onPress={handleAddExercise}
            className="bg-white rounded-xl p-4 border-2 border-dashed border-gray-300"
          >
            <HStack className="items-center justify-center gap-2">
              <Text className="text-2xl text-gray-400">+</Text>
              <Text className="text-gray-600 font-medium">
                Añadir Ejercicio
              </Text>
            </HStack>
          </Pressable>

          {/* Notes Section */}
          <Box className="bg-white rounded-xl p-4" style={theme.shadows.sm}>
            <VStack className="gap-3">
              <Text className="font-semibold text-gray-900">Notas del Entrenamiento</Text>
              <Pressable className="bg-gray-50 rounded-lg p-3">
                <Text className="text-gray-500">
                  {workout.notes || 'Toca para añadir notas...'}
                </Text>
              </Pressable>
            </VStack>
          </Box>

          {/* Finish Workout Button */}
          {!workout.completed && (
            <Button
              onPress={handleFinishWorkout}
              className="mt-6 mb-8"
              size="lg"
            >
              <ButtonText>Finalizar Entrenamiento</ButtonText>
            </Button>
          )}
        </VStack>
      </ScrollView>

      <RestTimer />
    </Box>
  );
}; 