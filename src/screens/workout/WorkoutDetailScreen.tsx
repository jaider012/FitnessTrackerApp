import React, { useState } from 'react';
import { ScrollView, Pressable } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  ButtonText,
  Input,
  InputField,
  Card,
} from '../../../components/ui/';
import { useWorkoutStore } from '../../store/workoutStore';
import { useTimerStore } from '../../store/timerStore';
import { useAuthStore } from '../../store/authStore';
import { RestTimer } from '../../components/RestTimer';
import { RootStackParamList } from '../../types';
import { format, parseISO } from 'date-fns';
import uuid from 'react-native-uuid';

type WorkoutDetailRouteProp = RouteProp<RootStackParamList, 'WorkoutDetail'>;

export const WorkoutDetailScreen = () => {
  const route = useRoute<WorkoutDetailRouteProp>();
  const { workoutId } = route.params;
  const { workouts, updateWorkout } = useWorkoutStore();
  const { startTimer } = useTimerStore();
  const { user } = useAuthStore();
  
  const workout = workouts.find(w => w.id === workoutId);
  const [editingSet, setEditingSet] = useState<{ exerciseId: string; setId: string } | null>(null);
  const [tempValues, setTempValues] = useState({ reps: '', weight: '' });

  if (!workout) {
    return (
      <Box className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl">Entrenamiento no encontrado</Text>
      </Box>
    );
  }

  const handleSetComplete = (exerciseId: string, setId: string) => {
    const updatedExercises = workout.exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          sets: exercise.sets.map(set => {
            if (set.id === setId) {
              return { ...set, completed: !set.completed };
            }
            return set;
          })
        };
      }
      return exercise;
    });

    updateWorkout(workoutId, { exercises: updatedExercises });

    // Start rest timer if set was completed
    const set = workout.exercises
      .find(e => e.id === exerciseId)?.sets
      .find(s => s.id === setId);
    
    if (set && !set.completed && user?.preferences.restTimerDuration) {
      startTimer(user.preferences.restTimerDuration, exerciseId, setId);
    }
  };

  const handleEditSet = (exerciseId: string, setId: string) => {
    const exercise = workout.exercises.find(e => e.id === exerciseId);
    const set = exercise?.sets.find(s => s.id === setId);
    
    if (set) {
      setTempValues({ reps: set.reps.toString(), weight: set.weight.toString() });
      setEditingSet({ exerciseId, setId });
    }
  };

  const handleSaveSet = () => {
    if (!editingSet) return;

    const updatedExercises = workout.exercises.map(exercise => {
      if (exercise.id === editingSet.exerciseId) {
        return {
          ...exercise,
          sets: exercise.sets.map(set => {
            if (set.id === editingSet.setId) {
              return {
                ...set,
                reps: parseInt(tempValues.reps) || 0,
                weight: parseFloat(tempValues.weight) || 0,
              };
            }
            return set;
          })
        };
      }
      return exercise;
    });

    updateWorkout(workoutId, { exercises: updatedExercises });
    setEditingSet(null);
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

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <Box className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <VStack className="p-4 gap-6">
          {/* Workout Header */}
          <Card className="p-4">
            <VStack className="gap-2">
              <Text className="text-2xl font-bold">{workout.name}</Text>
              <HStack className="justify-between">
                <Text className="text-gray-600">
                  {format(parseISO(workout.date), 'dd/MM/yyyy')}
                </Text>
                <Text className="text-gray-600">
                  {formatDuration(workout.duration)}
                </Text>
              </HStack>
              {workout.completed && (
                <Text className="text-green-600 font-medium">✓ Completado</Text>
              )}
            </VStack>
          </Card>

          {/* Exercises */}
          {workout.exercises.map((exercise) => (
            <Card key={exercise.id} className="p-4">
              <VStack className="gap-4">
                <HStack className="justify-between items-center">
                  <Text className="text-lg font-semibold">{exercise.name}</Text>
                  <Button size="sm" onPress={() => handleAddSet(exercise.id)}>
                    <ButtonText>+ Serie</ButtonText>
                  </Button>
                </HStack>

                {/* Sets */}
                <VStack className="gap-2">
                  {exercise.sets.map((set, index) => (
                    <HStack key={set.id} className="items-center gap-3 p-2 bg-gray-50 rounded">
                      <Text className="w-8 text-center font-medium">{index + 1}</Text>
                      
                      {editingSet?.setId === set.id ? (
                        <>
                          <Input className="flex-1" size="sm">
                            <InputField
                              placeholder="Reps"
                              value={tempValues.reps}
                              onChangeText={(text) => setTempValues(prev => ({ ...prev, reps: text }))}
                              keyboardType="numeric"
                            />
                          </Input>
                          <Input className="flex-1" size="sm">
                            <InputField
                              placeholder="Peso"
                              value={tempValues.weight}
                              onChangeText={(text) => setTempValues(prev => ({ ...prev, weight: text }))}
                              keyboardType="numeric"
                            />
                          </Input>
                          <Button size="sm" onPress={handleSaveSet}>
                            <ButtonText>✓</ButtonText>
                          </Button>
                        </>
                      ) : (
                        <>
                          <Pressable 
                            className="flex-1"
                            onPress={() => handleEditSet(exercise.id, set.id)}
                          >
                            <Text className="text-center">{set.reps} reps</Text>
                          </Pressable>
                          <Pressable 
                            className="flex-1"
                            onPress={() => handleEditSet(exercise.id, set.id)}
                          >
                            <Text className="text-center">{set.weight} kg</Text>
                          </Pressable>
                          <Pressable
                            onPress={() => handleSetComplete(exercise.id, set.id)}
                            className={`w-8 h-8 rounded-full border-2 items-center justify-center ${
                              set.completed 
                                ? 'bg-green-500 border-green-500' 
                                : 'border-gray-300'
                            }`}
                          >
                            {set.completed && (
                              <Text className="text-white text-xs">✓</Text>
                            )}
                          </Pressable>
                        </>
                      )}
                    </HStack>
                  ))}
                </VStack>

                {exercise.notes && (
                  <Text className="text-sm text-gray-600 italic">
                    Notas: {exercise.notes}
                  </Text>
                )}
              </VStack>
            </Card>
          ))}

          {workout.notes && (
            <Card className="p-4">
              <VStack className="gap-2">
                <Text className="font-semibold">Notas del entrenamiento</Text>
                <Text className="text-gray-600">{workout.notes}</Text>
              </VStack>
            </Card>
          )}
        </VStack>
      </ScrollView>

      <RestTimer />
    </Box>
  );
}; 