import React from 'react';
import { Pressable, View } from 'react-native';
import { Box, VStack, HStack, Text } from '../../../components/ui/';
import { Workout } from '../../store/workoutStore';
import { format, parseISO } from 'date-fns';
import { theme } from '../../constants/theme';

interface WorkoutCardProps {
  workout: Workout;
  onPress: () => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onPress }) => {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const totalVolume = workout.exercises.reduce((sum, exercise) => {
    return sum + exercise.sets.reduce((setSum, set) => {
      return setSum + (set.completed ? set.weight * set.reps : 0);
    }, 0);
  }, 0);

  const totalSets = workout.exercises.reduce((sum, exercise) => {
    return sum + exercise.sets.filter(set => set.completed).length;
  }, 0);

  return (
    <Pressable onPress={onPress}>
      <Box 
        className="bg-white rounded-xl p-4 mb-3"
        style={theme.shadows.sm}
      >
        <VStack className="gap-3">
          {/* Header */}
          <HStack className="justify-between items-start">
            <VStack className="flex-1 gap-1">
              <Text className="text-lg font-semibold text-gray-900">
                {workout.name}
              </Text>
              <Text className="text-sm text-gray-500">
                {format(parseISO(workout.date), 'EEEE, MMM d')}
              </Text>
            </VStack>
            {workout.completed && (
              <View className="bg-green-100 px-2 py-1 rounded-full">
                <Text className="text-xs font-medium text-green-700">
                  Completado
                </Text>
              </View>
            )}
          </HStack>

          {/* Stats */}
          <HStack className="gap-4">
            <VStack>
              <Text className="text-2xl font-bold text-gray-900">
                {workout.exercises.length}
              </Text>
              <Text className="text-xs text-gray-500">Ejercicios</Text>
            </VStack>
            
            {workout.completed && (
              <>
                <View className="w-px bg-gray-200" />
                <VStack>
                  <Text className="text-2xl font-bold text-gray-900">
                    {totalSets}
                  </Text>
                  <Text className="text-xs text-gray-500">Series</Text>
                </VStack>
                
                <View className="w-px bg-gray-200" />
                <VStack>
                  <Text className="text-2xl font-bold text-gray-900">
                    {(totalVolume / 1000).toFixed(1)}k
                  </Text>
                  <Text className="text-xs text-gray-500">kg Total</Text>
                </VStack>
                
                <View className="w-px bg-gray-200" />
                <VStack>
                  <Text className="text-2xl font-bold text-gray-900">
                    {formatDuration(workout.duration)}
                  </Text>
                  <Text className="text-xs text-gray-500">Duración</Text>
                </VStack>
              </>
            )}
          </HStack>

          {/* Exercise Preview */}
          <VStack className="gap-1">
            {workout.exercises.slice(0, 3).map((exercise, index) => (
              <Text key={exercise.id} className="text-sm text-gray-600">
                • {exercise.name} ({exercise.sets.length} series)
              </Text>
            ))}
            {workout.exercises.length > 3 && (
              <Text className="text-sm text-gray-400">
                +{workout.exercises.length - 3} más...
              </Text>
            )}
          </VStack>
        </VStack>
      </Box>
    </Pressable>
  );
}; 