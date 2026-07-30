// src/components/ui/GlassSchemeCard.tsx
//
// Frosted-glass / "blur mirror" card for a member's joined scheme.
// Base colour follows the app header gradient. Full-width (use inside a slider).
// Two actions: "Pay" (opens Pay Installment) and "Installments" (opens a modal
// listing the paid installment history).

import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTheme } from '../../theme';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { PPData } from '../../types/Account/PhoneDetails';

const { width: SCREEN_W } = Dimensions.get('window');
type NavProps = NativeStackNavigationProp<RootStackParamList>;

// Full width minus the home container padding (16 each side)
export const GLASS_CARD_WIDTH = SCREEN_W - 32;

// Status colours mapped to theme tokens — resolved inside component where COLORS is available

function formatDate(raw: string): string {
  if (!raw) return '—';
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function schemeStatus(pp: PPData): 'active' | 'pending' | 'completed' {
  const ct = pp.schemeClosedSummary?.closeType ?? '';
  if (ct && ct.trim() !== '') return 'completed';
  const paid = parseInt(pp.schemeSummary?.schemaSummaryTransBalance?.insPaid ?? '0');
  return paid > 0 ? 'active' : 'pending';
}

export default function GlassSchemeCard({ item, width }: { item: PPData; index?: number; width?: number }) {
  const { COLORS, FONTS } = useTheme();
  const navigation = useNavigation<NavProps>();
  useEffect(() => {
    console.log('[GlassSchemeCard] Phone Details Data:', {
      regNo:              item.regNo,
      name:               item.pName,
      schemeName:         item.schemeSummary?.schemeName,
      totalAmount:        item.totalAmount,
      totalAmountWithBonus: item.totalAmountWithBonus,
      bonusAmount:        item.bonusAmount,
      bonusPercent:       item.bonusPercent,
      instalmentsPaid:    item.schemeSummary?.schemaSummaryTransBalance?.insPaid,
      totalInstalments:   item.schemeSummary?.instalment,
      paymentHistoryCount: item.paymentHistoryList?.length ?? 0,
      remainingDueDatesCount: item.remainingDueDates?.length ?? 0,
      joinDate:           item.joinDate,
      maturityDate:       item.maturityDate,
      nextDueDate:        item.nextDueDate,
      lastPaidDate:       item.lastPaidDate,
      remainingDays:      item.remainingDays,
      status:             schemeStatus(item),
    });
  }, [item]);

  // Header gradient colours from theme
  const hg: string[] = (COLORS as any)?.gradient?.orangeDeep ?? [COLORS.primaryDark, COLORS.primary];
  const deep: string = (COLORS as any)?.orangeDeep ?? COLORS.primaryDark;
  const gradColors: [string, string, string] = [hg[1] ?? COLORS.primary, hg[0] ?? COLORS.primaryDark, deep];

  const STATUS_CLR: Record<string, string> = {
    active:    COLORS.successLight,
    pending:   COLORS.warningLight,
    completed: COLORS.goldSecondary,
  };

  const paid    = parseInt(item.schemeSummary?.schemaSummaryTransBalance?.insPaid ?? '0');
  const total   = parseInt(item.schemeSummary?.instalment ?? '1');
  const pct     = total > 0 ? Math.min(paid / total, 1) : 0;
  const status  = schemeStatus(item);
  const done    = status === 'completed';

  return (
    <View style={[glass.shadowWrap, width ? { width } : null]}>
      <View style={glass.card}>
        {/* 1) Header-colour gradient base */}
        <LinearGradient
          colors={gradColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* 2) Light "reflection" blobs for the mirror feel */}
        <View style={[glass.blob, glass.blobTop]} />
        <View style={[glass.blob, glass.blobBottom]} />

        {/* 3) Frosted glass blur */}
        <BlurView intensity={26} tint="light" style={StyleSheet.absoluteFill} />

        {/* 4) Glass sheet + light border */}
        <View style={glass.sheet} />
        <LinearGradient
          colors={['rgba(255,255,255,0.28)', 'rgba(255,255,255,0.04)', 'rgba(255,255,255,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.6 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        {/* 5) Content */}
        <View style={glass.content}>
          <View style={glass.topRow}>
            <View style={glass.iconWrap}>
              <Ionicons name="diamond-outline" size={18} color={COLORS.white} />
            </View>
            <View style={[glass.badge, { backgroundColor: STATUS_CLR[status] + 'E6' }]}>
              <Text style={[glass.badgeTxt, { color: COLORS.textPrimary, fontFamily: FONTS.family.bold }]}>
                {status.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={[glass.title, { fontFamily: FONTS.family.bold }]} numberOfLines={1}>
            {item.schemeSummary?.schemeName ?? item.pName}
          </Text>
          <Text style={[glass.regNo, { fontFamily: FONTS.family.regular }]} numberOfLines={1}>
            Reg No: {item.regNo}
          </Text>

          <View style={glass.statsRow}>
            <View style={{ flex: 1 }}>
              <Text style={[glass.val, { fontFamily: FONTS.family.bold }]}>
                ₹{item.totalAmount.toLocaleString('en-IN')}
              </Text>
              <Text style={[glass.lbl, { fontFamily: FONTS.family.regular }]}>Invested</Text>
            </View>
            <View style={glass.div} />
            <View style={{ flex: 1 }}>
              <Text style={[glass.val, { fontFamily: FONTS.family.bold }]}>
                ₹{item.totalAmountWithBonus.toLocaleString('en-IN')}
              </Text>
              <Text style={[glass.lbl, { fontFamily: FONTS.family.regular }]}>With Bonus</Text>
            </View>
            <View style={glass.div} />
            <View style={{ flex: 1 }}>
              <Text style={[glass.val, { fontFamily: FONTS.family.bold }]}>{paid}/{total}</Text>
              <Text style={[glass.lbl, { fontFamily: FONTS.family.regular }]}>EMIs</Text>
            </View>
          </View>

          {/* Progress */}
          <View style={glass.track}>
            <View style={[glass.fill, { width: `${Math.min(pct * 100, 100)}%` as any }]} />
          </View>
          <View style={glass.metaRow}>
            <Text style={[glass.next, { fontFamily: FONTS.family.regular }]} numberOfLines={1}>
              {done ? 'Scheme completed' : `Next: ${formatDate(item.nextDueDate ?? '')}`}
            </Text>
            <Text style={[glass.pct, { fontFamily: FONTS.family.semiBold }]}>{Math.round(pct * 100)}%</Text>
          </View>

          {/* Actions: Passbook (+ Pay when scheme is still open) */}
          <View style={glass.actionRow}>
            <TouchableOpacity
              style={[glass.btn, glass.btnGhost]}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('SchemePassbook', { ppData: item })}
            >
              <Ionicons name="book-outline" size={15} color={COLORS.white} />
              <Text style={[glass.btnGhostTxt, { fontFamily: FONTS.family.bold }]}>
                Passbook
              </Text>
            </TouchableOpacity>
            {!done && (
              <TouchableOpacity
                style={[glass.btn, glass.btnSolid]}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('PayInstallment', { ppData: item })}
              >
                <Ionicons name="card-outline" size={15} color={COLORS.primaryDark} />
                <Text style={[glass.btnSolidTxt, { color: COLORS.primaryDark, fontFamily: FONTS.family.bold }]}>
                  Pay
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>


    </View>
  );
}

const RADIUS = 22;

const glass = StyleSheet.create({
  shadowWrap: {
    width: GLASS_CARD_WIDTH,
    borderRadius: RADIUS,
    shadowColor: '#000000',  // must be hex for RN shadow — maps to COLORS.black
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 6,
  },
  card: { borderRadius: RADIUS, overflow: 'hidden', minHeight: 210 },
  sheet: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: RADIUS,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.40)',
  },
  blob: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.22)' },
  blobTop:    { width: 170, height: 170, top: -60, right: -40 },
  blobBottom: { width: 130, height: 130, bottom: -50, left: -35, backgroundColor: 'rgba(255,255,255,0.12)' },

  content: { padding: 18 },
  topRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  iconWrap:{ width: 36, height: 36, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.22)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)', alignItems: 'center', justifyContent: 'center' },
  badge:   { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 10 },
  badgeTxt:{ fontSize: 9, letterSpacing: 0.4 },

  title:   { color: '#fff', fontSize: 17, letterSpacing: -0.2 },   // white on gradient — intentional glass text
  regNo:   { color: 'rgba(255,255,255,0.78)', fontSize: 11, marginTop: 2, marginBottom: 14 },  // glass overlay text

  statsRow:{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  val:     { color: '#fff', fontSize: 14 },          // white on gradient — intentional glass text
  lbl:     { color: 'rgba(255,255,255,0.72)', fontSize: 10, marginTop: 2 },  // glass overlay text
  div:     { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.28)', marginHorizontal: 8 },

  track:   { height: 5, backgroundColor: 'rgba(255,255,255,0.28)', borderRadius: 3, marginBottom: 8, overflow: 'hidden' },
  fill:    { height: '100%', backgroundColor: '#fff', borderRadius: 3 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  next:    { color: 'rgba(255,255,255,0.85)', fontSize: 11, flex: 1, marginRight: 8 },  // glass overlay text
  pct:     { color: '#fff', fontSize: 11 },   // white on gradient — intentional glass text

  actionRow:  { flexDirection: 'row', gap: 10 },
  btn:        { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 11, borderRadius: 12 },
  btnGhost:   { backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.40)' },  // glass effect
  btnGhostTxt:{ color: '#fff', fontSize: 13 },   // white on glass — intentional
  btnSolid:   { backgroundColor: '#fff' },        // white pill on gradient — intentional
  btnSolidTxt:{ fontSize: 13 },
});
