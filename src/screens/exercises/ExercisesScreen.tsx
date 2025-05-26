import React, { useState } from 'react';
import { ScrollView, FlatList, Pressable, View } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  InputField,
} from '../../../components/ui/';
import { exerciseDatabase } from '../../utils/sampleData';
import { ExerciseCategory } from '../../types';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const categoryColors: Record<ExerciseCategory, { bg: string; text: string; icon: string }> = {
  chest: { bg: '#fee2e2', text: '#dc2626', icon: 'fitness' },
  back: { bg: '#dbeafe', text: '#2563eb', icon: 'body' },
  shoulders: { bg: '#fef3c7', text: '#d97706', icon: 'body' },
  arms: { bg: '#d1fae5', text: '#059669', icon: 'barbell' },
  legs: { bg: '#e9d5ff', text: '#7c3aed', icon: 'walk' },
  core: { bg: '#fed7aa', text: '#ea580c', icon: 'body' },
  cardio: { bg: '#fce7f3', text: '#db2777', icon: 'heart' },
  'full-body': { bg: '#f3f4f6', text: '#4b5563', icon: 'body' },
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

interface ExerciseCardProps {
  exercise: typeof exerciseDatabase[0];
  onPress: () => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onPress }) => {
  const categoryStyle = categoryColors[exercise.category as ExerciseCategory];
  
  return (
    <Pressable onPress={onPress}>
      <Box 
        className="bg-white rounded-xl p-4 mb-3"
        style={theme.shadows.sm}
      >
        <HStack className="gap-3">
          {/* Icon */}
          <View 
            className="w-12 h-12 rounded-xl items-center justify-center"
            style={{ backgroundColor: categoryStyle.bg }}
          >
            <Ionicons 
              name={categoryStyle.icon as any} 
              size={24} 
              color={categoryStyle.text} 
            />
          </View>

          {/* Content */}
          <VStack className="flex-1 gap-1">
            <HStack className="justify-between items-start">
              <Text className="text-lg font-semibold text-gray-900 flex-1">
                {exercise.name}
              </Text>
              <View 
                className="px-2 py-1 rounded-full"
                style={{ backgroundColor: categoryStyle.bg }}
              >
                <Text 
                  className="text-xs font-medium"
                  style={{ color: categoryStyle.text }}
                >
                  {categoryNames[exercise.category as ExerciseCategory]}
                </Text>
              </View>
            </HStack>
            
            <HStack className="gap-2 items-center">
              <Ionicons name="body-outline" size={14} color={theme.colors.text.secondary} />
              <Text className="text-sm text-gray-600">
                {exercise.muscleGroups.join(' • ')}
              </Text>
            </HStack>

            {exercise.equipment && (
              <HStack className="gap-2 items-center">
                <Ionicons name="barbell-outline" size={14} color={theme.colors.text.secondary} />
                <Text className="text-sm text-gray-500">
                  {exercise.equipment}
                </Text>
              </HStack>
            )}
          </VStack>
        </HStack>
      </Box>
    </Pressable>
  );
};

export const ExercisesScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all');

  const categories: ExerciseCategory[] = ['chest', 'back', 'shoulders', 'arms', 'legs', 'core'];

  const filteredExercises = exerciseDatabase.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exercise.muscleGroups.some(mg => mg.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderExercise = ({ item }: { item: typeof exerciseDatabase[0] }) => (
    <ExerciseCard
      exercise={item}
      onPress={() => console.log('Exercise selected:', item.name)}
    />
  );

  return (
    <Box className="flex-1 bg-gray-50">
      <VStack className="gap-4">
        {/* Header */}
        <VStack className="px-4 pt-4 gap-4">
          <HStack className="justify-between items-center">
            <VStack className="gap-1">
              <Text className="text-3xl font-bold text-gray-900">
                Biblioteca de Ejercicios
              </Text>
              <Text className="text-gray-600">
                {exerciseDatabase.length} ejercicios disponibles
              </Text>
            </VStack>
            <Pressable className="bg-blue-50 p-2 rounded-xl">
              <Ionicons name="add" size={24} color={theme.colors.primary[600]} />
            </Pressable>
          </HStack>

          {/* Search */}
          <Box className="relative">
            <View className="absolute left-3 top-3 z-10">
              <Ionicons name="search" size={20} color={theme.colors.text.tertiary} />
            </View>
            <Input className="bg-white rounded-xl" style={theme.shadows.sm}>
              <InputField
                placeholder="Buscar por nombre o músculo..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="pl-10"
              />
            </Input>
          </Box>
        </VStack>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="px-4"
        >
          <HStack className="gap-2">
            <Pressable
              onPress={() => setSelectedCategory('all')}
              className={`px-4 py-2.5 rounded-xl ${
                selectedCategory === 'all' 
                  ? 'bg-blue-500' 
                  : 'bg-white'
              }`}
              style={selectedCategory !== 'all' ? theme.shadows.sm : {}}
            >
              <HStack className="gap-2 items-center">
                <Ionicons 
                  name="apps" 
                  size={16} 
                  color={selectedCategory === 'all' ? '#fff' : theme.colors.text.secondary} 
                />
                <Text className={`text-sm font-medium ${
                  selectedCategory === 'all' 
                    ? 'text-white' 
                    : 'text-gray-700'
                }`}>
                  Todos
                </Text>
              </HStack>
            </Pressable>
            
            {categories.map((category) => {
              const categoryStyle = categoryColors[category];
              const isSelected = selectedCategory === category;
              
              return (
                <Pressable
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  className={`px-4 py-2.5 rounded-xl ${
                    isSelected ? 'bg-blue-500' : 'bg-white'
                  }`}
                  style={!isSelected ? theme.shadows.sm : {}}
                >
                  <HStack className="gap-2 items-center">
                    <Ionicons 
                      name={categoryStyle.icon as any} 
                      size={16} 
                      color={isSelected ? '#fff' : categoryStyle.text} 
                    />
                    <Text className={`text-sm font-medium ${
                      isSelected ? 'text-white' : 'text-gray-700'
                    }`}>
                      {categoryNames[category]}
                    </Text>
                  </HStack>
                </Pressable>
              );
            })}
          </HStack>
        </ScrollView>

        {/* Results Count */}
        <HStack className="px-4 justify-between items-center">
          <Text className="text-sm font-medium text-gray-600">
            {filteredExercises.length} ejercicios encontrados
          </Text>
          <Pressable>
            <HStack className="gap-1 items-center">
              <Ionicons name="filter" size={16} color={theme.colors.primary[600]} />
              <Text className="text-sm font-medium text-blue-600">
                Filtros
              </Text>
            </HStack>
          </Pressable>
        </HStack>

        {/* Exercises List */}
        <FlatList
          data={filteredExercises}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={renderExercise}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ 
            paddingHorizontal: 16,
            paddingBottom: 100 
          }}
          ListEmptyComponent={
            <Box className="bg-white rounded-xl p-8 mt-4" style={theme.shadows.sm}>
              <VStack className="items-center gap-4">
                <View className="bg-gray-100 rounded-full p-4">
                  <Ionicons name="search" size={32} color={theme.colors.text.tertiary} />
                </View>
                <VStack className="items-center gap-2">
                  <Text className="text-lg font-semibold text-gray-900">
                    No se encontraron ejercicios
                  </Text>
                  <Text className="text-center text-gray-600">
                    Intenta con otros términos de búsqueda o cambia la categoría
                  </Text>
                </VStack>
              </VStack>
            </Box>
          }
        />
      </VStack>
    </Box>
  );
}; 