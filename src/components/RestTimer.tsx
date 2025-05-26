import React from 'react';
import { Pressable } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  ButtonText,
} from '../../components/ui/';
import { useTimerStore } from '../store/timerStore';

export const RestTimer = () => {
  const { timer, startTimer, pauseTimer, resumeTimer, stopTimer } = useTimerStore();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    const percentage = timer.remaining / timer.duration;
    if (percentage > 0.5) return 'text-green-600';
    if (percentage > 0.25) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!timer.isActive && timer.remaining === 0) {
    return null;
  }

  return (
    <Box className="absolute bottom-20 left-4 right-4 z-50">
      <Box className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <VStack className="gap-3">
          <HStack className="justify-between items-center">
            <Text className="font-medium text-gray-700">
              Descanso
            </Text>
            <Pressable onPress={stopTimer}>
              <Text className="text-red-500 text-sm">✕</Text>
            </Pressable>
          </HStack>

          <VStack className="items-center gap-2">
            <Text className={`text-3xl font-bold ${getTimerColor()}`}>
              {formatTime(timer.remaining)}
            </Text>
            
            <HStack className="gap-2">
              {timer.isActive ? (
                <Button size="sm" onPress={pauseTimer} variant="outline">
                  <ButtonText>Pausar</ButtonText>
                </Button>
              ) : (
                <Button size="sm" onPress={resumeTimer}>
                  <ButtonText>Reanudar</ButtonText>
                </Button>
              )}
              
              <Button size="sm" onPress={stopTimer} variant="outline">
                <ButtonText>Terminar</ButtonText>
              </Button>
            </HStack>
          </VStack>

          {/* Quick time adjustments */}
          <HStack className="justify-center gap-2">
            <Pressable 
              onPress={() => startTimer(timer.remaining + 30)}
              className="px-2 py-1 bg-gray-100 rounded"
            >
              <Text className="text-xs text-gray-600">+30s</Text>
            </Pressable>
            <Pressable 
              onPress={() => startTimer(Math.max(0, timer.remaining - 30))}
              className="px-2 py-1 bg-gray-100 rounded"
            >
              <Text className="text-xs text-gray-600">-30s</Text>
            </Pressable>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
}; 