// src/screens/login/LoginScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../theme/theme';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser, googleLogin } from '../../store/authSlice';
import { AsyncStorageHelper } from '../../utils/AsyncStorageHelper';
import { RootStackParamList } from '../../navigation/RootNavigator';
import AppInput from '../../components/ui/appcomponents/AppInput';
import AppButton from '../../components/ui/appcomponents/AppButton';
import { useToast } from '../../components/ui/Toast';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch   = useAppDispatch();
  const { loading } = useAppSelector((s) => s.auth);
  const toast = useToast();

  const [form, setForm] = useState({ contactOrEmailOrUsername: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '1038057958960-gg9fji7abv6php2ahfi6kf3ttmu33nea.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
      offlineAccess: true,
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken  = userInfo.data?.idToken;
      if (!idToken) { toast.error('Google Sign-In Failed', { message: 'No ID token received' }); return; }
      const res = await dispatch(googleLogin({ idToken }));
      if (googleLogin.fulfilled.match(res)) {
        const user = res.payload;
        await AsyncStorageHelper.saveUserSession(user);
        if (!user.contactNumber && user.id) {
          toast.info('One more step!', { message: 'Please add your mobile number' });
          navigation.navigate('GoogleContactUpdate', { userId: user.id, picture: user.picture });
        } else {
          toast.success('Welcome back!', { message: `Signed in as ${user.username ?? user.email}` });
          const mpinSet = await AsyncStorageHelper.isMpinSet();
          navigation.replace(mpinSet ? 'MpinLogin' : 'CreateMpin');
        }
      } else {
        toast.error('Google Sign-In Failed', { message: res.payload as string });
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) return;
      if (error.code === statusCodes.IN_PROGRESS) return;
      toast.error('Google Sign-In Failed', { message: error.message ?? 'Something went wrong' });
    } finally {
      setGoogleLoading(false);
    }
  };

  const set = (key: string, val: string) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.contactOrEmailOrUsername.trim()) e.contactOrEmailOrUsername = 'Mobile / Email / Username is required';
    if (!form.password)                        e.password                 = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    const res = await dispatch(loginUser({
      contactOrEmailOrUsername: form.contactOrEmailOrUsername.trim(),
      password: form.password,
    }));
    if (loginUser.fulfilled.match(res)) {
      const user = res.payload;
      await AsyncStorageHelper.saveUserSession(user);
      toast.success('Welcome back!', { message: `Hello, ${user.username ?? 'User'}` });
      const mpinSet = await AsyncStorageHelper.isMpinSet();
      navigation.replace(mpinSet ? 'MpinLogin' : 'CreateMpin');
    } else {
      toast.error('Login Failed', { message: res.payload as string });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
    <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

      {/* Branded Header */}
      <View style={styles.headerBg}>
        <View style={styles.headerInner}>
          <View style={styles.logoCircle}>
            <Ionicons name="shield-checkmark" size={32} color={COLORS.white} />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: SIZES.padding.xl, paddingTop: SIZES.lg }}>

      {/* Form Card */}
      <View style={styles.card}>
        <AppInput
          label="Mobile / Email / Username"
          placeholder="Enter mobile, email or username"
          leftIcon="person-outline"
          autoCapitalize="none"
          keyboardType="email-address"
          value={form.contactOrEmailOrUsername}
          onChangeText={(v) => set('contactOrEmailOrUsername', v)}
          error={errors.contactOrEmailOrUsername}
          required
        />
        <AppInput
          label="Password"
          placeholder="Enter password"
          leftIcon="lock-closed-outline"
          isPassword
          value={form.password}
          onChangeText={(v) => set('password', v)}
          error={errors.password}
          required
        />

        {/* Forgot Password */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          activeOpacity={0.7}
          style={styles.forgotRow}
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <AppButton
          label="Sign In"
          onPress={handleLogin}
          loading={loading}
          size="lg"
        />
      </View>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or continue with</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Google Sign In */}
      <TouchableOpacity
        style={styles.googleBtn}
        onPress={handleGoogleSignIn}
        activeOpacity={0.85}
        disabled={googleLoading}
      >
        <Ionicons name="logo-google" size={20} color={COLORS.error} />
        <Text style={styles.googleText}>
          {googleLoading ? 'Signing in...' : 'Continue with Google'}
        </Text>
      </TouchableOpacity>

      {/* Register */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
        activeOpacity={0.7}
        style={styles.registerBtn}
      >
        <Text style={styles.registerText}>
          Don't have an account?{'  '}
          <Text style={styles.registerLink}>Create Account</Text>
        </Text>
      </TouchableOpacity>

      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerBg: {
    backgroundColor: COLORS.primary,
    paddingTop: SIZES.md,
    paddingBottom: SIZES.lg,
    paddingHorizontal: SIZES.padding.xl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    ...SHADOWS.orange,
  },
  headerInner: {
    alignItems: 'center',
    gap: SIZES.sm,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.xs,
  },
  brand: {
    fontFamily: FONTS.family.bold,
    fontSize: SIZES.font.xl,
    color: COLORS.secondary,
    letterSpacing: 1,
    marginBottom: SIZES.xs,
  },
  title: {
    fontFamily: FONTS.family.bold,
    fontSize: SIZES.heading.h3,
    color: COLORS.white,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: FONTS.family.regular,
    fontSize: SIZES.font.md,
    color: COLORS.whiteOpacity70,
    marginBottom: SIZES.xs,
  },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius.xl,
    padding: SIZES.padding.xl,
    gap: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  forgotRow: {
    alignSelf: 'flex-end',
    marginTop: -SIZES.xs,
  },
  forgotText: {
    fontFamily: FONTS.family.semiBold,
    fontSize: SIZES.font.sm,
    color: COLORS.primary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
    marginVertical: SIZES.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontFamily: FONTS.family.regular,
    fontSize: SIZES.font.sm,
    color: COLORS.textTertiary,
  },
  registerBtn: {
    alignItems: 'center',
    marginTop: SIZES.md,
  },
  registerText: {
    fontFamily: FONTS.family.regular,
    fontSize: SIZES.font.md,
    color: COLORS.textTertiary,
  },
  registerLink: {
    fontFamily: FONTS.family.semiBold,
    color: COLORS.primary,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.sm,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    height: SIZES.button.height.lg,
    ...SHADOWS.sm,
  },
  googleText: {
    fontFamily: FONTS.family.semiBold,
    fontSize: SIZES.font.md,
    color: COLORS.textPrimary,
  },
});
