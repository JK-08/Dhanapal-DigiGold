// src/screens/legal/AboutUsScreen.tsx
// About Us — brand story for Dhanapal DigiGold + live branch/contact details
// pulled from the same /company/all API used on the Contact screen.

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ActivityIndicator, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../theme';
import { useCompanies } from '../../api/hooks/Company/useCompanies';
import { Company } from '../../types/Company/Company';
import { LegalScreenShell, Section, Para, BulletList } from './LegalContent';

const companyAddress = (c: Company): string => {
  const lines = [c.ADDRESS1, c.ADDRESS2, c.ADDRESS3, c.ADDRESS4]
    .map(x => (x ?? '').trim())
    .filter(Boolean);
  const base = lines.join(', ');
  return c.AREACODE ? `${base}${base ? ' - ' : ''}${c.AREACODE}` : base;
};
const telHref = (phone: string) => `tel:${phone.replace(/[^0-9+]/g, '')}`;

export default function AboutUsScreen() {
  const { COLORS, FONTS, SHADOWS } = useTheme();
  const { companies, loading, error } = useCompanies();

  return (
    <LegalScreenShell title="About Us">
      {/* ── Brand hero ── */}
      <View style={s.hero}>
        <View style={[s.heroLogoWrap, { backgroundColor: COLORS.brandTint }]}>
          <Image source={require('../../../assets/logo.png')} style={s.heroLogo} resizeMode="contain" />
        </View>
        <Text style={[s.heroTitle, { color: COLORS.contentPrimary, fontFamily: FONTS.family.bold }]}>
          Dhanapal DigiGold
        </Text>
        <Text style={[s.heroTag, { color: COLORS.contentSecondary, fontFamily: FONTS.family.regular }]}>
          Your trusted digital gold & silver savings partner
        </Text>
      </View>

      <Section title="Our Story">
        <Para>
          Dhanapal Jewellery has been a name families trust for their gold and silver purchases for
          generations. Dhanapal DigiGold brings that same trust into a simple, secure app — letting
          you save towards your next piece of jewellery in small, manageable installments, without
          having to walk into a branch every time.
        </Para>
        <Para>
          What used to be a paper passbook and a physical visit is now a few taps away: join a
          scheme, pay installments online, track your savings in real time, and redeem at any of our
          branches when you're ready.
        </Para>
      </Section>

      <Section title="What We Offer">
        <BulletList
          items={[
            'Fixed and flexible installment gold & silver savings schemes to suit your budget.',
            'A live digital passbook showing every payment, receipt, and installment due date.',
            'Real-time gold & silver rates so you always know today\'s value.',
            'Secure MPIN and OTP-protected account access.',
            'Downloadable payment receipts for every installment you pay.',
            'Easy in-app scheme enrolment with a clear, step-by-step joining flow.',
          ]}
        />
      </Section>

      <Section title="Our Values">
        <BulletList
          items={[
            'Trust — every gram we credit to your account is backed by our branch network and hallmark-assured purity.',
            'Transparency — your ledger, payment history, and scheme terms are always visible in the App, with no hidden conditions.',
            'Customer first — our branch teams are there to help with enrolment, payments, or redemption whenever you need us.',
          ]}
        />
      </Section>

      {/* ── Live branch/contact details ── */}
      <View style={s.branchSection}>
        <Text style={[s.branchHeading, { color: COLORS.contentPrimary, fontFamily: FONTS.family.bold }]}>
          Visit Us
        </Text>

        {loading ? (
          <View style={[s.branchCard, { backgroundColor: COLORS.surface, borderColor: COLORS.borderSubtle, alignItems: 'center' }]}>
            <ActivityIndicator color={COLORS.brand} />
          </View>
        ) : error ? (
          <View style={[s.branchCard, { backgroundColor: COLORS.surface, borderColor: COLORS.borderSubtle }]}>
            <Text style={[s.branchRowTxt, { color: COLORS.contentSecondary, fontFamily: FONTS.family.regular }]}>{error}</Text>
          </View>
        ) : companies.length === 0 ? (
          <View style={[s.branchCard, { backgroundColor: COLORS.surface, borderColor: COLORS.borderSubtle }]}>
            <Text style={[s.branchRowTxt, { color: COLORS.contentSecondary, fontFamily: FONTS.family.regular }]}>
              Branch details are currently unavailable.
            </Text>
          </View>
        ) : (
          companies.map((c) => {
            const addr = companyAddress(c);
            return (
              <View key={c.COMPANYID} style={[s.branchCard, { backgroundColor: COLORS.surface, borderColor: COLORS.borderSubtle, ...SHADOWS.sm }]}>
                <View style={s.branchHead}>
                  <View style={[s.branchIcon, { backgroundColor: COLORS.brand + '15' }]}>
                    <Ionicons name="business-outline" size={18} color={COLORS.brand} />
                  </View>
                  <Text style={[s.branchName, { color: COLORS.contentPrimary, fontFamily: FONTS.family.bold }]} numberOfLines={2}>
                    {c.COMPANYNAME}
                  </Text>
                </View>

                {addr ? (
                  <View style={s.branchRow}>
                    <Ionicons name="location-outline" size={15} color={COLORS.contentMuted} style={s.branchRowIcon} />
                    <Text style={[s.branchRowTxt, { color: COLORS.contentSecondary, fontFamily: FONTS.family.regular }]}>{addr}</Text>
                  </View>
                ) : null}

                {c.PHONE ? (
                  <TouchableOpacity style={s.branchRow} onPress={() => Linking.openURL(telHref(c.PHONE!))} activeOpacity={0.7}>
                    <Ionicons name="call-outline" size={15} color={COLORS.brand} style={s.branchRowIcon} />
                    <Text style={[s.branchRowTxt, { color: COLORS.brand, fontFamily: FONTS.family.medium }]}>{c.PHONE}</Text>
                  </TouchableOpacity>
                ) : null}

                {c.EMAIL ? (
                  <TouchableOpacity style={s.branchRow} onPress={() => Linking.openURL(`mailto:${c.EMAIL}`)} activeOpacity={0.7}>
                    <Ionicons name="mail-outline" size={15} color={COLORS.brand} style={s.branchRowIcon} />
                    <Text style={[s.branchRowTxt, { color: COLORS.brand, fontFamily: FONTS.family.medium }]} numberOfLines={1}>{c.EMAIL}</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            );
          })
        )}
      </View>
    </LegalScreenShell>
  );
}

const s = StyleSheet.create({
  hero: { alignItems: 'center', paddingVertical: 20, marginBottom: 8 },
  heroLogoWrap: {
    width: 76, height: 76, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  heroLogo: { width: 48, height: 48 },
  heroTitle: { fontSize: 20, letterSpacing: -0.3, marginBottom: 4 },
  heroTag: { fontSize: 13, textAlign: 'center' },

  branchSection: { marginTop: 6 },
  branchHeading: { fontSize: 15.5, marginBottom: 12, letterSpacing: -0.2 },
  branchCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 12 },
  branchHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  branchIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  branchName: { fontSize: 14, flex: 1 },
  branchRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 4 },
  branchRowIcon: { marginRight: 8, marginTop: 1 },
  branchRowTxt: { flex: 1, fontSize: 12.5, lineHeight: 18 },
});
