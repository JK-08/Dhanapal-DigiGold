// src/components/ui/LiveRateCard.tsx
//
// Floating "live gold/silver rate" card used under the app header (gold-app style).
// Fetches its own data from ratesService and animates in on mount.

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../theme';
import { ratesService } from '../../api/services/ratesService';
import { RatesResponse } from '../../types/Rates/Rates';

type Props = {
  onRatesPress?: (metal: 'Gold' | 'Silver') => void;
  style?: ViewStyle;
};

export default function LiveRateCard({ onRatesPress, style }: Props) {
  const { COLORS, FONTS, SIZES, SHADOWS, moderateScale } = useTheme();
  const GOLD_CLR   = COLORS.secondary;
  const SILVER_CLR = COLORS.gray400;

  const [rates, setRates] = useState<RatesResponse | null>(null);
  const [ratesLoading, setRatesLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    ratesService
      .getRates()
      .then((r) => { if (mounted) setRates(r); })
      .catch(() => {})
      .finally(() => { if (mounted) setRatesLoading(false); });
    return () => { mounted = false; };
  }, []);

  const gold   = rates?.gold;
  const silver = rates?.silver;
  const goldUp   = (gold?.changePct ?? 0) >= 0;
  const silverUp = (silver?.changePct ?? 0) >= 0;
  const fmtRate = (n?: number) => (n != null ? `₹${Math.round(n).toLocaleString('en-IN')}` : '—');
  const fmtPct  = (n?: number) => (n != null ? `${n >= 0 ? '+' : ''}${n.toFixed(2)}%` : '—');

  // Entrance animation
  const cardSlide = useRef(new Animated.Value(24)).current;
  const cardFade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.spring(cardSlide, { toValue: 0, useNativeDriver: true, damping: 16, stiffness: 130 }),
      Animated.timing(cardFade, { toValue: 1, duration: 320, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.wrap,
        { transform: [{ translateY: cardSlide }], opacity: cardFade },
        style,
      ]}
    >
      <View style={[styles.card, { backgroundColor: COLORS.card, ...SHADOWS.md }]}>
        <View style={styles.header}>
          <View style={styles.liveRow}>
            <View style={[styles.liveDot, { backgroundColor: COLORS.success }]} />
            <Text style={{
              fontFamily: FONTS.family.semiBold,
              fontSize: SIZES.font.xs,
              color: COLORS.textTertiary,
              letterSpacing: 0.6,
            }}>
              LIVE RATES
            </Text>
          </View>
          <Text style={{
            fontFamily: FONTS.family.regular,
            fontSize: SIZES.font.xs,
            color: COLORS.textDisabled,
          }}>
            {gold?.updatedAt ?? 'Today'}
          </Text>
        </View>

        <View style={styles.body}>
          {/* Gold */}
          <TouchableOpacity
            style={styles.item}
            activeOpacity={0.75}
            onPress={() => onRatesPress?.('Gold')}
          >
            <View style={[styles.iconWrap, { backgroundColor: GOLD_CLR + '18' }]}>
              <Ionicons name="diamond-outline" size={moderateScale(18)} color={GOLD_CLR} />
            </View>
            <View style={styles.info}>
              <Text style={{ fontFamily: FONTS.family.semiBold, fontSize: SIZES.font.xs, color: COLORS.textPrimary }}>
                Gold 91.6%
              </Text>
              {ratesLoading ? (
                <ActivityIndicator size="small" color={GOLD_CLR} style={{ marginTop: 3, alignSelf: 'flex-start' }} />
              ) : (
                <Text style={{ fontFamily: FONTS.family.bold, fontSize: SIZES.font.lg, color: COLORS.textPrimary }}>
                  {fmtRate(gold?.currentRate)}
                  <Text style={{ fontFamily: FONTS.family.regular, fontSize: SIZES.font.sm, color: COLORS.textTertiary }}>/g</Text>
                </Text>
              )}
            </View>
            {!ratesLoading && (
              <View style={styles.changeCol}>
                <Ionicons name={goldUp ? 'caret-up' : 'caret-down'} size={13} color={goldUp ? COLORS.success : COLORS.error} />
                <Text style={{ fontFamily: FONTS.family.medium, fontSize: SIZES.font.xs, color: goldUp ? COLORS.success : COLORS.error }}>
                  {fmtPct(gold?.changePct)}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: COLORS.borderLight }]} />

          {/* Silver */}
          <TouchableOpacity
            style={styles.item}
            activeOpacity={0.75}
            onPress={() => onRatesPress?.('Silver')}
          >
            <View style={[styles.iconWrap, { backgroundColor: SILVER_CLR + '18' }]}>
              <Ionicons name="ellipse-outline" size={moderateScale(18)} color={SILVER_CLR} />
            </View>
            <View style={styles.info}>
              <Text style={{ fontFamily: FONTS.family.semiBold, fontSize: SIZES.font.xs, color: COLORS.textPrimary }}>
                Silver 91.6%
              </Text>
              {ratesLoading ? (
                <ActivityIndicator size="small" color={SILVER_CLR} style={{ marginTop: 3, alignSelf: 'flex-start' }} />
              ) : (
                <Text style={{ fontFamily: FONTS.family.bold, fontSize: SIZES.font.lg, color: COLORS.textPrimary }}>
                  {fmtRate(silver?.currentRate)}
                  <Text style={{ fontFamily: FONTS.family.regular, fontSize: SIZES.font.sm, color: COLORS.textTertiary }}>/g</Text>
                </Text>
              )}
            </View>
            {!ratesLoading && (
              <View style={styles.changeCol}>
                <Ionicons name={silverUp ? 'caret-up' : 'caret-down'} size={13} color={silverUp ? COLORS.success : COLORS.error} />
                <Text style={{ fontFamily: FONTS.family.medium, fontSize: SIZES.font.xs, color: silverUp ? COLORS.success : COLORS.error }}>
                  {fmtPct(silver?.changePct)}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={[styles.footerDivider, { backgroundColor: COLORS.borderLight }]} />

        <TouchableOpacity
          style={styles.footer}
          activeOpacity={0.7}
          onPress={() => onRatesPress?.('Gold')}
        >
          <Ionicons name="stats-chart-outline" size={moderateScale(14)} color={COLORS.primary} />
          <Text style={{ fontFamily: FONTS.family.semiBold, fontSize: SIZES.font.sm, color: COLORS.primary }}>
            View Chart & History
          </Text>
          <Ionicons name="chevron-forward" size={moderateScale(14)} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    zIndex: 2,
  },
  card: {
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  changeCol: {
    alignItems: 'center',
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: 46,
    marginHorizontal: 7,
  },
  footerDivider: {
    height: StyleSheet.hairlineWidth,
    marginTop: 14,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 4,
  },
});
