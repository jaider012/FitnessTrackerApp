import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginScreen = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });
  const login = useAuthStore((s) => s.login);

  const onSubmit = (data: LoginForm) => {
    // Simulación de login
    login({ id: '1', email: data.email, name: 'Demo User' });
  };

  return (
    <Box flex={1} bg="$backgroundLight0" p="$6">
      <VStack space="md" mt="$20">
        <Text size="2xl" fontWeight="$bold" textAlign="center">
          Iniciar Sesión
        </Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input variant="outline" size="lg">
              <InputField
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Input>
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <Input variant="outline" size="lg">
              <InputField
                placeholder="Contraseña"
                value={value}
                onChangeText={onChange}
                secureTextEntry
              />
            </Input>
          )}
        />
        <Button size="lg" onPress={handleSubmit(onSubmit)}>
          <ButtonText>Entrar</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}; 