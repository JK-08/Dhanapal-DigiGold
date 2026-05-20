// src/screens/login/LoginScreen.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../theme/theme';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser } from '../../store/authSlice';
import { AsyncStorageHelper } from '../../utils/AsyncStorageHelper';
import { RootStackParamList } from '../../navigation/RootNavigator';
import AppInput from '../../components/ui/appcomponents/AppInput';
import AppButton from '../../components/ui/appcomponents/AppButton';
import { useToast } from '../../components/ui/Toast';
import ScreenWrapper from '../../components/ui/appcomponents/ScreenWrapper';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch   = useAppDispatch();
  const { loading } = useAppSelector((s) => s.auth);
  const toast = useToast();

  const [form, setForm] = useState({ contactOrEmailOrUsername: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    <ScreenWrapper scroll paddingHorizontal={SIZES.padding.xl} paddingTop={SIZES.xxxl} paddingBottom={32}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brand}>✦ DigiGold</Text>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
      </View>

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
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

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

    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    gap: 6,
    marginBottom: SIZES.lg,
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
    fontSize: SIZES.heading.h2,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: FONTS.family.regular,
    fontSize: SIZES.font.sm,
    color: COLORS.textSecondary,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.xl,
    padding: SIZES.padding.xl,
    gap: SIZES.md,
    ...SHADOWS.md,
  },
  forgotRow: {
    alignSelf: 'flex-end',
    marginTop: -SIZES.xs,
  },
  forgotText: {
    fontFamily: FONTS.family.medium,
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
  },
  registerText: {
    fontFamily: FONTS.family.regular,
    fontSize: SIZES.font.sm,
    color: COLORS.textTertiary,
  },
  registerLink: {
    fontFamily: FONTS.family.semiBold,
    color: COLORS.primary,
  },
});
