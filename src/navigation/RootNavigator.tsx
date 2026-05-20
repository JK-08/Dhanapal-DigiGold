// src/navigation/RootNavigator.tsx

import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import * as Screens from './index';
import { useTheme } from '../theme';
import BottomTabNavigator from './BottomTabNavigator';

import RegisterScreen from '../screens/register/RegisterScreen';
import RegisterOTPVerifyScreen from '../screens/register/RegisterOTPVerifyScreen';
import LoginScreen from '../screens/login/LoginScreen';
import EnterMobileScreen from '../screens/ForgotPassword/EnterMobileScreen';
import VerifyOTPScreen from '../screens/ForgotPassword/VerifyOTPScreen';
import GoogleContactUpdateScreen from '../screens/googlelogin/GoogleContactUpdateScreen';
import GoogleContactVerifyOTPScreen from '../screens/googlelogin/GoogleContactVerifyOTPScreen';
import CreateMpinScreen from '../screens/mpin/CreateMpinScreen';
import VerifyMpinScreen from '../screens/mpin/VerifyMpinScreen';
import ForgotAndVerifyMpinScreen from '../screens/mpin/ForgotAndVerifyMpinScreen';
import ResetMpinScreen from '../screens/mpin/ResetMpinScreen';
import ComponentsUsageScreen from "../screens/ComponentsUsage/ComponentsUsageScreen"

import { AsyncStorageHelper } from '../utils/AsyncStorageHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type RootStackParamList = {
  Onboarding:              undefined;
  Register:                undefined;
  RegisterOTPVerify:       { contactNumber: string };
  Login:                   undefined;
  ForgotPassword:          undefined;
  ForgotVerifyOTP:         { contactNumber: string };
  GoogleContactUpdate:     { userId: number };
  GoogleContactVerifyOTP:  { newContactNumber: string };
  CreateMpin:              undefined;
  MpinLogin:               undefined;
  ForgotMpin:              undefined;
  ResetMpin:               undefined;
  ComponentsUsage:         undefined;
  Main:                    undefined;
};

type InitialRoute = 'Onboarding' | 'Register' | 'Login' | 'CreateMpin' | 'MpinLogin' | 'Main';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { COLORS, isDark } = useTheme();
  const [initialRoute, setInitialRoute] = useState<InitialRoute | null>(null);
// AsyncStorage.clear(); // TEMP: Clear storage on every app start for testing purposes. Remove this line in production.
  useEffect(() => {
    (async () => {
      const onboarded = await AsyncStorageHelper.isOnboarded();
      const token     = await AsyncStorageHelper.getToken();
      const user      = await AsyncStorageHelper.getUser();
      const mpinSet   = await AsyncStorageHelper.isMpinSet();

      if (!onboarded)        setInitialRoute('Onboarding');  // first time
      else if (!user)        setInitialRoute('Register');    // never registered
      else if (!token)       setInitialRoute('Login');       // logged out
      else if (!mpinSet)     setInitialRoute('CreateMpin'); // logged in, no MPIN
      else                   setInitialRoute('MpinLogin');  // fully set up
    })();
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
        <Stack.Screen name="Onboarding"        component={Screens.OnboardingScreen} />
        <Stack.Screen name="Register"           component={RegisterScreen} />
        <Stack.Screen name="RegisterOTPVerify"  component={RegisterOTPVerifyScreen} />
        <Stack.Screen name="Login"              component={LoginScreen} />
        <Stack.Screen name="ForgotPassword"          component={EnterMobileScreen} />
        <Stack.Screen name="ForgotVerifyOTP"           component={VerifyOTPScreen} />
        <Stack.Screen name="GoogleContactUpdate"       component={GoogleContactUpdateScreen} />
        <Stack.Screen name="GoogleContactVerifyOTP"    component={GoogleContactVerifyOTPScreen} />
        <Stack.Screen name="CreateMpin"                component={CreateMpinScreen} />
        <Stack.Screen name="MpinLogin"                 component={VerifyMpinScreen} />
        <Stack.Screen name="ForgotMpin"                component={ForgotAndVerifyMpinScreen} />
        <Stack.Screen name="ResetMpin"                 component={ResetMpinScreen} />
        <Stack.Screen name="ComponentsUsage"          component={ComponentsUsageScreen} />
        <Stack.Screen name="Main"                      component={BottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
