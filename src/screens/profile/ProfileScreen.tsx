import React from 'react';
import { Box, VStack, Text, Button, ButtonText } from '../../../components/ui/';
import { useAuthStore } from '../../store/authStore';

export const ProfileScreen = () => {
  const { user, logout } = useAuthStore();

  return (
    <Box className="flex-1 bg-white p-6">
      <VStack className="gap-6">
        <Text className="text-2xl font-bold">Perfil</Text>
        
        {user && (
          <VStack className="gap-2">
            <Text className="text-lg">Bienvenido, {user.name}!</Text>
            <Text className="text-gray-600">{user.email}</Text>
          </VStack>
        )}
        
        <Button 
          variant="outline" 
          action="negative"
          onPress={logout}
          className="mt-8"
        >
          <ButtonText>Cerrar Sesión</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}; 