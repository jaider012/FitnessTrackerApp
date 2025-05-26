import React, { useEffect } from 'react';
import { FlatList, ScrollView, View } from 'react-native';
import { Box, VStack, HStack, Text, Button, ButtonText } from '../../../components/ui/';
import { useWorkoutStore, Workout } from '../../store/workoutStore';
import { useNavigation } from '@react-navigation/native';
import { createSampleWorkouts } from '../../utils/sampleData';
import { WorkoutCard } from '../../components/ui/WorkoutCard';
import { StatDisplay } from '../../components/ui/StatDisplay';
import { theme } from '../../constants/theme';
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
    <WorkoutCard
      workout={item}
      onPress={() => navigation.navigate('WorkoutDetail', { workoutId: item.id })}
    />
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
          <StatDisplay
            stats={[
              {
                label: 'Completados',
                value: workouts.filter(w => w.completed).length,
                color: theme.colors.primary[600],
              },
              {
                label: 'Hoy',
                value: workouts.filter(w => {
                  const today = new Date();
                  const workoutDate = new Date(w.date);
                  return workoutDate.toDateString() === today.toDateString() && w.completed;
                }).length,
                color: theme.colors.success,
              },
              {
                label: 'Esta semana',
                value: workouts.filter(w => {
                  const thisWeek = new Date();
                  thisWeek.setDate(thisWeek.getDate() - 7);
                  const workoutDate = new Date(w.date);
                  return workoutDate > thisWeek && w.completed;
                }).length,
                color: theme.colors.warning,
              },
            ]}
            columns={3}
          />
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
          <Box className="bg-white rounded-xl p-8" style={theme.shadows.sm}>
            <VStack className="items-center gap-4">
              <View className="bg-gray-100 rounded-full p-6 mb-4">
                <Text className="text-4xl">🏋️</Text>
              </View>
              <Text className="text-lg font-medium text-gray-900">
                ¡Comienza tu primer entrenamiento!
              </Text>
              <Text className="text-center text-gray-600 mb-4">
                Crea un nuevo entrenamiento para empezar a registrar tu progreso.
              </Text>
              <Button onPress={handleStartEmptyWorkout}>
                <ButtonText>Crear Entrenamiento</ButtonText>
              </Button>
            </VStack>
          </Box>
        )}
      </ScrollView>
    </Box>
  );
}; 