import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="routes/index" 
          options={{ title: 'Routes', headerBackTitle: 'Back' }} 
        />
        <Stack.Screen 
          name="routes/[id]" 
          options={{ title: 'Route Details', headerBackTitle: 'Back' }} 
        />
        <Stack.Screen 
          name="trips/index" 
          options={{ title: 'My Trips', headerBackTitle: 'Back' }} 
        />
        <Stack.Screen 
          name="trips/[id]" 
          options={{ title: 'Trip Details', headerBackTitle: 'Back' }} 
        />
        <Stack.Screen 
          name="trips/confirm" 
          options={{ title: 'Book Trip', headerBackTitle: 'Cancel' }} 
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
