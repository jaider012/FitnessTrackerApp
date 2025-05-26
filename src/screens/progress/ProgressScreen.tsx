import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
} from '../../../components/ui/';
import { useWorkoutStore } from '../../store/workoutStore';
import { useProgressStore } from '../../store/progressStore';

export const ProgressScreen = () => {
  const { workouts } = useWorkoutStore();
  const { stats, progressData, calculateStats, calculateProgressData } = useProgressStore();

  useEffect(() => {
    calculateStats(workouts);
    calculateProgressData(workouts);
  }, [workouts, calculateStats, calculateProgressData]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatWeight = (weight: number) => {
    return `${weight.toLocaleString()} kg`;
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <VStack className="p-4 gap-6">
        {/* Header */}
        <Text className="text-2xl font-bold text-center">
          Tu Progreso
        </Text>

        {/* Stats Cards */}
        <VStack className="gap-4">
          <HStack className="gap-4">
            <Card className="flex-1 p-4">
              <VStack className="items-center">
                <Text className="text-2xl font-bold text-blue-600">
                  {stats.totalWorkouts}
                </Text>
                <Text className="text-sm text-gray-600 text-center">
                  Entrenamientos Totales
                </Text>
              </VStack>
            </Card>
            
            <Card className="flex-1 p-4">
              <VStack className="items-center">
                <Text className="text-2xl font-bold text-green-600">
                  {stats.currentStreak}
                </Text>
                <Text className="text-sm text-gray-600 text-center">
                  Racha Actual
                </Text>
              </VStack>
            </Card>
          </HStack>

          <HStack className="gap-4">
            <Card className="flex-1 p-4">
              <VStack className="items-center">
                <Text className="text-2xl font-bold text-purple-600">
                  {formatWeight(stats.totalVolume)}
                </Text>
                <Text className="text-sm text-gray-600 text-center">
                  Volumen Total
                </Text>
              </VStack>
            </Card>
            
            <Card className="flex-1 p-4">
              <VStack className="items-center">
                <Text className="text-2xl font-bold text-orange-600">
                  {formatDuration(stats.averageWorkoutDuration)}
                </Text>
                <Text className="text-sm text-gray-600 text-center">
                  Duración Promedio
                </Text>
              </VStack>
            </Card>
          </HStack>

          <HStack className="gap-4">
            <Card className="flex-1 p-4">
              <VStack className="items-center">
                <Text className="text-2xl font-bold text-red-600">
                  {stats.workoutsThisWeek}
                </Text>
                <Text className="text-sm text-gray-600 text-center">
                  Esta Semana
                </Text>
              </VStack>
            </Card>
            
            <Card className="flex-1 p-4">
              <VStack className="items-center">
                <Text className="text-2xl font-bold text-indigo-600">
                  {stats.workoutsThisMonth}
                </Text>
                <Text className="text-sm text-gray-600 text-center">
                  Este Mes
                </Text>
              </VStack>
            </Card>
          </HStack>
        </VStack>

        {/* Recent Activity */}
        {progressData.workoutFrequency.length > 0 && (
          <Card className="p-4">
            <VStack className="gap-4">
              <Text className="text-lg font-semibold">
                Actividad Reciente
              </Text>
              <Text className="text-sm text-gray-600">
                Has entrenado {progressData.workoutFrequency.filter(d => d.count > 0).length} días en el último mes
              </Text>
            </VStack>
          </Card>
        )}

        {/* Exercise Progress Summary */}
        {progressData.exerciseProgress.length > 0 && (
          <Card className="p-4">
            <VStack className="gap-4">
              <Text className="text-lg font-semibold">
                Progreso por Ejercicio
              </Text>
              <VStack className="gap-3">
                {progressData.exerciseProgress.slice(0, 5).map((exercise) => {
                  const latestData = exercise.data[exercise.data.length - 1];
                  const firstData = exercise.data[0];
                  const improvement = latestData && firstData 
                    ? ((latestData.maxWeight - firstData.maxWeight) / firstData.maxWeight * 100)
                    : 0;

                  return (
                    <HStack key={exercise.exerciseName} className="justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <VStack className="flex-1">
                        <Text className="font-medium">{exercise.exerciseName}</Text>
                        <Text className="text-sm text-gray-600">
                          Peso máximo: {latestData?.maxWeight || 0} kg
                        </Text>
                      </VStack>
                      <VStack className="items-end">
                        <Text className={`text-sm font-medium ${improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {improvement >= 0 ? '+' : ''}{improvement.toFixed(1)}%
                        </Text>
                        <Text className="text-xs text-gray-500">
                          {exercise.data.length} sesiones
                        </Text>
                      </VStack>
                    </HStack>
                  );
                })}
              </VStack>
            </VStack>
          </Card>
        )}

        {/* Empty State */}
        {stats.totalWorkouts === 0 && (
          <Card className="p-8">
            <VStack className="items-center gap-4">
              <Text className="text-lg font-medium text-gray-600">
                ¡Comienza tu primer entrenamiento!
              </Text>
              <Text className="text-center text-gray-500">
                Una vez que completes algunos entrenamientos, verás aquí tu progreso y estadísticas.
              </Text>
            </VStack>
          </Card>
        )}
      </VStack>
    </ScrollView>
  );
}; 