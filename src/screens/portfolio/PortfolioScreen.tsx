import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

export default function PortfolioScreen() {
  const { COLORS, FONTS, SIZES } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: COLORS.surfacePage }]}>
      <Text style={{ fontFamily: FONTS.family.bold, fontSize: SIZES.font.xl, color: COLORS.contentPrimary }}>
        Portfolio
      </Text>
      <Text style={{ fontFamily: FONTS.family.regular, fontSize: SIZES.font.sm, color: COLORS.contentSecondary, marginTop: 8 }}>
        Your gold portfolio will appear here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
