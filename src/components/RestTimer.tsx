import React from 'react';
import { Pressable, View, Animated } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Text,
} from '../../components/ui/';
import { useTimerStore } from '../store/timerStore';
import { theme } from '../constants/theme';

export const RestTimer = () => {
  const { timer, startTimer, pauseTimer, resumeTimer, stopTimer } = useTimerStore();
  const progressAnimation = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (timer.isActive && timer.duration > 0) {
      Animated.timing(progressAnimation, {
        toValue: timer.remaining / timer.duration,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }
  }, [timer.remaining, timer.duration, timer.isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    const percentage = timer.remaining / timer.duration;
    if (percentage > 0.5) return theme.colors.success;
    if (percentage > 0.25) return theme.colors.warning;
    return theme.colors.error;
  };

  if (!timer.isActive && timer.remaining === 0) {
    return null;
  }

  const progressWidth = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Box 
      className="absolute bottom-24 left-4 right-4 z-50"
      style={[theme.shadows.lg, { backgroundColor: 'rgba(0,0,0,0.9)' }]}
    >
      <Box className="rounded-2xl overflow-hidden">
        {/* Progress Bar */}
        <View className="absolute top-0 left-0 right-0 h-1 bg-gray-800">
          <Animated.View
            style={{
              width: progressWidth,
              height: '100%',
              backgroundColor: getTimerColor(),
            }}
          />
        </View>

        <VStack className="p-4 gap-3">
          {/* Header */}
          <HStack className="justify-between items-center">
            <HStack className="items-center gap-2">
              <View className="w-2 h-2 rounded-full bg-green-500" />
              <Text className="font-semibold text-white">
                Tiempo de Descanso
              </Text>
            </HStack>
            <Pressable 
              onPress={stopTimer}
              className="p-1"
            >
              <Text className="text-gray-400 text-lg">×</Text>
            </Pressable>
          </HStack>

          {/* Timer Display */}
          <VStack className="items-center gap-4">
            <Text className="text-5xl font-bold text-white">
              {formatTime(timer.remaining)}
            </Text>
            
            {/* Controls */}
            <HStack className="gap-4">
              <Pressable
                onPress={() => startTimer(Math.max(0, timer.remaining - 15))}
                className="bg-gray-800 rounded-full px-4 py-2"
              >
                <Text className="text-white font-medium">-15s</Text>
              </Pressable>

              <Pressable
                onPress={timer.isActive ? pauseTimer : resumeTimer}
                className="bg-blue-500 rounded-full px-6 py-2"
              >
                <Text className="text-white font-semibold">
                  {timer.isActive ? 'Pausar' : 'Reanudar'}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => startTimer(timer.remaining + 15)}
                className="bg-gray-800 rounded-full px-4 py-2"
              >
                <Text className="text-white font-medium">+15s</Text>
              </Pressable>
            </HStack>

            {/* Skip Button */}
            <Pressable
              onPress={stopTimer}
              className="mt-2"
            >
              <Text className="text-gray-400 text-sm">
                Saltar descanso →
              </Text>
            </Pressable>
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
}; 