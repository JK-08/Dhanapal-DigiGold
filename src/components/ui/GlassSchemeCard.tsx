// src/components/ui/GlassSchemeCard.tsx
//
// "Ticket stub" style card for a member's joined scheme — a deliberately
// different look from the frosted-glass card this replaces: a solid colour
// header band, a punched-out perforation seam, and a white statement body
// with a circular progress ring instead of a linear bar.
// (Filename / export names kept as-is so existing imports don't break.)

import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
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

const RADIUS = 20;
const RING_SIZE = 62;
const RING_STROKE = 6;
const RING_R = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRC = 2 * Math.PI * RING_R;

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

  const hg: string[] = (COLORS as any)?.gradient?.orangeDeep ?? [COLORS.brandStrong, COLORS.brand];
  const deep: string = (COLORS as any)?.orangeDeep ?? COLORS.brandStrong;
  const gradColors: [string, string, string] = [hg[1] ?? COLORS.brand, hg[0] ?? COLORS.brandStrong, deep];

  const STATUS_CLR: Record<string, string> = {
    active:    COLORS.successLight,
    pending:   COLORS.warningLight,
    completed: COLORS.goldSecondary,
  };

  const paid      = parseInt(item.schemeSummary?.schemaSummaryTransBalance?.insPaid ?? '0');
  const total     = parseInt(item.schemeSummary?.instalment ?? '1');
  const pct       = total > 0 ? Math.min(paid / total, 1) : 0;
  const status    = schemeStatus(item);
  const done      = status === 'completed';
  const remaining = Math.max(total - paid, 0);
  const ringOffset = RING_CIRC * (1 - pct);

  const cardWidth = width ?? GLASS_CARD_WIDTH;

  return (
    <View style={[card.shadowWrap, { width: cardWidth }]}>

      {/* ── Header band (solid gradient, no blur) ── */}
      <LinearGradient colors={gradColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={card.band}>
        <View style={card.bandRow}>
          <View style={card.iconWrap}>
            <Ionicons name="diamond-outline" size={18} color="#fff" />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[card.title, { fontFamily: FONTS.family.bold }]} numberOfLines={1}>
              {item.schemeSummary?.schemeName ?? item.pName}
            </Text>
            <Text style={[card.regNo, { fontFamily: FONTS.family.regular }]} numberOfLines={1}>
              Reg No: {item.regNo}{item.groupCode ? `  •  Group: ${item.groupCode}` : ''}
            </Text>
          </View>
          <View style={[card.badge, { backgroundColor: STATUS_CLR[status] + 'E6' }]}>
            <Text style={[card.badgeTxt, { color: COLORS.contentPrimary, fontFamily: FONTS.family.bold }]}>
              {status.toUpperCase()}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* ── Perforation seam with punched-out notches ── */}
      <View style={[card.seam, { backgroundColor: COLORS.surface }]}>
        <View style={[card.notch, card.notchLeft, { backgroundColor: COLORS.surfacePage }]} />
        <View style={[card.dashedLine, { borderColor: COLORS.borderStrong }]} />
        <View style={[card.notch, card.notchRight, { backgroundColor: COLORS.surfacePage }]} />
      </View>

      {/* ── Statement body (solid card colour) ── */}
      <View style={[card.body, { backgroundColor: COLORS.surface, borderColor: COLORS.borderSubtle }]}>
        <View style={card.bodyTopRow}>
          {/* Circular progress ring */}
          <View style={card.ringWrap}>
            <Svg width={RING_SIZE} height={RING_SIZE}>
              <Circle
                cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_R}
                stroke={COLORS.borderSubtle} strokeWidth={RING_STROKE} fill="none"
              />
              <Circle
                cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_R}
                stroke={done ? COLORS.success : COLORS.brand} strokeWidth={RING_STROKE} fill="none"
                strokeDasharray={`${RING_CIRC} ${RING_CIRC}`}
                strokeDashoffset={ringOffset}
                strokeLinecap="round"
                rotation={-90}
                origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
              />
            </Svg>
            <View style={card.ringCenter}>
              <Text style={[card.ringPct, { color: COLORS.contentPrimary, fontFamily: FONTS.family.bold }]}>
                {Math.round(pct * 100)}%
              </Text>
            </View>
          </View>

          {/* Stat rows */}
          <View style={card.statList}>
            <View style={card.statRow}>
              <Text style={[card.statLbl, { color: COLORS.contentMuted, fontFamily: FONTS.family.regular }]}>Invested</Text>
              <Text style={[card.statVal, { color: COLORS.contentPrimary, fontFamily: FONTS.family.bold }]} numberOfLines={1}>
                ₹{(item.totalAmount ?? 0).toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={[card.statDivider, { backgroundColor: COLORS.borderSubtle }]} />
            <View style={card.statRow}>
              <Text style={[card.statLbl, { color: COLORS.contentMuted, fontFamily: FONTS.family.regular }]}>EMIs Paid</Text>
              <Text style={[card.statVal, { color: COLORS.contentPrimary, fontFamily: FONTS.family.bold }]}>{paid}/{total}</Text>
            </View>
            <View style={[card.statDivider, { backgroundColor: COLORS.borderSubtle }]} />
            <View style={card.statRow}>
              <Text style={[card.statLbl, { color: COLORS.contentMuted, fontFamily: FONTS.family.regular }]}>
                {done ? 'Status' : 'Remaining'}
              </Text>
              <Text style={[card.statVal, { color: done ? COLORS.success : COLORS.brand, fontFamily: FONTS.family.bold }]}>
                {done ? 'Completed' : `${remaining} EMI${remaining === 1 ? '' : 's'}`}
              </Text>
            </View>
            <View style={[card.statDivider, { backgroundColor: COLORS.borderSubtle }]} />
            <View style={card.statRow}>
              <Text style={[card.statLbl, { color: COLORS.contentMuted, fontFamily: FONTS.family.regular }]}>Total Weight</Text>
              <Text style={[card.statVal, { color: COLORS.accentDeep, fontFamily: FONTS.family.bold }]}>
                {item.schemeSummary?.totalWeight ? `${item.schemeSummary.totalWeight} g` : '—'}
              </Text>
            </View>
          </View>
        </View>

        {/* Next due strip */}
        <View style={[card.dueStrip, { backgroundColor: COLORS.brand + '0A' }]}>
          <Ionicons name="calendar-outline" size={13} color={COLORS.brand} />
          <Text style={[card.dueTxt, { color: COLORS.contentSecondary, fontFamily: FONTS.family.medium }]} numberOfLines={1}>
            {done ? 'Scheme completed' : `Next due: ${formatDate(item.nextDueDate ?? '')}`}
          </Text>
        </View>

        {/* Actions */}
        <View style={card.actionRow}>
          <TouchableOpacity
            style={[card.btn, card.btnOutline, { borderColor: COLORS.brand + '40' }]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('SchemePassbook', { ppData: item })}
          >
            <Ionicons name="book-outline" size={15} color={COLORS.brand} />
            <Text style={[card.btnOutlineTxt, { color: COLORS.brand, fontFamily: FONTS.family.bold }]}>
              Passbook
            </Text>
          </TouchableOpacity>
          {!done && (
            <TouchableOpacity
              style={[card.btn, card.btnSolid, { backgroundColor: COLORS.brand }]}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('PayInstallment', { ppData: item })}
            >
              <Ionicons name="card-outline" size={15} color={COLORS.white} />
              <Text style={[card.btnSolidTxt, { color: COLORS.white, fontFamily: FONTS.family.bold }]}>
                Pay
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const card = StyleSheet.create({
  shadowWrap: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },

  // Header band
  band: {
    borderTopLeftRadius: RADIUS, borderTopRightRadius: RADIUS,
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 14,
  },
  bandRow: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: {
    width: 34, height: 34, borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.20)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.32)',
    alignItems: 'center', justifyContent: 'center',
  },
  title: { color: '#fff', fontSize: 15.5, letterSpacing: -0.2 },
  regNo: { color: 'rgba(255,255,255,0.78)', fontSize: 10.5, marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginLeft: 8 },
  badgeTxt: { fontSize: 8.5, letterSpacing: 0.4 },

  // Perforation seam
  seam: { height: 18, justifyContent: 'center', overflow: 'visible' },
  dashedLine: {
    flex: 1, marginHorizontal: 14, borderTopWidth: 1.5, borderStyle: 'dashed',
  },
  notch: { position: 'absolute', width: 18, height: 18, borderRadius: 9, top: 0 },
  notchLeft:  { left: -9 },
  notchRight: { right: -9 },

  // Body
  body: {
    borderBottomLeftRadius: RADIUS, borderBottomRightRadius: RADIUS,
    borderWidth: 1, borderTopWidth: 0, padding: 16,
  },
  bodyTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },

  ringWrap: { width: RING_SIZE, height: RING_SIZE, alignItems: 'center', justifyContent: 'center' },
  ringCenter: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  ringPct: { fontSize: 13 },

  statList: { flex: 1, marginLeft: 16, gap: 7 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statLbl: { fontSize: 11.5 },
  statVal: { fontSize: 13 },
  statDivider: { height: 1 },

  dueStrip: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, marginBottom: 14,
  },
  dueTxt: { fontSize: 11.5, flex: 1 },

  actionRow: { flexDirection: 'row', gap: 10 },
  btn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 12 },
  btnOutline: { backgroundColor: 'transparent', borderWidth: 1.5 },
  btnOutlineTxt: { fontSize: 13 },
  btnSolid: {},
  btnSolidTxt: { fontSize: 13 },
});
