import React from 'react';
import { FlatList, ScrollView, Pressable } from 'react-native';
import { Box, VStack, HStack, Text, Button, ButtonText } from '../../../components/ui/';
import { useWorkoutStore, Workout } from '../../store/workoutStore';
import { useNavigation } from '@react-navigation/native';

// Rutinas predefinidas basadas en las imágenes
const PREDEFINED_ROUTINES = [
  {
    id: 'push',
    name: 'Push',
    description: 'Warm Up, Bench Press (Barbell), Shoulder Press (Dumbbell), Butterfly (Pec Deck),...',
    color: '$blue500'
  },
  {
    id: 'pull', 
    name: 'Pull',
    description: 'Warm Up, Lat Pulldown (Cable), Seated Cable Row - V Grip (Cable), Shrug (Dum...)',
    color: '$blue500'
  },
  {
    id: 'legs',
    name: 'Legs',
    description: 'Warm Up, Squat (Barbell), Romanian Deadlift, Leg Press, Calf Raises...',
    color: '$blue500'
  }
];

export const WorkoutListScreen = () => {
  const navigation = useNavigation<any>();
  const { workouts, startWorkout } = useWorkoutStore();

  const handleStartEmptyWorkout = () => {
    const newWorkout: Workout = {
      id: Date.now().toString(),
      name: 'Nuevo Entrenamiento',
      date: new Date().toISOString(),
      exercises: [],
      duration: 0,
      completed: false,
    };
    startWorkout(newWorkout);
    navigation.navigate('WorkoutDetail', { workoutId: newWorkout.id });
  };

  const renderWorkout = ({ item }: { item: Workout }) => (
    <Pressable
      onPress={() => navigation.navigate('WorkoutDetail', { workoutId: item.id })}
      className="mb-3"
    >
      <Box className="bg-gray-50 p-4 rounded-lg">
        <HStack className="justify-between items-center">
          <VStack className="flex-1">
            <Text className="font-bold text-lg">{item.name}</Text>
            <Text className="text-sm text-gray-600">
              {item.exercises.length} ejercicios • {Math.floor(item.duration / 60)}min
            </Text>
          </VStack>
          <Text className="text-sm text-gray-500">
            {new Date(item.date).toLocaleDateString()}
          </Text>
        </HStack>
      </Box>
    </Pressable>
  );

  return (
    <Box className="flex-1 bg-white">
      <ScrollView className="p-4">
        {/* Header */}
        <HStack className="justify-between items-center mb-6">
          <Text className="text-2xl font-bold">Workout</Text>
          <Text className="text-2xl">📁</Text>
        </HStack>

        {/* Quick Start Section */}
        <VStack className="gap-4 mb-6">
          <Text className="text-lg font-bold">Quick Start</Text>
          <Button 
            variant="outline" 
            size="lg" 
            onPress={handleStartEmptyWorkout}
          >
            <ButtonText>➕ Start Empty Workout</ButtonText>
          </Button>
        </VStack>

        {/* Recent Workouts */}
        {workouts.length > 0 && (
          <VStack className="gap-4">
            <Text className="text-lg font-bold">Entrenamientos Recientes</Text>
            <FlatList
              data={workouts.slice(0, 5)}
              keyExtractor={(item) => item.id}
              renderItem={renderWorkout}
              scrollEnabled={false}
            />
          </VStack>
        )}

        {/* Empty State */}
        {workouts.length === 0 && (
          <Box className="items-center mt-10">
            <Text className="text-lg text-gray-500 text-center mb-4">
              ¡Empieza tu primer entrenamiento!
            </Text>
            <Text className="text-sm text-gray-400 text-center">
              Toca "Start Empty Workout" para comenzar
            </Text>
          </Box>
        )}
      </ScrollView>
    </Box>
  );
}; 