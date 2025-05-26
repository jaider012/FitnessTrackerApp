import React, { useEffect } from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Text,
} from '../../../components/ui/';
import { useWorkoutStore } from '../../store/workoutStore';
import { useProgressStore } from '../../store/progressStore';
import { StatDisplay } from '../../components/ui/StatDisplay';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { format, subDays } from 'date-fns';

interface ProgressCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ 
  title, 
  value, 
  unit, 
  icon, 
  color,
  trend,
  trendValue 
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return 'trending-up';
      case 'down': return 'trending-down';
      default: return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return theme.colors.success;
      case 'down': return theme.colors.error;
      default: return theme.colors.text.secondary;
    }
  };

  return (
    <Box className="bg-white rounded-xl p-4" style={theme.shadows.sm}>
      <VStack className="gap-3">
        <HStack className="justify-between items-start">
          <View 
            className="w-10 h-10 rounded-lg items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <Ionicons name={icon} size={20} color={color} />
          </View>
          {trend && trendValue && (
            <HStack className="items-center gap-1">
              <Ionicons 
                name={getTrendIcon() as any} 
                size={16} 
                color={getTrendColor()} 
              />
              <Text 
                className="text-xs font-medium"
                style={{ color: getTrendColor() }}
              >
                {trendValue}
              </Text>
            </HStack>
          )}
        </HStack>
        
        <VStack className="gap-1">
          <HStack className="items-baseline gap-1">
            <Text className="text-2xl font-bold text-gray-900">
              {value}
            </Text>
            {unit && (
              <Text className="text-sm text-gray-500">{unit}</Text>
            )}
          </HStack>
          <Text className="text-sm text-gray-600">{title}</Text>
        </VStack>
      </VStack>
    </Box>
  );
};

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
    if (weight >= 1000000) {
      return `${(weight / 1000000).toFixed(1)}M`;
    }
    if (weight >= 1000) {
      return `${(weight / 1000).toFixed(1)}k`;
    }
    return weight.toString();
  };

  // Calculate week over week change
  const lastWeekWorkouts = workouts.filter(w => {
    const workoutDate = new Date(w.date);
    const weekAgo = subDays(new Date(), 7);
    const twoWeeksAgo = subDays(new Date(), 14);
    return workoutDate >= twoWeeksAgo && workoutDate < weekAgo && w.completed;
  }).length;

  const weekChange = lastWeekWorkouts > 0 
    ? Math.round(((stats.workoutsThisWeek - lastWeekWorkouts) / lastWeekWorkouts) * 100)
    : 0;

  const progressCards = [
    {
      title: 'Entrenamientos Totales',
      value: stats.totalWorkouts,
      icon: 'fitness' as keyof typeof Ionicons.glyphMap,
      color: theme.colors.primary[600],
    },
    {
      title: 'Racha Actual',
      value: stats.currentStreak,
      unit: 'días',
      icon: 'flame' as keyof typeof Ionicons.glyphMap,
      color: theme.colors.error,
      trend: stats.currentStreak > 0 ? 'up' as 'up' : 'neutral' as 'neutral',
    },
    {
      title: 'Esta Semana',
      value: stats.workoutsThisWeek,
      icon: 'calendar' as keyof typeof Ionicons.glyphMap,
      color: theme.colors.success,
      trend: weekChange > 0 ? 'up' as 'up' : weekChange < 0 ? 'down' as 'down' : 'neutral' as 'neutral',
      trendValue: weekChange !== 0 ? `${weekChange > 0 ? '+' : ''}${weekChange}%` : undefined,
    },
    {
      title: 'Este Mes',
      value: stats.workoutsThisMonth,
      icon: 'calendar-outline' as keyof typeof Ionicons.glyphMap,
      color: theme.colors.warning,
    },
    {
      title: 'Volumen Total',
      value: formatWeight(stats.totalVolume),
      unit: 'kg',
      icon: 'barbell' as keyof typeof Ionicons.glyphMap,
      color: theme.colors.primary[700],
    },
    {
      title: 'Duración Promedio',
      value: formatDuration(stats.averageWorkoutDuration),
      icon: 'time' as keyof typeof Ionicons.glyphMap,
      color: theme.colors.info,
    },
  ];

  const weeklyStats = [
    {
      label: 'Volumen',
      value: formatWeight(
        workouts
          .filter(w => {
            const workoutDate = new Date(w.date);
            const weekAgo = subDays(new Date(), 7);
            return workoutDate >= weekAgo && w.completed;
          })
          .reduce((sum, w) => {
            return sum + w.exercises.reduce((eSum, e) => {
              return eSum + e.sets.reduce((sSum, s) => {
                return sSum + (s.completed ? s.weight * s.reps : 0);
              }, 0);
            }, 0);
          }, 0)
      ),
      unit: 'kg',
      color: theme.colors.primary[600],
    },
    {
      label: 'Series',
      value: workouts
        .filter(w => {
          const workoutDate = new Date(w.date);
          const weekAgo = subDays(new Date(), 7);
          return workoutDate >= weekAgo && w.completed;
        })
        .reduce((sum, w) => {
          return sum + w.exercises.reduce((eSum, e) => {
            return eSum + e.sets.filter(s => s.completed).length;
          }, 0);
        }, 0),
      color: theme.colors.success,
    },
    {
      label: 'Tiempo',
      value: formatDuration(
        workouts
          .filter(w => {
            const workoutDate = new Date(w.date);
            const weekAgo = subDays(new Date(), 7);
            return workoutDate >= weekAgo && w.completed;
          })
          .reduce((sum, w) => sum + w.duration, 0)
      ),
      color: theme.colors.warning,
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <VStack className="p-4 gap-6">
        {/* Header */}
        <VStack className="gap-2 pt-4">
          <Text className="text-3xl font-bold text-gray-900">
            Tu Progreso
          </Text>
          <Text className="text-gray-600">
            Sigue mejorando cada día 💪
          </Text>
        </VStack>

        {/* Weekly Summary */}
        {stats.workoutsThisWeek > 0 && (
          <Box className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6">
            <VStack className="gap-4">
              <HStack className="justify-between items-center">
                <Text className="text-white text-lg font-semibold">
                  Resumen Semanal
                </Text>
                <View className="bg-white/20 px-3 py-1 rounded-full">
                  <Text className="text-white text-sm font-medium">
                    {format(subDays(new Date(), 6), 'dd MMM')} - {format(new Date(), 'dd MMM')}
                  </Text>
                </View>
              </HStack>
              <StatDisplay stats={weeklyStats} columns={3} />
            </VStack>
          </Box>
        )}

        {/* Progress Cards Grid */}
        <VStack className="gap-3">
          <View className="flex-row flex-wrap -mx-1.5">
            {progressCards.map((card, index) => (
              <View key={index} className="w-1/2 px-1.5 mb-3">
                <ProgressCard {...card} />
              </View>
            ))}
          </View>
        </VStack>

        {/* Exercise Progress */}
        {progressData.exerciseProgress.length > 0 && (
          <VStack className="gap-4">
            <HStack className="justify-between items-center">
              <Text className="text-xl font-bold text-gray-900">
                Progreso por Ejercicio
              </Text>
              <Pressable>
                <Text className="text-sm font-medium text-blue-600">
                  Ver todos →
                </Text>
              </Pressable>
            </HStack>

            <VStack className="gap-3">
              {progressData.exerciseProgress.slice(0, 5).map((exercise) => {
                const latestData = exercise.data[exercise.data.length - 1];
                const firstData = exercise.data[0];
                const improvement = latestData && firstData && firstData.maxWeight > 0
                  ? ((latestData.maxWeight - firstData.maxWeight) / firstData.maxWeight * 100)
                  : 0;

                return (
                  <Box 
                    key={exercise.exerciseName} 
                    className="bg-white rounded-xl p-4"
                    style={theme.shadows.sm}
                  >
                    <HStack className="justify-between items-center">
                      <VStack className="flex-1 gap-2">
                        <Text className="font-semibold text-gray-900">
                          {exercise.exerciseName}
                        </Text>
                        <HStack className="gap-4">
                          <VStack>
                            <Text className="text-xs text-gray-500">Peso Máx</Text>
                            <Text className="text-lg font-bold text-gray-900">
                              {latestData?.maxWeight || 0} kg
                            </Text>
                          </VStack>
                          <VStack>
                            <Text className="text-xs text-gray-500">Volumen</Text>
                            <Text className="text-lg font-bold text-gray-900">
                              {formatWeight(latestData?.totalVolume || 0)} kg
                            </Text>
                          </VStack>
                          <VStack>
                            <Text className="text-xs text-gray-500">Sesiones</Text>
                            <Text className="text-lg font-bold text-gray-900">
                              {exercise.data.length}
                            </Text>
                          </VStack>
                        </HStack>
                      </VStack>
                      
                      <View className="items-center">
                        <View 
                          className={`px-3 py-1.5 rounded-full ${
                            improvement > 0 ? 'bg-green-100' : improvement < 0 ? 'bg-red-100' : 'bg-gray-100'
                          }`}
                        >
                          <HStack className="items-center gap-1">
                            <Ionicons 
                              name={improvement > 0 ? 'trending-up' : improvement < 0 ? 'trending-down' : 'remove'} 
                              size={16} 
                              color={improvement > 0 ? theme.colors.success : improvement < 0 ? theme.colors.error : theme.colors.text.secondary} 
                            />
                            <Text 
                              className={`text-sm font-medium ${
                                improvement > 0 ? 'text-green-700' : improvement < 0 ? 'text-red-700' : 'text-gray-700'
                              }`}
                            >
                              {improvement > 0 ? '+' : ''}{improvement.toFixed(0)}%
                            </Text>
                          </HStack>
                        </View>
                      </View>
                    </HStack>
                  </Box>
                );
              })}
            </VStack>
          </VStack>
        )}

        {/* Achievement Section */}
        {stats.currentStreak >= 3 && (
          <Box className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6">
            <HStack className="items-center gap-4">
              <View className="bg-white/20 rounded-full p-3">
                <Text className="text-3xl">🔥</Text>
              </View>
              <VStack className="flex-1 gap-1">
                <Text className="text-white text-lg font-bold">
                  ¡{stats.currentStreak} días de racha!
                </Text>
                <Text className="text-white/90 text-sm">
                  Sigue así para mantener tu progreso constante
                </Text>
              </VStack>
            </HStack>
          </Box>
        )}

        {/* Empty State */}
        {stats.totalWorkouts === 0 && (
          <Box className="bg-white rounded-xl p-8" style={theme.shadows.sm}>
            <VStack className="items-center gap-4">
              <View className="bg-gray-100 rounded-full p-6">
                <Ionicons name="stats-chart" size={48} color={theme.colors.text.tertiary} />
              </View>
              <VStack className="items-center gap-2">
                <Text className="text-xl font-semibold text-gray-900">
                  Aún no hay datos de progreso
                </Text>
                <Text className="text-center text-gray-600">
                  Completa algunos entrenamientos para ver tu progreso y estadísticas aquí
                </Text>
              </VStack>
            </VStack>
          </Box>
        )}
      </VStack>
    </ScrollView>
  );
}; 