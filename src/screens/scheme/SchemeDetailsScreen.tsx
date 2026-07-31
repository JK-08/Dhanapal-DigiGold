// src/screens/scheme/SchemeDetailsScreen.tsx
//
// Sits between the scheme list and Terms & Conditions in the join flow:
//   Scheme list → SchemeDetails (this) → SchemeTerms → SchemeJoin → payment
// Shows everything we actually know about the scheme (from ApiScheme + the
// live installment-group data) in one professional, scrollable page before
// asking the member to accept T&C and fill in their details.

import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IMAGE_BASE_URL } from '@env';

import { useTheme } from '../../theme';
import { COLORS } from '../../theme/theme';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { METAL_LABEL, METAL_COLOR } from '../../types/Scheme/Scheme';
import { useMemberScheme } from '../../api/hooks/Member/useMemberScheme';
import AppHeader from '../../components/ui/appcomponents/AppHeader';

type RouteProps = RouteProp<RootStackParamList, 'SchemeDetails'>;
type NavProps   = NativeStackNavigationProp<RootStackParamList, 'SchemeDetails'>;

const imgUrl = (path: string) => (path ? `${IMAGE_BASE_URL}${path}` : '');

const HOW_IT_WORKS = [
  { icon: 'wallet-outline' as const,       title: 'Choose your amount',   desc: 'Pick a fixed installment slab or enter your own monthly amount.' },
  { icon: 'calendar-outline' as const,     title: 'Pay every month',      desc: 'Pay each installment online — securely via Razorpay, right in the app.' },
  { icon: 'book-outline' as const,         title: 'Track your passbook',  desc: 'See every payment, receipt, and due date in your live scheme passbook.' },
  { icon: 'diamond-outline' as const,      title: 'Redeem at maturity',   desc: 'Once all installments are paid, redeem the accumulated value at the store.' },
];

const WHY_JOIN = [
  { icon: 'shield-checkmark-outline' as const, text: 'Secure, disciplined savings towards gold/silver purchases' },
  { icon: 'phone-portrait-outline' as const,   text: 'Pay installments anytime, from anywhere in the app' },
  { icon: 'receipt-outline' as const,          text: 'Download a branded PDF receipt after every payment' },
  { icon: 'eye-outline' as const,              text: 'Full transparency — view your complete payment history' },
];

