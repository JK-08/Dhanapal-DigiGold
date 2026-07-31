// src/screens/mpin/ForgotMpinNewPinScreen.tsx
// Step 3 of 3 — Forgot MPIN flow: set the new 4-digit MPIN and submit (with the
// OTP collected on the previous screen) to complete the reset.

import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../theme/theme';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { forgotMpinVerify } from '../../store/mpinSlice';
import { RootStackParamList } from '../../navigation/RootNavigator';
import AppPinInput, { AppPinInputRef } from '../../components/ui/appcomponents/AppPinInput';
import AppButton from '../../components/ui/appcomponents/AppButton';
import AppHeader from '../../components/ui/appcomponents/AppHeader';
import { useToast } from '../../components/ui/Toast';
import StepIndicator from './StepIndicator';

type Nav   = NativeStackNavigationProp<RootStackParamList>;
type Rte   = RouteProp<RootStackParamList, 'ForgotMpinNewPin'>;

export default function ForgotMpinNewPinScreen() {
  const navigation = useNavigation<Nav>();
  const { params }  = useRoute<Rte>();
  const dispatch     = useAppDispatch();
  const { loading }  = useAppSelector((s) => s.mpin);
  const toast = useToast();

  const pinRef = useRef<AppPinInputRef>(null);
  const [newMpin, setNewMpin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [pinErrMsg, setPinErrMsg] = useState('Please enter 4 digits');

  const handleReset = async () => {
    if (newMpin.length < 4) { setPinError(true); return; }

    const res = await dispatch(forgotMpinVerify({ otp: params.otp, newMpin }));
    if (forgotMpinVerify.fulfilled.match(res)) {
      toast.success('MPIN Reset!', { message: 'Login with your new MPIN' });
      navigation.replace('MpinLogin');
    } else {
      const msg = res.payload as string;
      toast.error('Failed', { message: msg });
      // Likely an invalid/expired OTP — send the user back to re-enter it.
      pinRef.current?.clear();
      setNewMpin('');
      setPinError(true);
      setPinErrMsg(msg || 'Something went wrong — please try again');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }} edges={['bottom']}>
      <AppHeader title="Set New MPIN" showBack />
      <View style={styles.content}>
        {/* <StepIndicator activeIndex={2} /> */}

        <View style={styles.header}>
          <Text style={styles.title}>Set New MPIN</Text>
          <Text style={styles.subtitle}>Choose a new 4-digit MPIN for your account.</Text>
        </View>

        <View style={styles.card}>
          <AppPinInput
            ref={pinRef}
            length={4}
            label="New MPIN"
            hint="Set your new 4-digit PIN"
            variant="dots"
            showKeypad
            autoFocus
            error={pinError}
            errorMessage={pinErrMsg}
            onChangeText={(v) => { setNewMpin(v); setPinError(false); }}
            onComplete={(v) => setNewMpin(v)}
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
              label="Reset MPIN"
              onPress={handleReset}
              loading={loading}
              disabled={newMpin.length < 4}
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
  footerRow: { flexDirection: 'row', gap: SIZES.md },
});
