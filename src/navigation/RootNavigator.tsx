// src/navigation/RootNavigator.tsx

import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';
import * as Screens from './index';
import { useTheme } from '../theme';
import BottomTabNavigator from './BottomTabNavigator';

const ONBOARDING_KEY = '@onboarding_complete';

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { COLORS, isDark } = useTheme();
  const [initialRoute, setInitialRoute] = useState<'Onboarding' | 'Main' | null>(null);

  useEffect(() => {
    AsyncStorage.clear(); // Clear AsyncStorage for testing purposes
    AsyncStorage.getItem(ONBOARDING_KEY).then(value => {
      setInitialRoute(value ? 'Main' : 'Onboarding');
    });
  }, []);

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary:      COLORS.primary,
      background:   COLORS.background,
      card:         COLORS.card,
      text:         COLORS.textPrimary,
      border:       COLORS.border,
      notification: COLORS.secondary,
    },
  };

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.background }, animation: 'fade' }}
      >
        <Stack.Screen name="Onboarding" component={Screens.OnboardingScreen} />
        <Stack.Screen name="Main" component={BottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
