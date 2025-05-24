import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GluestackUIProvider } from './components/ui/gluestack-ui-provider';
import './global.css';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <GluestackUIProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
