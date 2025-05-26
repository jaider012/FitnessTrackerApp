import React from 'react';
import { View } from 'react-native';
import { Box, VStack, HStack, Text } from '../../../components/ui/';
import { theme } from '../../constants/theme';

interface Stat {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: string;
}

interface StatDisplayProps {
  stats: Stat[];
  columns?: 2 | 3 | 4;
}

export const StatDisplay: React.FC<StatDisplayProps> = ({ stats, columns = 3 }) => {
  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '';
    }
  };

  const getTrendColor = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Box className="bg-white rounded-xl p-4" style={theme.shadows.sm}>
      <View className="flex-row flex-wrap -mx-2">
        {stats.map((stat, index) => (
          <View
            key={index}
            className={`px-2 mb-4 ${
              columns === 2 ? 'w-1/2' : columns === 3 ? 'w-1/3' : 'w-1/4'
            }`}
          >
            <VStack className="items-center">
              <Text className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                {stat.label}
              </Text>
              <HStack className="items-baseline gap-1">
                <Text
                  className="text-2xl font-bold"
                  style={{ color: stat.color || theme.colors.text.primary }}
                >
                  {stat.value}
                </Text>
                {stat.unit && (
                  <Text className="text-sm text-gray-500">{stat.unit}</Text>
                )}
              </HStack>
              {stat.trend && stat.trendValue && (
                <HStack className="items-center gap-1 mt-1">
                  <Text className={`text-xs font-medium ${getTrendColor(stat.trend)}`}>
                    {getTrendIcon(stat.trend)} {stat.trendValue}
                  </Text>
                </HStack>
              )}
            </VStack>
          </View>
        ))}
      </View>
    </Box>
  );
}; 