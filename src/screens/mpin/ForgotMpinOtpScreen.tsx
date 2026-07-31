// src/screens/mpin/ForgotMpinOtpScreen.tsx
// Step 2 of 3 — Forgot MPIN flow: enter the OTP sent to the registered mobile.

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useOtpVerify, removeListener } from 'react-native-otp-verify';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../theme/theme';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { forgotMpinSendOtp } from '../../store/mpinSlice';
import { RootStackParamList } from '../../navigation/RootNavigator';
import AppOTPInput, { AppOTPInputRef } from '../../components/ui/appcomponents/AppOTPInput';
import AppButton from '../../components/ui/appcomponents/AppButton';
import AppHeader from '../../components/ui/appcomponents/AppHeader';
import { useToast } from '../../components/ui/Toast';
import { AsyncStorageHelper } from '../../utils/AsyncStorageHelper';
import { maskMobile } from './mpinHelpers';
import StepIndicator from './StepIndicator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ForgotMpinOtpScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch    = useAppDispatch();
  const { loading } = useAppSelector((s) => s.mpin);
  const toast = useToast();

  const otpRef = useRef<AppOTPInputRef>(null);

  const [mobile, setMobile]           = useState('');
  const [otpCode, setOtpCode]         = useState('');
  const [otpError, setOtpError]       = useState(false);
  const [otpErrMsg, setOtpErrMsg]     = useState('');
  const [autoDetecting, setAutoDetecting] = useState(Platform.OS === 'android');

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorageHelper.getContactNumber();
      if (stored) setMobile(stored);
    })();
  }, []);

  const maskedMobile = mobile ? maskMobile(mobile) : '';

  // ── Auto OTP read ─────────────────────────────────────────────
  const { otp: smsOtp } = useOtpVerify({ numberOfDigits: 6 });

  useEffect(() => {
    if (!smsOtp) return;
    const digits = smsOtp.replace(/\D/g, '').slice(0, 6);
    if (digits.length === 6) {
      otpRef.current?.clear();
      setOtpCode(digits);
      setOtpError(false);
      setAutoDetecting(false);
    }
  }, [smsOtp]);

  useEffect(() => { return () => { removeListener(); }; }, []);

  const handleResend = async () => {
    otpRef.current?.clear();
    setOtpCode('');
    setOtpError(false);
    setOtpErrMsg('');
    setAutoDetecting(Platform.OS === 'android');
    const res = await dispatch(forgotMpinSendOtp());
    if (forgotMpinSendOtp.fulfilled.match(res)) {
      toast.success('OTP Resent!', { message: 'Check your registered mobile' });
    } else {
      toast.error('Failed', { message: res.payload as string });
    }
  };

  const handleContinue = () => {
    if (otpCode.length < 6) { setOtpError(true); setOtpErrMsg('Enter the 6-digit OTP'); return; }
    setOtpError(false);
    navigation.navigate('ForgotMpinNewPin', { otp: otpCode });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surfacePage }} edges={['bottom']}>
      <AppHeader title="Verify OTP" showBack />
      <View style={styles.content}>
        {/* <StepIndicator activeIndex={1} /> */}

        <View style={styles.header}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            {maskedMobile ? `Enter the 6-digit code sent to +91 ${maskedMobile}.` : 'Enter the OTP sent to your mobile.'}
          </Text>
        </View>

        <View style={styles.card}>
          {autoDetecting && (
            <View style={styles.autoDetectRow}>
              <Text style={styles.autoDetectText}>📲 Waiting for SMS auto-detection...</Text>
            </View>
          )}
          <AppOTPInput
            ref={otpRef}
            length={6}
            label="Enter OTP"
            hint="6-digit verification code"
            autoFocus
            value={otpCode}
            error={otpError}
            errorMessage={otpErrMsg}
            onComplete={(code) => { setOtpCode(code); setOtpError(false); }}
            onResend={handleResend}
            resendCountdown={30}
          />
        </View>

        <View style={styles.footerRow}>
          <View style={{ flex: 1 }}>
            <AppButton
              label="Back"
              onPress={() => navigation.goBack()}
              variant="outline"
              size="lg"
            />
          </View>
          <View style={{ flex: 2 }}>
            <AppButton
              label="Continue"
              onPress={handleContinue}
              loading={loading}
              disabled={otpCode.length < 6}
              size="lg"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: SIZES.padding.xl, paddingTop: SIZES.lg, gap: SIZES.xl },
  header:  { gap: 8 },
  title: {
    fontFamily: FONTS.family.bold,
    fontSize:   SIZES.heading.h3,
    color:      COLORS.contentPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: FONTS.family.regular,
    fontSize:   SIZES.font.sm,
    color:      COLORS.contentSecondary,
    lineHeight: 22,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius:    SIZES.radius.xl,
    padding:         SIZES.padding.xl,
    alignItems:      'center',
    ...SHADOWS.md,
  },
  autoDetectRow: {
    backgroundColor: COLORS.brandTint,
    borderRadius:    SIZES.radius.sm,
    paddingHorizontal: SIZES.padding.md,
    paddingVertical:   SIZES.padding.sm,
    alignItems: 'center',
    marginBottom: SIZES.md,
    width: '100%',
  },
  autoDetectText: {
    fontFamily: FONTS.family.regular,
    fontSize:   SIZES.font.xs,
    color:      COLORS.brandStrong,
  },
  footerRow: { flexDirection: 'row', gap: SIZES.md },
});
