import React, { useState } from 'react';
import { ScrollView, Pressable, Switch } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  ButtonText,
  Card,
  Input,
  InputField,
} from '../../../components/ui/';
import { useAuthStore } from '../../store/authStore';
import { useWorkoutStore } from '../../store/workoutStore';
import { useProgressStore } from '../../store/progressStore';
import { format, parseISO } from 'date-fns';

export const ProfileScreen = () => {
  const { user, logout, updatePreferences } = useAuthStore();
  const { workouts } = useWorkoutStore();
  const { stats } = useProgressStore();
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(user?.name || '');

  if (!user) return null;

  const handleSaveName = () => {
    // updateProfile({ name: tempName });
    setEditingName(false);
  };

  const handlePreferenceChange = (key: string, value: any) => {
    updatePreferences({ [key]: value });
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    updatePreferences({
      notifications: {
        ...user.preferences.notifications,
        [key]: value,
      }
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <VStack className="p-4 gap-6">
        {/* Profile Header */}
        <Card className="p-6">
          <VStack className="items-center gap-4">
            <Box className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center">
              <Text className="text-2xl font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </Box>
            
            {editingName ? (
              <HStack className="gap-2 items-center">
                <Input className="flex-1">
                  <InputField
                    value={tempName}
                    onChangeText={setTempName}
                    placeholder="Nombre"
                  />
                </Input>
                <Button size="sm" onPress={handleSaveName}>
                  <ButtonText>✓</ButtonText>
                </Button>
              </HStack>
            ) : (
              <Pressable onPress={() => setEditingName(true)}>
                <Text className="text-xl font-bold">{user.name}</Text>
              </Pressable>
            )}
            
            <Text className="text-gray-600">{user.email}</Text>
            <Text className="text-sm text-gray-500">
              Miembro desde {format(parseISO(user.createdAt), 'MMMM yyyy')}
            </Text>
          </VStack>
        </Card>

        {/* Quick Stats */}
        <Card className="p-4">
          <VStack className="gap-4">
            <Text className="text-lg font-semibold">Estadísticas Rápidas</Text>
            <HStack className="justify-between">
              <VStack className="items-center">
                <Text className="text-2xl font-bold text-blue-600">
                  {stats.totalWorkouts}
                </Text>
                <Text className="text-sm text-gray-600">Entrenamientos</Text>
              </VStack>
              <VStack className="items-center">
                <Text className="text-2xl font-bold text-green-600">
                  {stats.currentStreak}
                </Text>
                <Text className="text-sm text-gray-600">Racha</Text>
              </VStack>
              <VStack className="items-center">
                <Text className="text-2xl font-bold text-purple-600">
                  {formatDuration(stats.averageWorkoutDuration)}
                </Text>
                <Text className="text-sm text-gray-600">Promedio</Text>
              </VStack>
            </HStack>
          </VStack>
        </Card>

        {/* Settings */}
        <Card className="p-4">
          <VStack className="gap-4">
            <Text className="text-lg font-semibold">Configuración</Text>
            
            {/* Units */}
            <HStack className="justify-between items-center">
              <Text>Unidades</Text>
              <HStack className="gap-2">
                <Pressable
                  onPress={() => handlePreferenceChange('units', 'metric')}
                  className={`px-3 py-1 rounded ${
                    user.preferences.units === 'metric' 
                      ? 'bg-blue-500' 
                      : 'bg-gray-200'
                  }`}
                >
                  <Text className={
                    user.preferences.units === 'metric' 
                      ? 'text-white' 
                      : 'text-gray-700'
                  }>
                    Métrico
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => handlePreferenceChange('units', 'imperial')}
                  className={`px-3 py-1 rounded ${
                    user.preferences.units === 'imperial' 
                      ? 'bg-blue-500' 
                      : 'bg-gray-200'
                  }`}
                >
                  <Text className={
                    user.preferences.units === 'imperial' 
                      ? 'text-white' 
                      : 'text-gray-700'
                  }>
                    Imperial
                  </Text>
                </Pressable>
              </HStack>
            </HStack>

            {/* Rest Timer Duration */}
            <HStack className="justify-between items-center">
              <Text>Tiempo de descanso por defecto</Text>
              <HStack className="gap-2">
                {[60, 90, 120, 180].map((duration) => (
                  <Pressable
                    key={duration}
                    onPress={() => handlePreferenceChange('restTimerDuration', duration)}
                    className={`px-2 py-1 rounded ${
                      user.preferences.restTimerDuration === duration 
                        ? 'bg-blue-500' 
                        : 'bg-gray-200'
                    }`}
                  >
                    <Text className={`text-xs ${
                      user.preferences.restTimerDuration === duration 
                        ? 'text-white' 
                        : 'text-gray-700'
                    }`}>
                      {duration}s
                    </Text>
                  </Pressable>
                ))}
              </HStack>
            </HStack>
          </VStack>
        </Card>

        {/* Notifications */}
        <Card className="p-4">
          <VStack className="gap-4">
            <Text className="text-lg font-semibold">Notificaciones</Text>
            
            <HStack className="justify-between items-center">
              <Text>Recordatorios de entrenamiento</Text>
              <Switch
                value={user.preferences.notifications.workoutReminders}
                onValueChange={(value) => handleNotificationChange('workoutReminders', value)}
              />
            </HStack>

            <HStack className="justify-between items-center">
              <Text>Alertas del temporizador</Text>
              <Switch
                value={user.preferences.notifications.restTimerAlerts}
                onValueChange={(value) => handleNotificationChange('restTimerAlerts', value)}
              />
            </HStack>

            <HStack className="justify-between items-center">
              <Text>Actualizaciones de progreso</Text>
              <Switch
                value={user.preferences.notifications.progressUpdates}
                onValueChange={(value) => handleNotificationChange('progressUpdates', value)}
              />
            </HStack>
          </VStack>
        </Card>
        
        {/* Logout */}
        <Button 
          variant="outline" 
          action="negative"
          onPress={logout}
          className="mt-4"
        >
          <ButtonText>Cerrar Sesión</ButtonText>
        </Button>
      </VStack>
    </ScrollView>
  );
}; 