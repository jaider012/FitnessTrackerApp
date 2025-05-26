import React, { useState } from 'react';
import { ScrollView, FlatList, Pressable } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  InputField,
  Card,
} from '../../../components/ui/';
import { exerciseDatabase } from '../../utils/sampleData';
import { ExerciseCategory } from '../../types';

const categoryColors: Record<ExerciseCategory, string> = {
  chest: 'bg-red-100 text-red-700',
  back: 'bg-blue-100 text-blue-700',
  shoulders: 'bg-yellow-100 text-yellow-700',
  arms: 'bg-green-100 text-green-700',
  legs: 'bg-purple-100 text-purple-700',
  core: 'bg-orange-100 text-orange-700',
  cardio: 'bg-pink-100 text-pink-700',
  'full-body': 'bg-gray-100 text-gray-700',
};

const categoryNames: Record<ExerciseCategory, string> = {
  chest: 'Pecho',
  back: 'Espalda',
  shoulders: 'Hombros',
  arms: 'Brazos',
  legs: 'Piernas',
  core: 'Core',
  cardio: 'Cardio',
  'full-body': 'Cuerpo Completo',
};

export const ExercisesScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all');

  const categories: ExerciseCategory[] = ['chest', 'back', 'shoulders', 'arms', 'legs', 'core'];

  const filteredExercises = exerciseDatabase.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderExercise = ({ item }: { item: typeof exerciseDatabase[0] }) => (
    <Card className="p-4 mb-3">
      <VStack className="gap-2">
        <HStack className="justify-between items-center">
          <Text className="font-semibold text-lg">{item.name}</Text>
          <Box className={`px-2 py-1 rounded-full ${categoryColors[item.category as ExerciseCategory]}`}>
            <Text className={`text-xs font-medium ${categoryColors[item.category as ExerciseCategory].split(' ')[1]}`}>
              {categoryNames[item.category as ExerciseCategory]}
            </Text>
          </Box>
        </HStack>
        <Text className="text-sm text-gray-600">
          Músculos: {item.muscleGroups.join(', ')}
        </Text>
      </VStack>
    </Card>
  );

  return (
    <Box className="flex-1 bg-gray-50">
      <VStack className="p-4 gap-4">
        {/* Header */}
        <Text className="text-2xl font-bold">Ejercicios</Text>

        {/* Search */}
        <Input>
          <InputField
            placeholder="Buscar ejercicios..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </Input>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack className="gap-2">
            <Pressable
              onPress={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === 'all' 
                  ? 'bg-blue-500' 
                  : 'bg-gray-200'
              }`}
            >
              <Text className={`text-sm font-medium ${
                selectedCategory === 'all' 
                  ? 'text-white' 
                  : 'text-gray-700'
              }`}>
                Todos
              </Text>
            </Pressable>
            {categories.map((category) => (
              <Pressable
                key={category}
                onPress={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === category 
                    ? 'bg-blue-500' 
                    : 'bg-gray-200'
                }`}
              >
                <Text className={`text-sm font-medium ${
                  selectedCategory === category 
                    ? 'text-white' 
                    : 'text-gray-700'
                }`}>
                  {categoryNames[category]}
                </Text>
              </Pressable>
            ))}
          </HStack>
        </ScrollView>

        {/* Exercise Count */}
        <Text className="text-sm text-gray-600">
          {filteredExercises.length} ejercicios encontrados
        </Text>

        {/* Exercises List */}
        <FlatList
          data={filteredExercises}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={renderExercise}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </VStack>
    </Box>
  );
}; 