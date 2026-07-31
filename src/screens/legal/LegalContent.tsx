// src/screens/legal/LegalContent.tsx
// Shared building blocks for the static legal / info pages
// (Terms & Conditions, Privacy Policy, Refund & Cancellation Policy, About Us).

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../theme';
import AppHeader from '../../components/ui/appcomponents/AppHeader';
import PoweredByFooter from '../../components/ui/PoweredByFooter';

// ── Page shell: header + scrollable body + footer ─────────────────
export function LegalScreenShell({
  title, subtitle, children,
}: { title: string; subtitle?: string; children: React.ReactNode }) {
  const { COLORS } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surfacePage }} edges={['bottom']}>
      <AppHeader title={title} subtitle={subtitle} showBack/>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={ls.scroll}>
        {children}
        <PoweredByFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── A little "last updated" pill shown under the intro paragraph ──
export function UpdatedPill({ date }: { date: string }) {
  const { COLORS, FONTS } = useTheme();
  return (
    <View style={[ls.pill, { backgroundColor: COLORS.brandTint }]}>
      <Ionicons name="time-outline" size={12} color={COLORS.brand} />
      <Text style={[ls.pillTxt, { color: COLORS.brand, fontFamily: FONTS.family.medium }]}>
        Last updated: {date}
      </Text>
    </View>
  );
}

// ── Section heading ─────────────────────────────────────────────
export function Section({ number, title, children }: { number?: string; title: string; children: React.ReactNode }) {
  const { COLORS, FONTS } = useTheme();
  return (
    <View style={ls.section}>
      <View style={ls.sectionHeadRow}>
        {number ? (
          <View style={[ls.numBadge, { backgroundColor: COLORS.brand }]}>
            <Text style={[ls.numBadgeTxt, { fontFamily: FONTS.family.bold }]}>{number}</Text>
          </View>
        ) : null}
        <Text style={[ls.sectionTitle, { color: COLORS.contentPrimary, fontFamily: FONTS.family.bold }]}>
          {title}
        </Text>
      </View>
      <View style={ls.sectionBody}>{children}</View>
    </View>
  );
}

// ── Body paragraph ─────────────────────────────────────────────
export function Para({ children }: { children: React.ReactNode }) {
  const { COLORS, FONTS } = useTheme();
  return (
    <Text style={[ls.para, { color: COLORS.contentSecondary, fontFamily: FONTS.family.regular }]}>
      {children}
    </Text>
  );
}

// ── Bulleted list ─────────────────────────────────────────────
export function BulletList({ items }: { items: React.ReactNode[] }) {
  const { COLORS, FONTS } = useTheme();
  return (
    <View style={{ gap: 8 }}>
      {items.map((item, i) => (
        <View key={i} style={ls.bulletRow}>
          <View style={[ls.bulletDot, { backgroundColor: COLORS.brand }]} />
          <Text style={[ls.bulletTxt, { color: COLORS.contentSecondary, fontFamily: FONTS.family.regular }]}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

// ── Highlighted callout box (for important notices) ─────────────
export function Callout({ icon = 'information-circle', tone = 'brand', children }: {
  icon?: keyof typeof Ionicons.glyphMap; tone?: 'brand' | 'warning' | 'success'; children: React.ReactNode;
}) {
  const { COLORS, FONTS } = useTheme();
  const clr = tone === 'warning' ? COLORS.warning : tone === 'success' ? COLORS.success : COLORS.brand;
  return (
    <View style={[ls.callout, { backgroundColor: clr + '0F', borderColor: clr + '30' }]}>
      <Ionicons name={icon} size={18} color={clr} style={{ marginTop: 1 }} />
      <Text style={[ls.calloutTxt, { color: COLORS.contentPrimary, fontFamily: FONTS.family.medium }]}>
        {children}
      </Text>
    </View>
  );
}

const ls = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 20, marginBottom: 18,
  },
  pillTxt: { fontSize: 11 },
  section: { marginBottom: 22 },
  sectionHeadRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  numBadge: { width: 24, height: 24, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  numBadgeTxt: { color: '#fff', fontSize: 11 },
  sectionTitle: { fontSize: 15.5, flex: 1, letterSpacing: -0.2 },
  sectionBody: { paddingLeft: 2 },
  para: { fontSize: 13.5, lineHeight: 21 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  bulletDot: { width: 5, height: 5, borderRadius: 3, marginTop: 7 },
  bulletTxt: { flex: 1, fontSize: 13.5, lineHeight: 20 },
  callout: {
    flexDirection: 'row', gap: 10, borderWidth: 1, borderRadius: 12,
    padding: 12, marginTop: 4,
  },
  calloutTxt: { flex: 1, fontSize: 12.5, lineHeight: 19 },
});
