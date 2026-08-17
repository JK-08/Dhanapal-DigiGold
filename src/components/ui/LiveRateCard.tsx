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
  const fmtRate = (n?: number) => (n != null ? `₹${Math.round(n).toLocaleString('en-IN')}` : '—');

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
      <View style={[styles.card, { backgroundColor: COLORS.surface, ...SHADOWS.md }]}>
        <View style={styles.header}>
          <View style={styles.liveRow}>
            <View style={[styles.liveDot, { backgroundColor: COLORS.success }]} />
            <Text style={{
              fontFamily: FONTS.family.semiBold,
              fontSize: SIZES.font.xs,
              color: COLORS.contentMuted,
              letterSpacing: 0.6,
            }}>
              LIVE RATES
            </Text>
          </View>
          <Text style={{
            fontFamily: FONTS.family.regular,
            fontSize: SIZES.font.xs,
            color: COLORS.contentDisabled,
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
              <Ionicons name="diamond-outline" size={moderateScale(22)} color={GOLD_CLR} />
            </View>
            <View style={styles.info}>
              <Text style={{ fontFamily: FONTS.family.semiBold, fontSize: SIZES.font.sm, color: COLORS.contentMuted }}>
                Gold 91.6%
              </Text>
              {ratesLoading ? (
                <ActivityIndicator size="small" color={GOLD_CLR} style={{ marginTop: 3, alignSelf: 'flex-start' }} />
              ) : (
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.7}
                  style={{ fontFamily: FONTS.family.bold, fontSize: 18, color: COLORS.contentPrimary }}
                >
                  {fmtRate(gold?.currentRate)}
                  <Text style={{ fontFamily: FONTS.family.regular, fontSize: SIZES.font.sm, color: COLORS.contentMuted }}> /g</Text>
                </Text>
              )}
            </View>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: COLORS.borderSubtle }]} />

          {/* Silver */}
          <TouchableOpacity
            style={styles.item}
            activeOpacity={0.75}
            onPress={() => onRatesPress?.('Silver')}
          >
            <View style={[styles.iconWrap, { backgroundColor: SILVER_CLR + '18' }]}>
              <Ionicons name="ellipse-outline" size={moderateScale(22)} color={SILVER_CLR} />
            </View>
            <View style={styles.info}>
              <Text style={{ fontFamily: FONTS.family.semiBold, fontSize: SIZES.font.sm, color: COLORS.contentMuted }}>
                Silver 91.6%
              </Text>
              {ratesLoading ? (
                <ActivityIndicator size="small" color={SILVER_CLR} style={{ marginTop: 3, alignSelf: 'flex-start' }} />
              ) : (
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.7}
                  style={{ fontFamily: FONTS.family.bold, fontSize: 18, color: COLORS.contentPrimary }}
                >
                  {fmtRate(silver?.currentRate)}
                  <Text style={{ fontFamily: FONTS.family.regular, fontSize: SIZES.font.sm, color: COLORS.contentMuted }}> /g</Text>
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.footerDivider, { backgroundColor: COLORS.borderSubtle }]} />

        <TouchableOpacity
          style={styles.footer}
          activeOpacity={0.7}
          onPress={() => onRatesPress?.('Gold')}
        >
          <Ionicons name="stats-chart-outline" size={moderateScale(14)} color={COLORS.brand} />
          <Text style={{ fontFamily: FONTS.family.semiBold, fontSize: SIZES.font.sm, color: COLORS.brand }}>
            View Chart & History
          </Text>
          <Ionicons name="chevron-forward" size={moderateScale(14)} color={COLORS.brand} />
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
    gap: 12,
    minWidth: 0,
    paddingVertical: 4,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: 46,
    marginHorizontal: 6,
    flexShrink: 0,
  },
  footerDivider: {
    height: StyleSheet.hairlineWidth,
    marginTop: 5,
    marginBottom: 5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 4,
  },
});
