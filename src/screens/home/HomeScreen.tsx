import React, { useEffect } from 'react';
import { ScrollView, Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  ButtonText,
} from '../../../components/ui/';
import { useAuthStore } from '../../store/authStore';
import { useWorkoutStore } from '../../store/workoutStore';
import { useProgressStore } from '../../store/progressStore';
import { WorkoutCard } from '../../components/ui/WorkoutCard';
import { StatDisplay } from '../../components/ui/StatDisplay';
import { theme } from '../../constants/theme';
import { format } from 'date-fns';
import uuid from 'react-native-uuid';

export const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const { workouts, addWorkout } = useWorkoutStore();
  const { stats, calculateStats } = useProgressStore();

  useEffect(() => {
    calculateStats(workouts);
  }, [workouts, calculateStats]);

  const handleStartWorkout = () => {
    const newWorkout = {
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

  const recentWorkouts = workouts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const todayWorkouts = workouts.filter(w => {
    const today = new Date();
    const workoutDate = new Date(w.date);
    return workoutDate.toDateString() === today.toDateString();
  });

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const quickStats = [
    {
      label: 'Racha',
      value: stats.currentStreak,
      unit: 'días',
      trend: (stats.currentStreak > 0 ? 'up' : 'neutral') as 'up' | 'neutral',
      color: theme.colors.success,
    },
    {
      label: 'Esta Semana',
      value: stats.workoutsThisWeek,
      unit: 'entrenamientos',
      color: theme.colors.primary[500],
    },
    {
      label: 'Volumen Total',
      value: (stats.totalVolume / 1000).toFixed(1),
      unit: 'ton',
      trend: 'up' as 'up',
      trendValue: '+12%',
      color: theme.colors.warning,
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <VStack className="p-4 gap-6">
        {/* Header */}
        <VStack className="gap-2 pt-4">
          <Text className="text-3xl font-bold text-gray-900">
            {greeting()}, {user?.name?.split(' ')[0]}! 💪
          </Text>
          <Text className="text-gray-600">
            {format(new Date(), 'EEEE, d MMMM')}
          </Text>
        </VStack>

        {/* Quick Actions */}
        <HStack className="gap-3">
          <Pressable
            onPress={handleStartWorkout}
            className="flex-1 bg-blue-500 rounded-xl p-4"
            style={theme.shadows.md}
          >
            <VStack className="items-center gap-2">
              <View className="bg-white/20 rounded-full p-3">
                <Text className="text-2xl">🏋️</Text>
              </View>
              <Text className="text-white font-semibold">
                Iniciar Entrenamiento
              </Text>
            </VStack>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('Main', { screen: 'Progress' })}
            className="flex-1 bg-purple-500 rounded-xl p-4"
            style={theme.shadows.md}
          >
            <VStack className="items-center gap-2">
              <View className="bg-white/20 rounded-full p-3">
                <Text className="text-2xl">📊</Text>
              </View>
              <Text className="text-white font-semibold">
                Ver Progreso
              </Text>
            </VStack>
          </Pressable>
        </HStack>

        {/* Today's Summary */}
        {todayWorkouts.length > 0 && (
          <Box className="bg-green-50 rounded-xl p-4">
            <HStack className="items-center gap-3">
              <View className="bg-green-100 rounded-full p-2">
                <Text className="text-xl">✅</Text>
              </View>
              <VStack className="flex-1">
                <Text className="font-semibold text-green-900">
                  ¡{todayWorkouts.length} entrenamiento{todayWorkouts.length > 1 ? 's' : ''} hoy!
                </Text>
                <Text className="text-sm text-green-700">
                  Sigue así para mantener tu racha
                </Text>
              </VStack>
            </HStack>
          </Box>
        )}

        {/* Quick Stats */}
        <VStack className="gap-3">
          <Text className="text-lg font-semibold text-gray-900">
            Resumen Rápido
          </Text>
          <StatDisplay stats={quickStats} columns={3} />
        </VStack>

        {/* Recent Workouts */}
        {recentWorkouts.length > 0 && (
          <VStack className="gap-3">
            <HStack className="justify-between items-center">
              <Text className="text-lg font-semibold text-gray-900">
                Entrenamientos Recientes
              </Text>
              <Pressable
                onPress={() => navigation.navigate('Main', { screen: 'Workouts' })}
              >
                <Text className="text-sm text-blue-600 font-medium">
                  Ver todos →
                </Text>
              </Pressable>
            </HStack>
            
            {recentWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onPress={() => navigation.navigate('WorkoutDetail', { workoutId: workout.id })}
              />
            ))}
          </VStack>
        )}

        {/* Empty State */}
        {workouts.length === 0 && (
          <Box className="bg-white rounded-xl p-8" style={theme.shadows.sm}>
            <VStack className="items-center gap-4">
              <View className="bg-gray-100 rounded-full p-6">
                <Text className="text-4xl">🎯</Text>
              </View>
              <VStack className="items-center gap-2">
                <Text className="text-xl font-semibold text-gray-900">
                  ¡Comienza tu viaje fitness!
                </Text>
                <Text className="text-center text-gray-600">
                  Crea tu primer entrenamiento y empieza a registrar tu progreso
                </Text>
              </VStack>
              <Button onPress={handleStartWorkout} className="mt-4">
                <ButtonText>Crear Mi Primer Entrenamiento</ButtonText>
              </Button>
            </VStack>
          </Box>
        )}

        {/* Motivational Quote */}
        <Box className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6">
          <VStack className="gap-2">
            <Text className="text-white text-lg font-medium italic">
              "El único mal entrenamiento es el que no hiciste"
            </Text>
            <Text className="text-white/80 text-sm">
              - Motivación diaria
            </Text>
          </VStack>
        </Box>
      </VStack>
    </ScrollView>
  );
}; 