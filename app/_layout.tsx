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
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen
          name="workouts/new"
          options={{
            presentation: 'formSheet',
            title: 'New Workout',
            sheetGrabberVisible: true,
            sheetAllowedDetents: [0.5, 1],
          }}
        />
        <Stack.Screen
          name="workouts/[id]"
          options={{
            title: 'Workout',
          }}
        />
        <Stack.Screen
          name="workouts/[id]/add-exercise"
          options={{
            presentation: 'formSheet',
            title: 'Add Exercise',
            sheetGrabberVisible: true,
            sheetAllowedDetents: [0.6, 1],
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
