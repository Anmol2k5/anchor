import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { AnchorProvider } from '@/context/AnchorContext';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="grounding" options={{ headerShown: false, animation: 'fade' }} />
      <Stack.Screen name="audio" options={{ headerShown: false }} />
      <Stack.Screen name="log" options={{ headerShown: false }} />
      <Stack.Screen name="chat" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    let isMounted = true;

    async function hideSplash() {
      if (!isMounted) return;
      try {
        await SplashScreen.hideAsync();
      } catch (err) {
        console.warn('Failed to hide splash screen:', err);
      }
    }

    // Immediate hide once fonts resolve (or error out)
    if (fontsLoaded || fontError) {
      hideSplash();
    } else {
      // Fallback: force-hide after 5s in case useFonts never resolves
      const timeout = setTimeout(hideSplash, 5000);
      return () => {
        isMounted = false;
        clearTimeout(timeout);
      };
    }

    return () => {
      isMounted = false;
    };
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <AnchorProvider>
                <RootLayoutNav />
              </AnchorProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
