// src/screens/SchemePassbook/SchemePassbook.tsx
//
// Full scheme passbook page — shows a member's joined-scheme data section-wise:
// hero summary, personal info, scheme details, payment summary,
// a bank-statement-style payment history, and an installment due-date timeline.
// Data source: PPData (see src/types/Account/PhoneDetails.ts), passed in as a
// nav param from GlassSchemeCard / wherever the scheme list lives.

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTheme } from '../../theme';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { PPData, PaymentHistory } from '../../types/Account/PhoneDetails';
import AppHeader from '../../components/ui/appcomponents/AppHeader';

type RouteProps = RouteProp<RootStackParamList, 'SchemePassbook'>;
type NavProps = NativeStackNavigationProp<RootStackParamList, 'SchemePassbook'>;

// ── Helpers ───────────────────────────────────────────────────────
function formatDate(raw?: string | null): string {
  if (!raw) return '—';
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDay(raw?: string | null): string {
  if (!raw) return '';
  const d = new Date(raw);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', { weekday: 'short' });
}

function formatTime(raw?: string | null): string {
  if (!raw) return '';
  const d = new Date(raw);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function currency(v: number | string | null | undefined): string {
  const n = typeof v === 'string' ? parseFloat(v) : (v ?? 0);
  if (isNaN(n)) return '₹0';
  return `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

function daysUntil(raw?: string | null): number | null {
  if (!raw) return null;
  const target = new Date(raw);
  if (isNaN(target.getTime())) return null;
  const today = new Date();
  const a = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  const b = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  return Math.round((a - b) / 86400000);
}

function schemeStatus(pp: PPData): 'active' | 'pending' | 'completed' {
  const ct = pp.schemeClosedSummary?.closeType ?? '';
  if (ct && ct.trim() !== '') return 'completed';
  const paid = parseInt(pp.schemeSummary?.schemaSummaryTransBalance?.insPaid ?? '0');
  return paid > 0 ? 'active' : 'pending';
}

const STATUS_CLR: Record<string, string> = {
  active: '#34D399',
  pending: '#FBBF24',
  completed: '#F5D78E',
};

// Guess a payment-method icon/label from bank/chq metadata.
function paymentMethod(p: PaymentHistory): { label: string; icon: keyof typeof Ionicons.glyphMap } {
  const bank = (p.chqBank ?? '').toLowerCase();
  if (bank.includes('razorpay') || (p.chq_CardNo ?? '').startsWith('pay_')) {
    return { label: 'Online Payment', icon: 'phone-portrait-outline' };
  }
  if (bank) return { label: p.chqBank, icon: 'business-outline' };
  return { label: 'Cash', icon: 'cash-outline' };
}

// ── Section wrapper ──────────────────────────────────────────────
function Section({
  title, icon, count, collapsible, expanded, onToggle, previewName, previewMobile, children,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  count?: number;
  collapsible?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
  previewName?: string;
  previewMobile?: string;
  children: React.ReactNode;
}) {
  const { COLORS, FONTS, SIZES, SHADOWS } = useTheme();
  const HeaderWrapper = collapsible ? TouchableOpacity : View;
  return (
    <View style={[s.section, { backgroundColor: COLORS.surface, borderColor: COLORS.borderSubtle, ...SHADOWS.sm }]}>
      <HeaderWrapper
        style={[s.sectionHeader, { borderBottomColor: collapsible && !expanded ? 'transparent' : COLORS.borderSubtle }]}
        {...(collapsible ? { onPress: onToggle, activeOpacity: 0.7 } : {})}
      >
        <View style={s.sectionHeaderLeft}>
          <View style={[s.sectionIconWrap, { backgroundColor: COLORS.brand + '12' }]}>
            <Ionicons name={icon} size={15} color={COLORS.brand} />
          </View>
          <Text style={[s.sectionTitle, { color: COLORS.contentPrimary, fontFamily: FONTS.family.bold, fontSize: SIZES.font.md }]}>
            {title}
          </Text>
        </View>
        <View style={s.sectionHeaderRight}>
          {typeof count === 'number' && (
            <View style={[s.countPill, { backgroundColor: COLORS.surfaceMuted }]}>
              <Text style={[s.countPillTxt, { color: COLORS.contentSecondary, fontFamily: FONTS.family.semiBold }]}>{count}</Text>
            </View>
          )}
          {collapsible && (
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={COLORS.contentMuted}
            />
          )}
        </View>
      </HeaderWrapper>
      {(!collapsible || expanded) && (
        <View style={s.sectionBody}>{children}</View>
      )}
      {(collapsible && !expanded) && (
        <View style={[s.sectionBody, { paddingVertical: 10 }]}>
          <View style={s.previewRow}>
            <Ionicons name="person-outline" size={13} color={COLORS.contentMuted} />
            <Text style={[s.previewTxt, { color: COLORS.contentSecondary, fontFamily: FONTS.family.medium }]}>
              {previewName}
            </Text>
            {previewMobile ? (
              <>
                <View style={[s.previewDot, { backgroundColor: COLORS.borderStrong }]} />
                <Ionicons name="call-outline" size={13} color={COLORS.contentMuted} />
                <Text style={[s.previewTxt, { color: COLORS.contentSecondary, fontFamily: FONTS.family.medium }]}>
                  {previewMobile}
                </Text>
              </>
            ) : null}
          </View>
        </View>
      )}
    </View>
  );
}

// ── Key / value row ──────────────────────────────────────────────
function Row({ label, value, valueColor, last }: { label: string; value: string; valueColor?: string; last?: boolean }) {
  const { COLORS, FONTS, SIZES } = useTheme();
  return (
    <View style={[s.row, !last && { borderBottomWidth: 1, borderBottomColor: COLORS.borderSubtle + '90' }]}>
      <Text style={[s.rowLabel, { color: COLORS.contentMuted, fontFamily: FONTS.family.regular, fontSize: SIZES.font.sm }]}>
        {label}
      </Text>
      <Text
        numberOfLines={2}
        style={[s.rowValue, { color: valueColor ?? COLORS.contentPrimary, fontFamily: FONTS.family.semiBold, fontSize: SIZES.font.sm }]}
      >
        {value}
      </Text>
    </View>
  );
}

// ── Payment history — bank-statement style transaction card ──────
function TransactionCard({ item, isLast, onView }: { item: PaymentHistory; isLast: boolean; onView: () => void }) {
  const { COLORS, FONTS, SIZES } = useTheme();
  const method = paymentMethod(item);

  return (
    <View style={[s.txnCard, !isLast && s.txnCardGap]}>
      {/* Left rail: icon + connecting line */}
      <View style={s.txnRail}>
        <View style={[s.txnIconWrap, { backgroundColor: COLORS.success + '14', borderColor: COLORS.success + '30' }]}>
          <Ionicons name={method.icon} size={16} color={COLORS.success} />
        </View>
        {!isLast && <View style={[s.txnRailLine, { backgroundColor: COLORS.borderSubtle }]} />}
      </View>

      {/* Card body */}
      <View style={[s.txnBody, { backgroundColor: COLORS.surfaceMuted, borderColor: COLORS.borderSubtle }]}>
        <View style={s.txnTopRow}>
          <View style={{ flex: 1 }}>
            <Text style={[s.txnTitle, { color: COLORS.contentPrimary, fontFamily: FONTS.family.bold, fontSize: SIZES.font.sm }]}>
              Installment #{item.installment}
            </Text>
            <Text style={[s.txnSub, { color: COLORS.contentMuted, fontFamily: FONTS.family.regular }]}>
              {formatDay(item.updateTime)}, {formatDate(item.updateTime)} · {formatTime(item.updateTime)}
            </Text>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[s.txnAmount, { color: COLORS.success, fontFamily: FONTS.family.bold, fontSize: SIZES.font.lg }]}>
              +{currency(item.amount)}
            </Text>
            <View style={s.txnStatusRow}>
              <View style={[s.statusPill, { backgroundColor: COLORS.success + '16' }]}>
                <View style={[s.statusDot, { backgroundColor: COLORS.success }]} />
                <Text style={[s.statusPillTxt, { color: COLORS.success, fontFamily: FONTS.family.semiBold }]}>PAID</Text>
              </View>
              <TouchableOpacity
                style={[s.txnViewBtn, { backgroundColor: COLORS.brand + '14', borderColor: COLORS.brand + '30' }]}
                activeOpacity={0.75}
                onPress={onView}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <Ionicons name="eye-outline" size={13} color={COLORS.brand} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={[s.txnDivider, { backgroundColor: COLORS.border + '80' }]} />

        <View style={s.txnFooter}>
          <View style={s.txnFooterItem}>
            <Text style={[s.txnFooterLbl, { color: COLORS.contentMuted, fontFamily: FONTS.family.regular }]}>Receipt No</Text>
            <Text style={[s.txnFooterVal, { color: COLORS.contentSecondary, fontFamily: FONTS.family.semiBold }]}>{item.receiptNo}</Text>
          </View>
          {item.weight ? (
            <View style={s.txnFooterItem}>
              <Text style={[s.txnFooterLbl, { color: COLORS.contentMuted, fontFamily: FONTS.family.regular }]}>Gold Weight</Text>
              <Text style={[s.txnFooterVal, { color: COLORS.contentSecondary, fontFamily: FONTS.family.semiBold }]}>{item.weight} g</Text>
            </View>
          ) : null}
          <View style={s.txnFooterItem}>
            <Text style={[s.txnFooterLbl, { color: COLORS.contentMuted, fontFamily: FONTS.family.regular }]}>Method</Text>
            <Text style={[s.txnFooterVal, { color: COLORS.contentSecondary, fontFamily: FONTS.family.semiBold }]}>{method.label}</Text>
          </View>
        </View>

        {item.chq_CardNo ? (
          <Text numberOfLines={1} style={[s.txnRef, { color: COLORS.contentMuted, fontFamily: FONTS.family.regular }]}>
            Txn / Ref ID: {item.chq_CardNo}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

// ── Upcoming due dates — vertical installment timeline ────────────
function DueTimelineItem({
  date, index, isNext, isLast,
}: { date: string; index: number; isNext: boolean; isLast: boolean }) {
  const { COLORS, FONTS, SIZES } = useTheme();
  const remaining = daysUntil(date);
  const remainingLabel =
    remaining === null ? '' :
    remaining === 0 ? 'Due today' :
    remaining === 1 ? 'Due tomorrow' :
    remaining > 0 ? `In ${remaining} days` : 'Overdue';

  return (
    <View style={[s.dueItem, !isLast && s.dueItemGap]}>
      <View style={s.txnRail}>
        <View
          style={[
            s.dueDot,
            {
              backgroundColor: isNext ? COLORS.brand : COLORS.surface,
              borderColor: isNext ? COLORS.brand : COLORS.border,
            },
          ]}
        >
          <Text style={[s.dueDotTxt, { color: isNext ? COLORS.white : COLORS.contentMuted, fontFamily: FONTS.family.bold }]}>
            {index + 1}
          </Text>
        </View>
        {!isLast && <View style={[s.txnRailLine, { backgroundColor: COLORS.borderSubtle }]} />}
      </View>

      <View
        style={[
          s.dueBody,
          {
            backgroundColor: isNext ? COLORS.brand + '0C' : COLORS.surfaceMuted,
            borderColor: isNext ? COLORS.brand + '35' : COLORS.borderSubtle,
          },
        ]}
      >
        <View>
          <Text style={[s.dueDate, { color: COLORS.contentPrimary, fontFamily: FONTS.family.bold, fontSize: SIZES.font.sm }]}>
            {formatDate(date)}
          </Text>
          <Text style={[s.dueDay, { color: COLORS.contentMuted, fontFamily: FONTS.family.regular }]}>
            {formatDay(date)}  ·  {remainingLabel}
          </Text>
        </View>
        {isNext && (
          <View style={[s.nextTag, { backgroundColor: COLORS.brand }]}>
            <Text style={[s.nextTagTxt, { color: COLORS.white, fontFamily: FONTS.family.bold }]}>NEXT</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────
export default function SchemePassbook() {
  const { COLORS, FONTS, SIZES } = useTheme();
  const navigation = useNavigation<NavProps>();
  const route = useRoute<RouteProps>();
  const ppData = route.params?.ppData as PPData;
  const [dueExpanded, setDueExpanded] = useState(false);
  const [personalExpanded, setPersonalExpanded] = useState(false);

  const status = schemeStatus(ppData);
  const done = status === 'completed';

  const paid = parseInt(ppData.schemeSummary?.schemaSummaryTransBalance?.insPaid ?? '0');
  const total = parseInt(ppData.schemeSummary?.instalment ?? '1');
  const pct = total > 0 ? Math.min(paid / total, 1) : 0;

  const history = useMemo(
    () => [...(ppData.paymentHistoryList ?? [])].sort(
      (a, b) => parseInt(b.installment) - parseInt(a.installment),
    ),
    [ppData.paymentHistoryList],
  );

  const hg = (COLORS as any)?.gradient?.orangeDeep ?? ['#8E0F42', '#C2185B'];
  const deep = (COLORS as any)?.orangeDeep ?? '#6B0930';
  const gradColors: [string, string, string] = [hg[1] ?? '#C2185B', hg[0] ?? '#8E0F42', deep];

  const bal = ppData.schemeSummary?.schemaSummaryTransBalance;

  // Bonus is intentionally not surfaced anywhere on this page — only real,
  // always-present figures from the API are shown.
  const remainingInstallments = Math.max(total - paid, 0);

  // Middle hero stat: how many installments are still left to pay.
  const middleStat = done
    ? { label: 'Remaining', value: 'Completed' }
    : { label: 'Remaining', value: `${remainingInstallments} EMI${remainingInstallments === 1 ? '' : 's'}` };

  const remainingDueDates = ppData.remainingDueDates ?? [];
  const visibleDueDates = dueExpanded ? remainingDueDates : remainingDueDates.slice(0, 1);

  return (
    <SafeAreaView style={[s.flex, { backgroundColor: COLORS.surfacePage }]} edges={['bottom']}>
      <AppHeader title="Scheme Passbook" subtitle={ppData.schemeSummary?.schemeName} showBack  />

      <ScrollView
        style={s.flex}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero card ─────────────────────────────────────── */}
        <View style={s.heroWrap}>
          <LinearGradient
            colors={gradColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.hero}
          >
            <View style={s.heroTopRow}>
              <View style={s.heroIconWrap}>
                <Ionicons name="diamond-outline" size={20} color="#fff" />
              </View>
              <View style={[s.badge, { backgroundColor: STATUS_CLR[status] + 'E6' }]}>
                <Text style={[s.badgeTxt, { fontFamily: FONTS.family.bold }]}>{status.toUpperCase()}</Text>
              </View>
            </View>

            <Text style={[s.heroTitle, { fontFamily: FONTS.family.bold }]} numberOfLines={1}>
              {ppData.schemeSummary?.schemeName ?? '—'}
            </Text>
            <Text style={[s.heroSub, { fontFamily: FONTS.family.semiBold }]}>
              Reg No: {ppData.regNo} - GroupCode:  {ppData.groupCode}   •  ID: {ppData.personalInfo?.personalId}
            </Text>

            <View style={s.heroStatsRow}>
              <View style={{ flex: 1 }}>
                <Text style={[s.heroVal, { fontFamily: FONTS.family.bold }]}>{currency(ppData.totalAmount)}</Text>
                <Text style={[s.heroLbl, { fontFamily: FONTS.family.regular }]}>Invested</Text>
              </View>
              <View style={s.heroDiv} />
              <View style={{ flex: 1 }}>
                <Text style={[s.heroVal, { fontFamily: FONTS.family.bold }]} numberOfLines={1}>{middleStat.value}</Text>
                <Text style={[s.heroLbl, { fontFamily: FONTS.family.regular }]}>{middleStat.label}</Text>
              </View>
              <View style={s.heroDiv} />
              <View style={{ flex: 1 }}>
                <Text style={[s.heroVal, { fontFamily: FONTS.family.bold }]}>{paid}/{total}</Text>
                <Text style={[s.heroLbl, { fontFamily: FONTS.family.regular }]}>EMIs Paid</Text>
              </View>
            </View>

            <View style={s.heroTrack}>
              <View style={[s.heroFill, { width: `${Math.min(pct * 100, 100)}%` as any }]} />
            </View>
            <View style={s.heroMetaRow}>
              <Text style={[s.heroNext, { fontFamily: FONTS.family.regular }]} numberOfLines={1}>
                {done ? 'Scheme completed' : `Next due: ${formatDate(ppData.nextDueDate)}`}
              </Text>
              <Text style={[s.heroPct, { fontFamily: FONTS.family.semiBold }]}>{Math.round(pct * 100)}%</Text>
            </View>

            {/* Join / Last Paid / Maturity — quick-glance dates */}
            <View style={s.heroDatesRow}>
              <View style={s.heroDateItem}>
                <View style={s.heroDateTopRow}>
                  <Ionicons name="log-in-outline" size={11} color="rgba(255,255,255,0.75)" />
                  <Text style={[s.heroDateLbl, { fontFamily: FONTS.family.regular }]}>Joined</Text>
                </View>
                <Text style={[s.heroDateVal, { fontFamily: FONTS.family.semiBold }]} numberOfLines={1}>
                  {formatDate(ppData.joinDate)}
                </Text>
              </View>
              <View style={s.heroDateItem}>
                <View style={s.heroDateTopRow}>
                  <Ionicons name="checkmark-done-outline" size={11} color="rgba(255,255,255,0.75)" />
                  <Text style={[s.heroDateLbl, { fontFamily: FONTS.family.regular }]}>Last Paid</Text>
                </View>
                <Text style={[s.heroDateVal, { fontFamily: FONTS.family.semiBold }]} numberOfLines={1}>
                  {formatDate(ppData.lastPaidDate)}
                </Text>
              </View>
              <View style={s.heroDateItem}>
                <View style={s.heroDateTopRow}>
                  <Ionicons name="flag-outline" size={11} color="rgba(255,255,255,0.75)" />
                  <Text style={[s.heroDateLbl, { fontFamily: FONTS.family.regular }]}>Maturity</Text>
                </View>
                <Text style={[s.heroDateVal, { fontFamily: FONTS.family.semiBold }]} numberOfLines={1}>
                  {formatDate(ppData.maturityDate)}
                </Text>
              </View>
            </View>

            {!done && (
              <TouchableOpacity
                style={s.payBtn}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('PayInstallment', { ppData })}
              >
                <Ionicons name="card-outline" size={15} color={deep} />
                <Text style={[s.payBtnTxt, { color: deep, fontFamily: FONTS.family.bold }]}>Pay Next Installment</Text>
              </TouchableOpacity>
            )}
          </LinearGradient>
        </View>

        {/* ── Personal info ─────────────────────────────────── */}
        <Section
          title="Personal Information"
          icon="person-outline"
          collapsible
          expanded={personalExpanded}
          onToggle={() => setPersonalExpanded(v => !v)}
          previewName={ppData.personalInfo?.pName ?? ppData.pName}
          previewMobile={ppData.personalInfo?.mobile}
        >
          <Row label="Name" value={ppData.personalInfo?.pName ?? ppData.pName} />
          <Row label="Personal ID" value={ppData.personalInfo?.personalId ?? '—'} />
          <Row label="Mobile" value={ppData.personalInfo?.mobile ?? '—'} />
          <Row
            label="Address"
            value={[
              ppData.personalInfo?.doorNo,
              ppData.personalInfo?.address1,
              ppData.personalInfo?.address2,
              ppData.personalInfo?.area,
              ppData.personalInfo?.city,
            ].filter(Boolean).join(', ') || '—'}
          />
          <Row
            label="State / Pin"
            value={`${ppData.personalInfo?.state ?? '—'} - ${ppData.personalInfo?.pinCode ?? '—'}`}
          />
          <Row label="Country" value={ppData.personalInfo?.country ?? '—'} last />
        </Section>
        
        {/* ── Payment summary ───────────────────────────────── */}
        <Section title="Payment Summary" icon="wallet-outline">
          <Row label="Amount Received" value={currency(bal?.amtrecd)} />
          <Row label="Installments Paid" value={`${paid} of ${total}`} />
          <Row
            label="Installments Remaining"
            value={done ? 'Completed' : String(remainingInstallments)}
            valueColor={done ? COLORS.success : COLORS.brand}
            last
          />

          <View style={[s.summaryTotalBox, { backgroundColor: COLORS.brand + '0A', borderColor: COLORS.brand + '25' }]}>
            <View style={s.summaryTotalRow}>
              <Text style={[s.summaryGrandLbl, { color: COLORS.contentPrimary, fontFamily: FONTS.family.bold }]}>
                Total Amount Paid
              </Text>
              <Text style={[s.summaryGrandVal, { color: COLORS.brand, fontFamily: FONTS.family.bold }]}>
                {currency(ppData.totalAmount)}
              </Text>
            </View>
          </View>
        </Section>

        {/* ── Payment history ───────────────────────────────── */}
        <Section title="Payment History" icon="time-outline" count={history.length}>
          {history.length === 0 ? (
            <View style={s.emptyWrap}>
              <Ionicons name="receipt-outline" size={28} color={COLORS.contentMuted} />
              <Text style={[s.emptyTxt, { color: COLORS.contentMuted, fontFamily: FONTS.family.regular }]}>
                No payments recorded yet
              </Text>
            </View>
          ) : (
            <View>
              {history.map((item, idx) => (
                <TransactionCard
                  key={`${item.receiptNo}-${idx}`}
                  item={item}
                  isLast={idx === history.length - 1}
                  onView={() => navigation.navigate('PaymentReceipt', { ppData, payment: item })}
                />
              ))}
            </View>
          )}
        </Section>

        {/* ── Remaining due dates ───────────────────────────── */}
        {!done && remainingDueDates.length > 0 && (
          <Section title="Upcoming Due Dates" icon="calendar-outline" count={remainingDueDates.length}>
            <View>
              {visibleDueDates.map((d, i) => (
                <DueTimelineItem
                  key={`${d}-${i}`}
                  date={d}
                  index={i}
                  isNext={i === 0}
                  isLast={i === visibleDueDates.length - 1}
                />
              ))}
            </View>

            {remainingDueDates.length > 1 && (
              <TouchableOpacity
                style={[s.expandBtn, { borderColor: COLORS.borderSubtle, backgroundColor: COLORS.surfaceMuted }]}
                activeOpacity={0.8}
                onPress={() => setDueExpanded((v) => !v)}
              >
                <Text style={[s.expandBtnTxt, { color: COLORS.brand, fontFamily: FONTS.family.semiBold }]}>
                  {dueExpanded ? 'Show Less' : `View All ${remainingDueDates.length} Due Dates`}
                </Text>
                <Ionicons name={dueExpanded ? 'chevron-up' : 'chevron-down'} size={14} color={COLORS.brand} />
              </TouchableOpacity>
            )}
          </Section>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },

  // Hero
  heroWrap: {
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 6,
    marginBottom: 16,
  },
  hero: { borderRadius: 22, padding: 18 },
  heroTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  heroIconWrap: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.22)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center', justifyContent: 'center',
  },
  badge: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 10 },
  badgeTxt: { color: '#1A1303', fontSize: 9, letterSpacing: 0.4 },
  heroTitle: { color: '#fff', fontSize: 19, letterSpacing: -0.2 },
  heroSub: { color: 'rgba(255,255,255,0.78)', fontSize: 11, marginTop: 2, marginBottom: 16 },

  heroStatsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  heroVal: { color: '#fff', fontSize: 14 },
  heroLbl: { color: 'rgba(255,255,255,0.72)', fontSize: 10, marginTop: 2 },
  heroDiv: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.28)', marginHorizontal: 10 },

  heroTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.28)', borderRadius: 3, marginBottom: 8, overflow: 'hidden' },
  heroFill: { height: '100%', backgroundColor: '#fff', borderRadius: 3 },
  heroMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  heroNext: { color: 'rgba(255,255,255,0.85)', fontSize: 12, flex: 1, marginRight: 8 },
  heroPct: { color: '#fff', fontSize: 12 },

  heroDatesRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  heroDateItem: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 11,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)', paddingVertical: 8, paddingHorizontal: 9,
  },
  heroDateTopRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  heroDateLbl: { color: 'rgba(255,255,255,0.75)', fontSize: 9 },
  heroDateVal: { color: '#fff', fontSize: 11 },

  payBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: '#fff', paddingVertical: 12, borderRadius: 12,
  },
  payBtnTxt: { fontSize: 13 },

  // Sections
  section: {
    borderRadius: 18, borderWidth: 1, marginBottom: 14, overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1,
  },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 9, flex: 1 },
  sectionIconWrap: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { flex: 1 },
  sectionBody: { paddingHorizontal: 16, paddingVertical: 6 },
  sectionHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  countPill: { minWidth: 24, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 7 },
  countPillTxt: { fontSize: 11 },

  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingVertical: 10,
  },
  rowLabel: { flex: 0.42 },
  rowValue: { flex: 0.58, textAlign: 'right' },

  // Payment summary total box
  summaryTotalBox: { borderRadius: 14, borderWidth: 1, padding: 14, marginTop: 6, marginBottom: 10 },
  summaryTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  summaryTotalLbl: { fontSize: 12.5 },
  summaryTotalVal: { fontSize: 13.5 },
  summaryTotalDivider: { height: 1, marginVertical: 8 },
  summaryGrandLbl: { fontSize: 14 },
  summaryGrandVal: { fontSize: 17 },

  emptyWrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 24, gap: 8 },
  emptyTxt: { fontSize: 12 },

  // Shared rail (used by both transaction + due-date timelines)
  txnRail: { width: 34, alignItems: 'center' },
  txnRailLine: { width: 2, flex: 1, marginTop: 2, borderRadius: 1 },

  // Payment history — transaction cards
  txnCard: { flexDirection: 'row' },
  txnCardGap: { marginBottom: 4 },
  txnIconWrap: {
    width: 30, height: 30, borderRadius: 15, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  txnBody: {
    flex: 1, borderRadius: 14, borderWidth: 1, padding: 12, marginLeft: 6, marginBottom: 14,
  },
  txnTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  txnTitle: { marginBottom: 2 },
  txnSub: { fontSize: 10.5 },
  txnAmount: { marginBottom: 4 },
  txnStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusDot: { width: 5, height: 5, borderRadius: 3 },
  statusPillTxt: { fontSize: 9, letterSpacing: 0.4 },
  txnViewBtn: {
    width: 22, height: 22, borderRadius: 8, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  txnDivider: { height: 1, marginVertical: 10 },
  txnFooter: { flexDirection: 'row', flexWrap: 'wrap', gap: 18 },
  txnFooterItem: {},
  txnFooterLbl: { fontSize: 9.5, marginBottom: 2 },
  txnFooterVal: { fontSize: 11.5 },
  txnRef: { fontSize: 10, marginTop: 8 },

  // Upcoming due dates — timeline
  dueItem: { flexDirection: 'row' },
  dueItemGap: { marginBottom: 4 },
  dueDot: {
    width: 26, height: 26, borderRadius: 13, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  dueDotTxt: { fontSize: 11 },
  dueBody: {
    flex: 1, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12,
    marginLeft: 6, marginBottom: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  dueDate: { marginBottom: 2 },
  dueDay: { fontSize: 11 },
  nextTag: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
  nextTagTxt: { fontSize: 9.5, letterSpacing: 0.5 },

  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  previewTxt:  { fontSize: 13 },
  previewDot:  { width: 3, height: 3, borderRadius: 2 },

  expandBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderWidth: 1, borderRadius: 12, paddingVertical: 10, marginTop: 2, marginBottom: 10,
  },
  expandBtnTxt: { fontSize: 12.5 },
});
