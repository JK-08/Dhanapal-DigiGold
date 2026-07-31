// src/screens/mpin/StepIndicator.tsx
// Small 3-dot progress indicator shared by the Forgot-MPIN screens
// (Mobile → OTP → New MPIN). Self-contained styling so it can't be
// affected by the parent screen's own StyleSheet.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, FONTS } from '../../theme/theme';

const LABELS = ['Mobile', 'OTP', 'New MPIN'] as const;

export default function StepIndicator({ activeIndex }: { activeIndex: 0 | 1 | 2 }) {
  return (
    <View style={s.row}>
      {LABELS.map((label, i) => {
        const isDone   = i < activeIndex;
        const isActive = i === activeIndex;
        return (
          <React.Fragment key={label}>
            <View style={s.item}>
              <View style={[
                s.dot,
                {
                  backgroundColor: isDone || isActive ? COLORS.brand : COLORS.gray100,
                  borderColor:     isDone || isActive ? COLORS.brand : COLORS.borderStrong,
                },
              ]}>
                {isDone ? (
                  <Ionicons name="checkmark" size={13} color={COLORS.white} />
                ) : (
                  <Text style={[s.dotText, { color: isActive ? COLORS.white : COLORS.contentMuted }]}>{i + 1}</Text>
                )}
              </View>
              <Text style={[s.label, { color: isActive ? COLORS.contentPrimary : COLORS.contentMuted }]}>{label}</Text>
            </View>
            {i < LABELS.length - 1 && (
              <View style={[s.connector, { backgroundColor: i < activeIndex ? COLORS.brand : COLORS.borderStrong }]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  row:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  item: { alignItems: 'center', gap: 6, width: 72 },
  dot: {
    width: 26, height: 26, borderRadius: 13, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  dotText:    { fontFamily: FONTS.family.bold, fontSize: 12 },
  label:      { fontFamily: FONTS.family.medium, fontSize: 11 },
  connector:  { flex: 1, height: 2, marginBottom: 18, marginHorizontal: -8 },
});
