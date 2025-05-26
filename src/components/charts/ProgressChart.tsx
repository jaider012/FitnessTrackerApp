import React from 'react';
import { View, Text as RNText } from 'react-native';
import { Box, Text } from '../../../components/ui/';

interface ProgressChartProps {
  data: Array<{ x: string; y: number }>;
  title: string;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data, title }) => {
  return (
    <Box className="bg-gray-50 p-4 rounded-lg m-2">
      <Text className="font-bold mb-2 text-center">
        {title}
      </Text>
      <View className="h-48 items-center justify-center bg-gray-100 rounded">
        <RNText className="text-gray-500">
          Gráfico de progreso (Victory Native pendiente)
        </RNText>
      </View>
    </Box>
  );
}; 