export default function SchemeDetailsScreen() {
  const { COLORS, FONTS, SIZES, SHADOWS, moderateScale } = useTheme();
  const navigation = useNavigation<NavProps>();
  const route = useRoute<RouteProps>();
  const { scheme } = route.params;

  const mColor  = METAL_COLOR[scheme.MetalType] ?? COLORS.primary;
  const mLabel  = METAL_LABEL[scheme.MetalType] ?? scheme.MetalType;
  const isFixed = scheme.FixedIns === 'Y';
  const canJoin = scheme.ADDNEWMEMBER === 'Y';

  const { groups, loading: groupsLoading } = useMemberScheme(scheme.SchemeId);
  const [imgError, setImgError] = React.useState(false);

  const amounts = React.useMemo(
    () => [...groups].sort((a, b) => a.AMOUNT - b.AMOUNT),
    [groups],
  );

  return (
    <SafeAreaView style={[st.flex, { backgroundColor: COLORS.background }]} edges={['bottom']}>
      <AppHeader title="Scheme Details" subtitle={scheme.schemeName} showBack  />

      <ScrollView contentContainerStyle={st.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Hero banner ─────────────────────────────────────── */}
        <View style={[st.heroWrap, SHADOWS.sm]}>
          {scheme.image_path && !imgError ? (
            <Image
              source={{ uri: imgUrl(scheme.image_path) }}
              style={st.heroImg}
              onError={() => setImgError(true)}
            />
          ) : (
            <LinearGradient colors={[mColor, mColor + 'CC']} style={st.heroImg} />
          )}
          <LinearGradient
            colors={[COLORS.transparent, COLORS.blackOpacity70]}
            style={st.heroOverlay}
          >
            <View style={st.heroBadgeRow}>
              <View style={[st.metalBadge, { backgroundColor: mColor + 'E6' }]}>
                <Ionicons name="ellipse" size={7} color={COLORS.white} />
                <Text style={[st.metalBadgeTxt, { fontFamily: FONTS.family.bold }]}>{mLabel}</Text>
              </View>
              <View style={[st.metalBadge, { backgroundColor: canJoin ? COLORS.success + 'E6' : COLORS.error + 'E6' }]}>
                <Ionicons name={canJoin ? 'checkmark-circle' : 'lock-closed'} size={11} color={COLORS.white} />
                <Text style={[st.metalBadgeTxt, { fontFamily: FONTS.family.bold }]}>
                  {canJoin ? 'Open for Enrolment' : 'Enrolment Closed'}
                </Text>
              </View>
            </View>
            <Text style={[st.heroTitle, { fontFamily: FONTS.family.bold }]} numberOfLines={2}>
              {scheme.schemeName}
            </Text>
            <Text style={[st.heroCode, { fontFamily: FONTS.family.regular }]}>
              Scheme Code: {scheme.SchemeSName}
            </Text>
          </LinearGradient>
        </View>

        {/* ── Key info grid ───────────────────────────────────── */}
        <View style={st.grid}>
          <View style={[st.statCard, { backgroundColor: COLORS.card, borderColor: COLORS.borderLight, ...SHADOWS.sm }]}>
            <Ionicons name="layers-outline" size={18} color={mColor} />
            <Text style={[st.statVal, { color: COLORS.textPrimary, fontFamily: FONTS.family.bold }]}>{scheme.Instalment}</Text>
            <Text style={[st.statLbl, { color: COLORS.textTertiary, fontFamily: FONTS.family.regular }]}>Installments</Text>
          </View>
          <View style={[st.statCard, { backgroundColor: COLORS.card, borderColor: COLORS.borderLight, ...SHADOWS.sm }]}>
            <Ionicons name="cash-outline" size={18} color={mColor} />
            <Text style={[st.statVal, { color: COLORS.textPrimary, fontFamily: FONTS.family.bold }]}>
              {isFixed ? 'Fixed' : 'Flexible'}
            </Text>
            <Text style={[st.statLbl, { color: COLORS.textTertiary, fontFamily: FONTS.family.regular }]}>Amount Type</Text>
          </View>
          <View style={[st.statCard, { backgroundColor: COLORS.card, borderColor: COLORS.borderLight, ...SHADOWS.sm }]}>
            <Ionicons name="scale-outline" size={18} color={mColor} />
            <Text style={[st.statVal, { color: COLORS.textPrimary, fontFamily: FONTS.family.bold }]}>
              {scheme.WeightLedger === 'Y' ? 'Yes' : 'No'}
            </Text>
            <Text style={[st.statLbl, { color: COLORS.textTertiary, fontFamily: FONTS.family.regular }]}>Weight Ledger</Text>
          </View>
          <View style={[st.statCard, { backgroundColor: COLORS.card, borderColor: COLORS.borderLight, ...SHADOWS.sm }]}>
            <Ionicons name="diamond-outline" size={18} color={mColor} />
            <Text style={[st.statVal, { color: mColor, fontFamily: FONTS.family.bold }]}>{mLabel}</Text>
            <Text style={[st.statLbl, { color: COLORS.textTertiary, fontFamily: FONTS.family.regular }]}>Metal Type</Text>
          </View>
        </View>

        {/* ── Available amounts ───────────────────────────────── */}
        <View style={[st.section, { backgroundColor: COLORS.card, borderColor: COLORS.borderLight, ...SHADOWS.sm }]}>
          <View style={st.sectionHeader}>
            <View style={[st.sectionIconWrap, { backgroundColor: mColor + '14' }]}>
              <Ionicons name="wallet-outline" size={15} color={mColor} />
            </View>
            <Text style={[st.sectionTitle, { color: COLORS.textPrimary, fontFamily: FONTS.family.bold, fontSize: SIZES.font.md }]}>
              {isFixed ? 'Available Installment Amounts' : 'Installment Amount'}
            </Text>
          </View>

          {isFixed ? (
            groupsLoading ? (
              <ActivityIndicator color={mColor} style={{ marginVertical: 12 }} />
            ) : amounts.length > 0 ? (
              <>
                <View style={st.amountWrap}>
                  {amounts.map((g) => (
                    <View key={g.GROUPCODE} style={[st.amountChip, { backgroundColor: mColor + '10', borderColor: mColor + '35' }]}>
                      <Text style={[st.amountChipTxt, { color: COLORS.primary, fontFamily: FONTS.family.bold }]}>
                        ₹{g.AMOUNT.toLocaleString('en-IN')}
                      </Text>
                    </View>
                  ))}
                </View>
                <Text style={[st.sectionNote, { color: COLORS.textTertiary, fontFamily: FONTS.family.regular }]}>
                  You'll pick one of these {amounts.length} slabs on the next step.
                </Text>
              </>
            ) : (
              <Text style={[st.sectionNote, { color: COLORS.textTertiary, fontFamily: FONTS.family.regular }]}>
                No installment slabs available right now.
              </Text>
            )
          ) : (
            <Text style={[st.sectionNote, { color: COLORS.textSecondary, fontFamily: FONTS.family.regular }]}>
              This scheme has a flexible amount — you can enter any monthly amount you're comfortable with when you join.
            </Text>
          )}
        </View>

        {/* ── How it works ─────────────────────────────────────── */}
        <View style={[st.section, { backgroundColor: COLORS.card, borderColor: COLORS.borderLight, ...SHADOWS.sm }]}>
          <View style={st.sectionHeader}>
            <View style={[st.sectionIconWrap, { backgroundColor: COLORS.primary + '14' }]}>
              <Ionicons name="list-outline" size={15} color={COLORS.primary} />
            </View>
            <Text style={[st.sectionTitle, { color: COLORS.textPrimary, fontFamily: FONTS.family.bold, fontSize: SIZES.font.md }]}>
              How This Scheme Works
            </Text>
          </View>

          {HOW_IT_WORKS.map((step, i) => (
            <View key={step.title} style={[st.stepRow, i !== HOW_IT_WORKS.length - 1 && st.stepRowGap]}>
              <View style={st.stepRail}>
                <View style={[st.stepDot, { backgroundColor: COLORS.primary + '14', borderColor: COLORS.primary + '30' }]}>
                  <Text style={[st.stepDotTxt, { color: COLORS.primary, fontFamily: FONTS.family.bold }]}>{i + 1}</Text>
                </View>
                {i !== HOW_IT_WORKS.length - 1 && <View style={[st.stepLine, { backgroundColor: COLORS.borderLight }]} />}
              </View>
              <View style={{ flex: 1, paddingBottom: i !== HOW_IT_WORKS.length - 1 ? 14 : 0 }}>
                <Text style={[st.stepTitle, { color: COLORS.textPrimary, fontFamily: FONTS.family.semiBold }]}>{step.title}</Text>
                <Text style={[st.stepDesc, { color: COLORS.textTertiary, fontFamily: FONTS.family.regular }]}>{step.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Why join ─────────────────────────────────────────── */}
        <View style={[st.section, { backgroundColor: COLORS.card, borderColor: COLORS.borderLight, ...SHADOWS.sm }]}>
          <View style={st.sectionHeader}>
            <View style={[st.sectionIconWrap, { backgroundColor: COLORS.success + '14' }]}>
              <Ionicons name="sparkles-outline" size={15} color={COLORS.success} />
            </View>
            <Text style={[st.sectionTitle, { color: COLORS.textPrimary, fontFamily: FONTS.family.bold, fontSize: SIZES.font.md }]}>
              Why Join Through the App
            </Text>
          </View>
          {WHY_JOIN.map((item) => (
            <View key={item.text} style={st.whyRow}>
              <Ionicons name={item.icon} size={16} color={COLORS.success} />
              <Text style={[st.whyTxt, { color: COLORS.textSecondary, fontFamily: FONTS.family.regular }]}>{item.text}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 8 }} />
      </ScrollView>

      {/* ── Sticky footer CTA ────────────────────────────────── */}
      <View style={[st.footer, { backgroundColor: COLORS.background, borderTopColor: COLORS.borderLight }]}>
        <TouchableOpacity
          style={[st.ctaBtn, { backgroundColor: canJoin ? COLORS.primary : COLORS.borderLight, ...(canJoin ? SHADOWS.md : {}) }]}
          activeOpacity={canJoin ? 0.9 : 1}
          disabled={!canJoin}
          onPress={() => navigation.navigate('SchemeTerms', { scheme })}
        >
          <Ionicons
            name={canJoin ? 'arrow-forward-circle-outline' : 'lock-closed-outline'}
            size={moderateScale(20)}
            color={canJoin ? COLORS.white : COLORS.textTertiary}
          />
          <Text style={[st.ctaBtnTxt, { color: canJoin ? COLORS.white : COLORS.textTertiary, fontFamily: FONTS.family.bold }]}>
            {canJoin ? 'View Terms & Continue' : 'Enrolment Closed'}
          </Text>
        </TouchableOpacity>
        {!canJoin && (
          <Text style={[st.footerHint, { color: COLORS.textTertiary, fontFamily: FONTS.family.regular }]}>
            This scheme isn't accepting new members right now.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },

  heroWrap: { borderRadius: 20, overflow: 'hidden', marginBottom: 16, height: 190 },
  heroImg: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', padding: 16 },
  heroBadgeRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  metalBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 9 },
  metalBadgeTxt: { color: COLORS.white, fontSize: 10, letterSpacing: 0.3 },
  heroTitle: { color: COLORS.white, fontSize: 19, letterSpacing: -0.2, marginBottom: 3 },
  heroCode: { color: COLORS.whiteOpacity80, fontSize: 11.5 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statCard: {
    flexBasis: '47.5%', flexGrow: 1, borderRadius: 14, borderWidth: 1,
    padding: 13, gap: 6,
  },
  statVal: { fontSize: 15 },
  statLbl: { fontSize: 11 },

  section: { borderRadius: 18, borderWidth: 1, padding: 16, marginBottom: 14 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 12 },
  sectionIconWrap: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { flex: 1 },
  sectionNote: { fontSize: 12, lineHeight: 18, marginTop: 4 },

  amountWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amountChip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12, borderWidth: 1 },
  amountChipTxt: { fontSize: 13 },

  stepRow: { flexDirection: 'row' },
  stepRowGap: {},
  stepRail: { width: 32, alignItems: 'center' },
  stepDot: { width: 26, height: 26, borderRadius: 13, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  stepDotTxt: { fontSize: 11 },
  stepLine: { width: 2, flex: 1, marginTop: 2, borderRadius: 1 },
  stepTitle: { fontSize: 13.5, marginBottom: 2 },
  stepDesc: { fontSize: 11.5, lineHeight: 17 },

  whyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  whyTxt: { flex: 1, fontSize: 12.5, lineHeight: 18 },

  footer: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16, borderTopWidth: 1 },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderRadius: 14, paddingVertical: 15,
  },
  ctaBtnTxt: { fontSize: 15 },
  footerHint: { textAlign: 'center', fontSize: 11.5, marginTop: 8 },
});
