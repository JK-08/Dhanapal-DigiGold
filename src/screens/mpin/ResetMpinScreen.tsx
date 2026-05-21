// src/screens/mpin/ResetMpinScreen.tsx

import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../theme/theme';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { resetMpin } from '../../store/mpinSlice';
import { RootStackParamList } from '../../navigation/RootNavigator';
import AppPinInput, { AppPinInputRef } from '../../components/ui/appcomponents/AppPinInput';
import AppButton from '../../components/ui/appcomponents/AppButton';
import AppHeader from '../../components/ui/appcomponents/AppHeader';
import { useToast } from '../../components/ui/Toast';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ResetMpinScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch   = useAppDispatch();
  const { loading } = useAppSelector((s) => s.mpin);
  const toast = useToast();

  const oldRef = useRef<AppPinInputRef>(null);
  const newRef = useRef<AppPinInputRef>(null);

  const [oldMpin, setOldMpin]   = useState('');
  const [newMpin, setNewMpin]   = useState('');
  const [oldError, setOldError] = useState(false);
  const [newError, setNewError] = useState(false);

  const handleReset = async () => {
    if (oldMpin.length < 4) { setOldError(true); return; }
    if (newMpin.length < 4) { setNewError(true); return; }
    if (oldMpin === newMpin) {
      setNewError(true);
      toast.warning('Same MPIN', { message: 'New MPIN must be different from old MPIN' });
      return;
    }

    const res = await dispatch(resetMpin({ oldMpin, newMpin }));
    if (resetMpin.fulfilled.match(res)) {
      toast.success('MPIN Changed!', { message: 'Your MPIN has been updated' });
      navigation.goBack();
    } else {
      setOldError(true);
      toast.error('Failed', { message: res.payload as string });
      oldRef.current?.clear();
      setOldMpin('');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <AppHeader title="Change MPIN" showBack variant="white" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: SIZES.padding.xl, paddingTop: SIZES.lg, paddingBottom: 32 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Change Your MPIN</Text>
          <Text style={styles.subtitle}>Enter your current MPIN and set a new one</Text>
        </View>

        {/* Old MPIN */}
        <View style={styles.card}>
          <AppPinInput
            ref={oldRef}
            length={4}
            label="Current MPIN"
            hint="Enter your existing 4-digit PIN"
            variant="dots"
            showKeypad
            autoFocus
            error={oldError}
            errorMessage="Incorrect MPIN"
            onChangeText={(v) => { setOldMpin(v); setOldError(false); }}
            onComplete={(v) => setOldMpin(v)}
          />
        </View>

        {/* New MPIN */}
        <View style={styles.card}>
          <AppPinInput
            ref={newRef}
            length={4}
            label="New MPIN"
            hint="Set your new 4-digit PIN"
            variant="dots"
            showKeypad
            error={newError}
            errorMessage="Please enter 4 digits"
            onChangeText={(v) => { setNewMpin(v); setNewError(false); }}
            onComplete={(v) => setNewMpin(v)}
          />
        </View>

        <AppButton
          label="Change MPIN"
          onPress={handleReset}
          loading={loading}
          disabled={oldMpin.length < 4 || newMpin.length < 4}
          size="lg"
        />
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingTop: SIZES.xl, gap: SIZES.xl },
  header:  { gap: 6 },
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
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius:    SIZES.radius.xl,
    padding:         SIZES.padding.xl,
    alignItems:      'center',
    ...SHADOWS.md,
  },
});
