import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  ButtonText,
  FlatList,
  Pressable,
} from '../../../components/ui';
import { useWorkoutStore } from '../../store/workoutStore';
import { useNavigation } from '@react-navigation/native';

export const WorkoutListScreen = () => {
  const navigation = useNavigation();
  const { workouts } = useWorkoutStore();

  const renderWorkout = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate('WorkoutDetail', { workoutId: item.id })}
    >
      <Box bg="$backgroundLight50" p="$4" m="$2" rounded="$lg">
        <HStack justifyContent="space-between" alignItems="center">
          <VStack>
            <Text fontWeight="$bold" size="lg">
              {item.name}
            </Text>
            <Text size="sm" color="$textLight600">
              {item.exercises.length} ejercicios
            </Text>
          </VStack>
          <Text size="sm" color="$textLight500">
            {new Date(item.date).toLocaleDateString()}
          </Text>
        </HStack>
      </Box>
    </Pressable>
  );

  return (
    <Box flex={1} bg="$backgroundLight0">
      <VStack flex={1} p="$4">
        <HStack justifyContent="space-between" alignItems="center" mb="$4">
          <Text size="2xl" fontWeight="$bold">
            Mis Entrenamientos
          </Text>
          <Button size="sm" onPress={() => navigation.navigate('CreateWorkout')}>
            <ButtonText>Nuevo</ButtonText>
          </Button>
        </HStack>
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id}
          renderItem={renderWorkout}
          showsVerticalScrollIndicator={false}
        />
      </VStack>
    </Box>
  );
}; 