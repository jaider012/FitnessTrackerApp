import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigation } from '@react-navigation/native';
import {
  Box,
  VStack,
  Text,
  Input,
  InputField,
  Button,
  ButtonText,
  Pressable,
  FormControl,
  FormControlError,
  FormControlErrorText,
} from '../../../components/ui';
import { useAuthStore } from '../../store/authStore';

const registerSchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'Mínimo 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export const RegisterScreen = () => {
  const navigation = useNavigation();
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });
  const login = useAuthStore((s) => s.login);

  const onSubmit = async (data: RegisterForm) => {
    try {
      // Simulación de registro con delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      login({ 
        id: Math.random().toString(), 
        email: data.email, 
        name: data.name 
      });
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  return (
    <Box className="flex-1 items-center justify-center bg-white p-6">
      <Text className="text-xl mb-4">Pantalla de Registro</Text>
      <Text className="text-gray-500">(próximamente)</Text>
    </Box>
  );
}; 