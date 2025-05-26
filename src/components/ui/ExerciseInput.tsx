import React, { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Box, VStack, HStack, Text } from '../../../components/ui/';
import { ExerciseSet } from '../../types';
import { theme } from '../../constants/theme';

interface ExerciseInputProps {
  exerciseName: string;
  sets: ExerciseSet[];
  onUpdateSet: (setId: string, updates: Partial<ExerciseSet>) => void;
  onAddSet: () => void;
  onRemoveSet: (setId: string) => void;
  onStartTimer: () => void;
}

export const ExerciseInput: React.FC<ExerciseInputProps> = ({
  exerciseName,
  sets,
  onUpdateSet,
  onAddSet,
  onRemoveSet,
  onStartTimer,
}) => {
  const [editingSet, setEditingSet] = useState<string | null>(null);

  const handleSetComplete = (setId: string, currentCompleted: boolean) => {
    onUpdateSet(setId, { completed: !currentCompleted });
    if (!currentCompleted) {
      onStartTimer();
    }
  };

  return (
    <Box className="bg-white rounded-xl p-4" style={theme.shadows.sm}>
      <VStack className="gap-4">
        {/* Exercise Header */}
        <HStack className="justify-between items-center">
          <Text className="text-lg font-semibold text-gray-900">
            {exerciseName}
          </Text>
          <Pressable
            onPress={onAddSet}
            className="bg-blue-50 px-3 py-1.5 rounded-lg"
          >
            <Text className="text-sm font-medium text-blue-600">
              + Añadir Serie
            </Text>
          </Pressable>
        </HStack>

        {/* Set Headers */}
        <HStack className="px-2">
          <Text className="w-12 text-xs font-medium text-gray-500">SET</Text>
          <Text className="flex-1 text-xs font-medium text-gray-500 text-center">
            ANTERIOR
          </Text>
          <Text className="w-20 text-xs font-medium text-gray-500 text-center">
            KG
          </Text>
          <Text className="w-20 text-xs font-medium text-gray-500 text-center">
            REPS
          </Text>
          <View className="w-10" />
        </HStack>

        {/* Sets */}
        <VStack className="gap-2">
          {sets.map((set, index) => (
            <HStack
              key={set.id}
              className={`items-center px-2 py-2 rounded-lg ${
                set.completed ? 'bg-green-50' : 'bg-gray-50'
              }`}
            >
              {/* Set Number */}
              <Text className="w-12 text-sm font-medium text-gray-700">
                {index + 1}
              </Text>

              {/* Previous */}
              <Text className="flex-1 text-sm text-gray-500 text-center">
                {set.weight > 0 ? `${set.weight} kg × ${set.reps}` : '-'}
              </Text>

              {/* Weight Input */}
              <View className="w-20 mx-1">
                <TextInput
                  value={set.weight.toString()}
                  onChangeText={(text) => {
                    const weight = parseFloat(text) || 0;
                    onUpdateSet(set.id, { weight });
                  }}
                  keyboardType="numeric"
                  placeholder="0"
                  className="bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-center text-sm"
                  style={{ borderColor: set.completed ? theme.colors.success : theme.colors.neutral[200] }}
                />
              </View>

              {/* Reps Input */}
              <View className="w-20 mx-1">
                <TextInput
                  value={set.reps.toString()}
                  onChangeText={(text) => {
                    const reps = parseInt(text) || 0;
                    onUpdateSet(set.id, { reps });
                  }}
                  keyboardType="numeric"
                  placeholder="0"
                  className="bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-center text-sm"
                  style={{ borderColor: set.completed ? theme.colors.success : theme.colors.neutral[200] }}
                />
              </View>

              {/* Complete Button */}
              <Pressable
                onPress={() => handleSetComplete(set.id, set.completed)}
                className="w-10 items-center"
              >
                <View
                  className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                    set.completed
                      ? 'bg-green-500 border-green-500'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  {set.completed && (
                    <Text className="text-white text-xs font-bold">✓</Text>
                  )}
                </View>
              </Pressable>
            </HStack>
          ))}
        </VStack>

        {/* Add Notes */}
        <Pressable className="py-2">
          <Text className="text-sm text-blue-600">+ Añadir notas</Text>
        </Pressable>
      </VStack>
    </Box>
  );
}; 