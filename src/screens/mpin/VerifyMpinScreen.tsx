// src/screens/mpin/VerifyMpinScreen.tsx

import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../theme/theme';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { verifyMpin } from '../../store/mpinSlice';
import { RootStackParamList } from '../../navigation/RootNavigator';
import AppPinInput, { AppPinInputRef } from '../../components/ui/appcomponents/AppPinInput';
import AppLoader from '../../components/ui/appcomponents/AppLoader';
import ScreenWrapper from '../../components/ui/appcomponents/ScreenWrapper';
import { useToast } from '../../components/ui/Toast';
import AppHeader from '../../components/ui/appcomponents/AppHeader';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function VerifyMpinScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch   = useAppDispatch();
  const { loading } = useAppSelector((s) => s.mpin);
  const user        = useAppSelector((s) => s.auth.user);
  const toast       = useToast();

  const pinRef = useRef<AppPinInputRef>(null);
  const [pinError, setPinError]   = useState(false);
  const [pinErrMsg, setPinErrMsg] = useState('');

  const handleComplete = async (value: string) => {
    const res = await dispatch(verifyMpin(value));
    if (verifyMpin.fulfilled.match(res)) {
      toast.success('Welcome!', { message: `Hello, ${user?.username ?? 'User'}` });
      navigation.replace('Main');
    } else {
      setPinError(true);
      setPinErrMsg(res.payload as string);
      pinRef.current?.clear();
    }
  };

  return (
    <ScreenWrapper edges={['top', 'bottom']}>
      <AppLoader visible={loading} message="Verifying..." />
      <AppHeader title="Verify MPIN" variant="white" />
      <View style={styles.content}>

        {/* Brand + greeting */}
        <View style={styles.header}>
          <Text style={styles.brand}>✦ DigiGold</Text>
          <Text style={styles.title}>Enter MPIN</Text>
          <Text style={styles.subtitle}>
            Welcome back,{' '}
            <Text style={styles.name}>{user?.username ?? 'User'}</Text>
          </Text>
        </View>

        {/* PIN input with keypad */}
        <View style={styles.card}>
          <AppPinInput
            ref={pinRef}
            length={4}
            hint="Enter your 4-digit MPIN"
            variant="dots"
            showKeypad
            autoFocus
            error={pinError}
            errorMessage={pinErrMsg}
            disabled={loading}
            onChangeText={() => { setPinError(false); setPinErrMsg(''); }}
            onComplete={handleComplete}
          />
        </View>

        {/* Footer links */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotMpin')} activeOpacity={0.7}>
            <Text style={styles.forgotText}>Forgot MPIN?</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
            <Text style={styles.loginText}>Use Password Login</Text>
          </TouchableOpacity> */}
        </View>

      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: SIZES.padding.xl,
    paddingTop:        SIZES.xl,
    paddingBottom:     SIZES.lg,
    justifyContent:    'flex-start',
    alignItems:        'center',
    gap:               SIZES.xl,
  },
  header: { alignItems: 'center', gap: 2 },
  brand: {
    fontFamily:    FONTS.family.bold,
    fontSize:      SIZES.font.xl,
    color:         COLORS.secondary,
    letterSpacing: 1,
    marginBottom:  SIZES.xs,
  },
  title: {
    fontFamily:    FONTS.family.bold,
    fontSize:      SIZES.heading.h3,
    color:         COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: FONTS.family.regular,
    fontSize:   SIZES.font.sm,
    color:      COLORS.textSecondary,
  },
  name: {
    fontFamily: FONTS.family.semiBold,
    color:      COLORS.textPrimary,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius:    SIZES.radius.xl,
    padding:         SIZES.padding.xl,
    width:           '100%',
    alignItems:      'center',
    ...SHADOWS.md,
  },
  footer: {
    alignItems: 'center',
    gap:        SIZES.md,
  },
  forgotText: {
    fontFamily: FONTS.family.semiBold,
    fontSize:   SIZES.font.md,
    color:      COLORS.primary,
  },
  loginText: {
    fontFamily:         FONTS.family.regular,
    fontSize:           SIZES.font.sm,
    color:              COLORS.textTertiary,
    textDecorationLine: 'underline',
  },
});
