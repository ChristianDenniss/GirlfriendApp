import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppStateProvider } from '@/state/AppState';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    FredokaRegular: require('../assets/fonts/Fredoka/static/Fredoka-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppStateProvider>
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: '#4B0082' }, // Hardcoded consistent purple background
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="create-module" options={{ title: 'Create New List', headerStyle: { backgroundColor: '#4B0082' }, headerTintColor: '#FFFFFF' }} />
          <Stack.Screen name="module-view" options={{ title: 'List Details', headerStyle: { backgroundColor: '#4B0082' }, headerTintColor: '#FFFFFF' }} />
          <Stack.Screen name="edit-module" options={{ title: 'Edit List', headerStyle: { backgroundColor: '#4B0082' }, headerTintColor: '#FFFFFF' }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="light" />
      </AppStateProvider>
    </GestureHandlerRootView>
  );
}
