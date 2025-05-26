import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigation } from '@react-navigation/native';
import { Pressable } from 'react-native';
import {
  Box,
  VStack,
  Text,
  Input,
  InputField,
  Button,
  ButtonText,
} from '../../../components/ui/';
import { useAuthStore } from '../../store/authStore';
import { ForgotPasswordForm } from '../../types';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [emailSent, setEmailSent] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const { forgotPassword, isLoading } = useAuthStore();

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      await forgotPassword(data.email);
      setEmailSent(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      // TODO: Show error toast
    }
  };

  if (emailSent) {
    return (
      <Box className="flex-1 bg-white p-6 justify-center">
        <VStack className="gap-6 items-center">
          <Text className="text-3xl font-bold text-center mb-8">
            Email Enviado
          </Text>
          
          <Text className="text-center text-gray-600 mb-8">
            Hemos enviado un enlace de recuperación a tu email. 
            Revisa tu bandeja de entrada y sigue las instrucciones.
          </Text>
          
          <Button 
            size="lg" 
            onPress={() => navigation.navigate('Login' as never)}
            className="w-full"
          >
            <ButtonText>Volver al Login</ButtonText>
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-white p-6 justify-center">
      <VStack className="gap-6 items-center">
        <Text className="text-3xl font-bold text-center mb-8">
          Recuperar Contraseña
        </Text>
        
        <Text className="text-center text-gray-600 mb-8">
          Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        
        <VStack className="gap-4 w-full">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value, onBlur } }) => (
              <Input variant="outline" size="lg">
                <InputField
                  placeholder="Email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </Input>
            )}
          />
          {errors.email && (
            <Text className="text-red-500 text-sm">{errors.email.message}</Text>
          )}

          <Button 
            size="lg" 
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="mt-4"
          >
            <ButtonText>
              {isLoading ? 'Enviando...' : 'Enviar Enlace'}
            </ButtonText>
          </Button>

          <Pressable 
            onPress={() => navigation.navigate('Login' as never)}
            className="items-center mt-6"
          >
            <Text className="text-blue-500">
              Volver al Login
            </Text>
          </Pressable>
        </VStack>
      </VStack>
    </Box>
  );
}; 