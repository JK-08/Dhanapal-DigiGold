// src/screens/mpin/ForgotMpinSendOtpScreen.tsx
// Step 1 of 3 — Forgot MPIN flow: confirm the registered mobile number and send an OTP.

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../theme/theme';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { forgotMpinSendOtp } from '../../store/mpinSlice';
import { RootStackParamList } from '../../navigation/RootNavigator';
import AppButton from '../../components/ui/appcomponents/AppButton';
import AppHeader from '../../components/ui/appcomponents/AppHeader';
import { useToast } from '../../components/ui/Toast';
import { AsyncStorageHelper } from '../../utils/AsyncStorageHelper';
import { maskMobile } from './mpinHelpers';
import StepIndicator from './StepIndicator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ForgotMpinSendOtpScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch    = useAppDispatch();
  const { loading } = useAppSelector((s) => s.mpin);
  const toast = useToast();

  const [mobile, setMobile] = useState('');

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorageHelper.getContactNumber();
      if (stored) setMobile(stored);
    })();
  }, []);

  const maskedMobile = mobile ? maskMobile(mobile) : '';

  const handleSendOtp = async () => {
    const res = await dispatch(forgotMpinSendOtp());
    if (forgotMpinSendOtp.fulfilled.match(res)) {
      toast.success('OTP Sent!', { message: 'Check your registered mobile' });
      navigation.navigate('ForgotMpinOtp');
    } else {
      toast.error('Failed', { message: res.payload as string });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }} edges={['bottom']}>
      <AppHeader title="Forgot MPIN" showBack/>
      <View style={styles.content}>
        {/* <StepIndicator activeIndex={0} /> */}

        <View style={styles.header}>
          <Text style={styles.title}>Reset Your MPIN</Text>
          <Text style={styles.subtitle}>We will send an OTP to your registered mobile number.</Text>
        </View>

        <View style={styles.card}>
          {!!maskedMobile && (
            <View style={styles.mobileRow}>
              <View style={styles.mobileIconWrap}>
                <Ionicons name="call-outline" size={18} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.mobileLabel}>OTP will be sent to</Text>
                <Text style={styles.mobileValue}>+91 {maskedMobile}</Text>
              </View>
            </View>
          )}
          <AppButton
            label="Send OTP to Mobile"
            onPress={handleSendOtp}
            loading={loading}
            size="lg"
            leftIcon="phone-portrait-outline"
          />
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
    color:      COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: FONTS.family.regular,
    fontSize:   SIZES.font.sm,
    color:      COLORS.textSecondary,
    lineHeight: 22,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius:    SIZES.radius.xl,
    padding:         SIZES.padding.xl,
    alignItems:      'center',
    ...SHADOWS.md,
  },
  mobileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.primaryPale,
    borderRadius: SIZES.radius.md,
    paddingHorizontal: SIZES.padding.md,
    paddingVertical: SIZES.padding.md,
    width: '100%',
    marginBottom: SIZES.lg,
  },
  mobileIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileLabel: {
    fontFamily: FONTS.family.regular,
    fontSize: SIZES.font.xs,
    color: COLORS.textSecondary,
  },
  mobileValue: {
    fontFamily: FONTS.family.bold,
    fontSize: SIZES.font.md,
    color: COLORS.textPrimary,
    marginTop: 2,
    letterSpacing: 0.3,
  },
});
