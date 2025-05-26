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
} from '../../../components/ui/';
import { useAuthStore } from '../../store/authStore';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginScreen = () => {
  const navigation = useNavigation();
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });
  const login = useAuthStore((s) => s.login);

  const onSubmit = async (data: LoginForm) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      login({ 
        id: '1', 
        email: data.email, 
        name: data.email.split('@')[0] 
      });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <Box className="flex-1 bg-white p-6 justify-center">
      <VStack className="gap-6 items-center">
        <Text className="text-3xl font-bold text-center mb-8">
          Fitness Tracker
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

          <Button 
            size="lg" 
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="mt-4"
          >
            <ButtonText>
              {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
            </ButtonText>
          </Button>

          <Pressable 
            onPress={() => navigation.navigate('Register' as never)}
            className="items-center mt-6"
          >
            <Text className="text-blue-500">
              ¿No tienes cuenta? Regístrate aquí
            </Text>
          </Pressable>
        </VStack>
      </VStack>
    </Box>
  );
}; 