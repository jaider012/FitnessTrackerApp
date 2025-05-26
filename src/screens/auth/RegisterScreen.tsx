import React from 'react';
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
} from '../../../components/ui';
import { useAuthStore } from '../../store/authStore';
import { RegisterForm } from '../../types';

const registerSchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'Mínimo 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export const RegisterScreen = () => {
  const navigation = useNavigation();
  const { control, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });
  const { register, isLoading } = useAuthStore();

  const onSubmit = async (data: RegisterForm) => {
    try {
      await register(data.name, data.email, data.password);
    } catch (error) {
      console.error('Register error:', error);
      // TODO: Show error toast
    }
  };

  return (
    <Box className="flex-1 bg-white p-6 justify-center">
      <VStack className="gap-6 items-center">
        <Text className="text-3xl font-bold text-center mb-8">
          Crear Cuenta
        </Text>
        
        <VStack className="gap-4 w-full">
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value, onBlur } }) => (
              <Input variant="outline" size="lg">
                <InputField
                  placeholder="Nombre completo"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                />
              </Input>
            )}
          />
          {errors.name && (
            <Text className="text-red-500 text-sm">{errors.name.message}</Text>
          )}

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

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value, onBlur } }) => (
              <Input variant="outline" size="lg">
                <InputField
                  placeholder="Contraseña"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                />
              </Input>
            )}
          />
          {errors.password && (
            <Text className="text-red-500 text-sm">{errors.password.message}</Text>
          )}

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value, onBlur } }) => (
              <Input variant="outline" size="lg">
                <InputField
                  placeholder="Confirmar contraseña"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                />
              </Input>
            )}
          />
          {errors.confirmPassword && (
            <Text className="text-red-500 text-sm">{errors.confirmPassword.message}</Text>
          )}

          <Button 
            size="lg" 
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="mt-4"
          >
            <ButtonText>
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </ButtonText>
          </Button>

          <Pressable 
            onPress={() => navigation.navigate('Login' as never)}
            className="items-center mt-6"
          >
            <Text className="text-blue-500">
              ¿Ya tienes cuenta? Inicia sesión aquí
            </Text>
          </Pressable>
        </VStack>
      </VStack>
    </Box>
  );
}; 