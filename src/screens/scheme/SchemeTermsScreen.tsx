// src/screens/scheme/SchemeTermsScreen.tsx

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTheme } from '../../theme';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { METAL_LABEL, METAL_COLOR } from '../../types/Scheme/Scheme';
import SubPageHeader from '../../components/ui/SubPageHeader';
import AppContentHtml from '../../components/ui/AppContentHtml';
import { useAppContent } from '../../api/hooks/AppContent/useAppContent';

type RouteProps = RouteProp<RootStackParamList, 'SchemeTerms'>;
type NavProps   = NativeStackNavigationProp<RootStackParamList, 'SchemeTerms'>;

export default function SchemeTermsScreen() {
  const { COLORS, FONTS, SIZES, SHADOWS, moderateScale } = useTheme();
  const navigation = useNavigation<NavProps>();
  const route      = useRoute<RouteProps>();
  const { scheme } = route.params;

  const [accepted, setAccepted] = useState(false);
  const checkScale = useRef(new Animated.Value(1)).current;

  // Fetch Terms & Conditions HTML for this scheme: id = SchemeId.
  const { html: termsHtml, loading: termsLoading, error: termsError, refetch: refetchTerms } =
    useAppContent(scheme.SchemeSName);

  const toggleAccept = () => {
    Animated.sequence([
      Animated.spring(checkScale, { toValue: 0.85, useNativeDriver: true, speed: 40 }),
      Animated.spring(checkScale, { toValue: 1,    useNativeDriver: true, speed: 30 }),
    ]).start();
    setAccepted(prev => !prev);
  };

  const handleJoin = () => {
    if (!accepted) return;
    navigation.navigate('SchemeJoin', { scheme });
  };

  const mColor = METAL_COLOR[scheme.MetalType] ?? COLORS.primary;
  const mLabel = METAL_LABEL[scheme.MetalType] ?? scheme.MetalType;
  const isFixed = scheme.FixedIns === 'Y';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top', 'bottom']}>
      {/* ── Header ── */}
      <SubPageHeader title="Terms & Conditions" subtitle={scheme.schemeName} />

      {/* ── Terms & Conditions HTML (fetched from app-content by SchemeId) ── */}
      <View style={{ flex: 1 }}>
        <AppContentHtml
          html={termsHtml}
          loading={termsLoading}
          error={termsError}
          onRetry={refetchTerms}
          bannerHtml={`
            <div style="display:flex;align-items:flex-start;background:${mColor}12;border:1px solid ${mColor}30;border-radius:16px;padding:16px;margin-bottom:20px;gap:14px">
              <div style="width:52px;height:52px;border-radius:14px;background:${mColor}20;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:24px">💎</div>
              <div style="flex:1">
                <div style="font-size:16px;font-weight:700;margin-bottom:2px">${scheme.schemeName}</div>
                <div style="font-size:12px;opacity:0.7;margin-bottom:8px">Code: ${scheme.SchemeSName}</div>
                <div style="display:flex;flex-wrap:wrap;gap:6px">
                  <span style="background:${mColor}18;color:${mColor};padding:3px 8px;border-radius:20px;font-size:11px;font-weight:600">${scheme.Instalment} Instalments</span>
                  <span style="background:${COLORS.success}15;color:${COLORS.success};padding:3px 8px;border-radius:20px;font-size:11px;font-weight:600">${isFixed ? 'Fixed Amount' : 'Flexible Amount'}</span>
                  <span style="background:${mColor}18;color:${mColor};padding:3px 8px;border-radius:20px;font-size:11px;font-weight:600">${mLabel}</span>
                </div>
              </div>
            </div>
          `}
        />
      </View>

      {/* ── Fixed Footer ── */}
      <View style={[styles.footer, { backgroundColor: COLORS.background, borderTopColor: COLORS.borderLight, paddingBottom: Platform.OS === 'ios' ? 4 : 16 }]}>
                <TouchableOpacity
          style={[
            styles.acceptRow,
            {
              backgroundColor: accepted ? COLORS.primary + '08' : COLORS.card,
              borderColor: accepted ? COLORS.primary + '40' : COLORS.borderLight,
            }
          ]}
          onPress={toggleAccept}
          activeOpacity={0.8}
        >
          <Animated.View style={[
            styles.checkbox,
            {
              backgroundColor: accepted ? COLORS.primary : 'transparent',
              borderColor: accepted ? COLORS.primary : COLORS.borderMedium,
              transform: [{ scale: checkScale }],
            }
          ]}>
            {accepted && <Ionicons name="checkmark" size={14} color={COLORS.white} />}
          </Animated.View>
          <Text style={[
            styles.acceptText,
            { color: accepted ? COLORS.textPrimary : COLORS.textSecondary, fontFamily: FONTS.family.medium }
          ]}>
            I have read and agree to all the Terms & Conditions and General Guidelines of{' '}
            <Text style={{ fontFamily: FONTS.family.bold, color: mColor }}>{scheme.schemeName}</Text>.
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.joinBtn, { backgroundColor: accepted ? mColor : COLORS.borderLight, ...(accepted ? SHADOWS.md : {}) }]}
          onPress={handleJoin}
          disabled={!accepted}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle-outline" size={moderateScale(20)} color={accepted ? COLORS.white : COLORS.textTertiary} />
          <Text style={[styles.joinBtnText, { color: accepted ? COLORS.white : COLORS.textTertiary, fontFamily: FONTS.family.bold }]}>
            Join Scheme
          </Text>
        </TouchableOpacity>
        {!accepted && (
          <Text style={[styles.footerHint, { color: COLORS.textTertiary, fontFamily: FONTS.family.regular }]}>
            Please accept the terms to continue
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1 },
  header:           { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
  backBtn:          { width: 40, alignItems: 'center' },
  headerCenter:     { flex: 1, alignItems: 'center' },
  headerTitle:      { fontSize: 18, letterSpacing: -0.3 },
  headerSub:        { fontSize: 12, marginTop: 2, opacity: 0.7 },
  scroll:           { flex: 1 },
  scrollContent:    { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 20 },
  schemeBanner:     { flexDirection: 'row', alignItems: 'flex-start', borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 24, gap: 14 },
  schemeIconWrap:   { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  schemeBannerInfo: { flex: 1 },
  schemeBannerTitle:{ fontSize: 16, marginBottom: 2 },
  schemeBannerSub:  { fontSize: 12, marginBottom: 8, opacity: 0.7 },
  schemeBannerRow:  { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip:             { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, gap: 4 },
  chipText:         { fontSize: 11 },
  section:          { marginBottom: 20 },
  sectionHeader:    { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 10 },
  sectionIcon:      { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  sectionTitle:     { fontSize: 16 },
  termRow:          { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, gap: 10 },
  bullet:           { width: 6, height: 6, borderRadius: 3, marginTop: 7, flexShrink: 0 },
  bulletNumber:     { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  bulletNumberText: { fontSize: 10 },
  termText:         { flex: 1, fontSize: 13, lineHeight: 20 },
  divider:          { height: 1, marginVertical: 20 },
  acceptRow:        { flexDirection: 'row', alignItems: 'flex-start', padding: 16, borderRadius: 14, borderWidth: 1.5, gap: 12 },
  checkbox:         { width: 22, height: 22, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  acceptText:       { flex: 1, fontSize: 13, lineHeight: 20 },
  footer:           { paddingHorizontal: 16, paddingTop: 14, borderTopWidth: 1 },
  joinBtn:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 14, gap: 8 },
  joinBtnText:      { fontSize: 16 },
  footerHint:       { textAlign: 'center', fontSize: 12, marginTop: 8, marginBottom: 4 },
});
