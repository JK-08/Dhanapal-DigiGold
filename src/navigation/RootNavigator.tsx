// src/navigation/RootNavigator.tsx

import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme';
import BottomTabNavigator from './BottomTabNavigator';

export type RootStackParamList = {
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { COLORS, isDark } = useTheme();

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

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.background } }}
      >
        <Stack.Screen name="Main" component={BottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
