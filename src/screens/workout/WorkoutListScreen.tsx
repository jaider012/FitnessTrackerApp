import React, { useEffect } from 'react';
import { FlatList, ScrollView, Pressable } from 'react-native';
import { Box, VStack, HStack, Text, Button, ButtonText, Card } from '../../../components/ui/';
import { useWorkoutStore, Workout } from '../../store/workoutStore';
import { useNavigation } from '@react-navigation/native';
import { createSampleWorkouts } from '../../utils/sampleData';
import { format, parseISO } from 'date-fns';
import uuid from 'react-native-uuid';

export const WorkoutListScreen = () => {
  const navigation = useNavigation<any>();
  const { workouts, addWorkout } = useWorkoutStore();

  // Load sample data if no workouts exist
  useEffect(() => {
    if (workouts.length === 0) {
      const sampleWorkouts = createSampleWorkouts();
      sampleWorkouts.forEach(workout => addWorkout(workout));
    }
  }, [workouts.length, addWorkout]);

  const handleStartEmptyWorkout = () => {
    const newWorkout: Workout = {
      id: uuid.v4() as string,
      name: 'Nuevo Entrenamiento',
      date: new Date().toISOString(),
      exercises: [],
      duration: 0,
      completed: false,
    };
    addWorkout(newWorkout);
    navigation.navigate('WorkoutDetail', { workoutId: newWorkout.id });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const renderWorkout = ({ item }: { item: Workout }) => (
    <Pressable
      onPress={() => navigation.navigate('WorkoutDetail', { workoutId: item.id })}
      className="mb-3"
    >
      <Card className="p-4">
        <VStack className="gap-2">
          <HStack className="justify-between items-center">
            <Text className="font-bold text-lg">{item.name}</Text>
            {item.completed && (
              <Text className="text-green-600 text-sm">✓ Completado</Text>
            )}
          </HStack>
          <HStack className="justify-between items-center">
            <Text className="text-sm text-gray-600">
              {item.exercises.length} ejercicios
              {item.duration > 0 && ` • ${formatDuration(item.duration)}`}
            </Text>
            <Text className="text-sm text-gray-500">
              {format(parseISO(item.date), 'dd/MM/yyyy')}
            </Text>
          </HStack>
          {item.notes && (
            <Text className="text-sm text-gray-500 italic" numberOfLines={1}>
              {item.notes}
            </Text>
          )}
        </VStack>
      </Card>
    </Pressable>
  );

  return (
    <Box className="flex-1 bg-gray-50">
      <ScrollView className="p-4">
        {/* Header */}
        <HStack className="justify-between items-center mb-6">
          <Text className="text-2xl font-bold">Entrenamientos</Text>
          <Button size="sm" onPress={handleStartEmptyWorkout}>
            <ButtonText>+ Nuevo</ButtonText>
          </Button>
        </HStack>

        {/* Quick Stats */}
        {workouts.length > 0 && (
          <Card className="p-4 mb-6">
            <HStack className="justify-between">
              <VStack className="items-center">
                <Text className="text-xl font-bold text-blue-600">
                  {workouts.filter(w => w.completed).length}
                </Text>
                <Text className="text-sm text-gray-600">Completados</Text>
              </VStack>
              <VStack className="items-center">
                <Text className="text-xl font-bold text-green-600">
                  {workouts.filter(w => {
                    const today = new Date();
                    const workoutDate = new Date(w.date);
                    return workoutDate.toDateString() === today.toDateString() && w.completed;
                  }).length}
                </Text>
                <Text className="text-sm text-gray-600">Hoy</Text>
              </VStack>
              <VStack className="items-center">
                <Text className="text-xl font-bold text-purple-600">
                  {workouts.filter(w => {
                    const thisWeek = new Date();
                    thisWeek.setDate(thisWeek.getDate() - 7);
                    const workoutDate = new Date(w.date);
                    return workoutDate > thisWeek && w.completed;
                  }).length}
                </Text>
                <Text className="text-sm text-gray-600">Esta semana</Text>
              </VStack>
            </HStack>
          </Card>
        )}

        {/* Workouts List */}
        {workouts.length > 0 ? (
          <VStack className="gap-4">
            <Text className="text-lg font-bold">Todos los entrenamientos</Text>
            <FlatList
              data={workouts}
              keyExtractor={(item) => item.id}
              renderItem={renderWorkout}
              scrollEnabled={false}
            />
          </VStack>
        ) : (
          <Card className="p-8">
            <VStack className="items-center gap-4">
              <Text className="text-lg font-medium text-gray-600">
                ¡Comienza tu primer entrenamiento!
              </Text>
              <Text className="text-center text-gray-500 mb-4">
                Crea un nuevo entrenamiento para empezar a registrar tu progreso.
              </Text>
              <Button onPress={handleStartEmptyWorkout}>
                <ButtonText>Crear Entrenamiento</ButtonText>
              </Button>
            </VStack>
          </Card>
        )}
      </ScrollView>
    </Box>
  );
}; 