import React, { useEffect, useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './app/context/AuthContext';
import RootNavigator from './app/navigation/RootNavigator';
import { useCustomFonts } from './app/config/fonts';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { loading } = useAuth();
  const [appIsReady, setAppIsReady] = useState(false);
  const splashHidden = useRef(false);

  // Load custom fonts (when added)
  const [fontsLoaded, fontError] = useCustomFonts();

  useEffect(() => {
    async function prepare() {
      try {
        // Wait for fonts to load (if custom fonts are added)
        // If no custom fonts, fontsLoaded will be true immediately
        if (fontError) {
          console.warn('Font loading error:', fontError);
        }

        // Minimal delay for smooth startup
        // App will show auth screens quickly
        await new Promise(resolve => setTimeout(resolve, 300));
        setAppIsReady(true);
      } catch (e) {
        console.warn('Error preparing app:', e);
        setAppIsReady(true); // Still mark as ready even on error
      }
    }

    // Wait for fonts to load (if custom fonts are configured)
    // If no custom fonts, fontsLoaded will be true immediately
    if (fontsLoaded) {
      prepare();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    // Hide splash screen when app is ready
    // Don't wait for auth check - show auth screens immediately
    if (appIsReady && !splashHidden.current) {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        hideSplashScreen();
      }, 100);
    }
  }, [appIsReady]);

  const hideSplashScreen = async () => {
    if (splashHidden.current) return; // Prevent multiple calls

    try {
      splashHidden.current = true;
      // Small delay to ensure smooth transition
      await new Promise(resolve => setTimeout(resolve, 100));
      await SplashScreen.hideAsync();
    } catch (e) {
      console.warn('Error hiding splash screen:', e);
      splashHidden.current = false; // Reset on error to allow retry
    }
  };

  // Show nothing while initializing (splash screen is still visible)
  // Don't wait for auth loading - show auth screens immediately
  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView className="flex-1 bg-white">
        <StatusBar style="auto" />
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
