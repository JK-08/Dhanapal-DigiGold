// src/screens/home/HomeScreen.tsx

import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useTheme } from '../../theme';

// ── App Components ───────────────────────────────────────────────
import AppButton from '../../components/ui/appcomponents/AppButton';
import AppInput from '../../components/ui/appcomponents/AppInput';
import AppCard from '../../components/ui/appcomponents/AppCard';
import AppText from '../../components/ui/appcomponents/AppText';
import AppBadge from '../../components/ui/appcomponents/AppBadge';
import AppChip from '../../components/ui/appcomponents/AppChip';
import AppAvatar from '../../components/ui/appcomponents/AppAvatar';
import AppDivider from '../../components/ui/appcomponents/AppDivider';
import AppLoader from '../../components/ui/appcomponents/AppLoader';
import AppModal from '../../components/ui/appcomponents/AppModal';
import AppIcon from '../../components/ui/appcomponents/AppIcons';
import AppHeader from '../../components/ui/appcomponents/AppHeader';

// ── Other Components ─────────────────────────────────────────────
import Sidebar from '../../components/Sidebar';
import CustomAlert, { AlertType, CustomAlertProps } from '../../components/ui/CustomAlert';

export default function HomeScreen() {
  const { COLORS, FONTS, SIZES, SHADOWS } = useTheme();

  // ── State ────────────────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [passVal, setPassVal] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [selectedChips, setSelectedChips] = useState<string[]>(['Gold SIP']);
  const [centerModal, setCenterModal] = useState(false);
  const [bottomModal, setBottomModal] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [alert, setAlert] = useState<CustomAlertProps>({ visible: false, title: '' });

  const showAlert = (props: Partial<CustomAlertProps>) =>
    setAlert({ ...props, visible: true, title: props.title ?? '' });
  const hideAlert = () => setAlert(prev => ({ ...prev, visible: false }));

  const chips = ['Gold SIP', 'Buy Gold', 'Sell Gold', 'History', 'Offers'];

  const S = {
    container: { flex: 1, backgroundColor: COLORS.background } as const,
    scroll: { padding: SIZES.padding.container, paddingBottom: 60 } as const,
    section: { marginTop: SIZES.margin.lg, marginBottom: SIZES.margin.sm } as const,
    row: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8, flexWrap: 'wrap' as const },
    gap: { marginBottom: SIZES.margin.sm } as const,
    spacer: { height: SIZES.margin.sm } as const,
  };

  return (
    <View style={S.container}>

      {/* ══ AppHeader ══════════════════════════════════════════ */}
      <AppHeader
        title="DigiGold"
        subtitle="Welcome back 👋"
        variant="primary"
        actions={[
          { iconName: 'menu-outline', onPress: () => setSidebarOpen(true) },
          { iconName: 'notifications-outline', onPress: () => { }, badge: 3 },
        ]}
      />

      <ScrollView contentContainerStyle={S.scroll} showsVerticalScrollIndicator={false}>

        {/* ══ AppText ════════════════════════════════════════════ */}
        <AppText variant="h5" style={S.section}>1. AppText Variants</AppText>
        <AppCard variant="outlined" padding="md">
          <AppText variant="h4">Heading H4</AppText>
          <AppText variant="h5">Heading H5</AppText>
          <AppText variant="bodyLarge">Body Large text</AppText>
          <AppText variant="body">Body Regular text</AppText>
          <AppText variant="bodyMedium">Body Medium text</AppText>
          <AppText variant="bodySmall">Body Small text</AppText>
          <AppText variant="caption">Caption text</AppText>
          <AppText variant="captionBold">Caption Bold</AppText>
          <AppText variant="label">Label Text</AppText>
          <AppText variant="labelUppercase">Label Uppercase</AppText>
          <AppText variant="goldText">Gold Text ✦</AppText>
          <AppText variant="orangeText">Orange Text</AppText>
        </AppCard>

        {/* ══ AppButton ══════════════════════════════════════════ */}
        <AppText variant="h5" style={S.section}>2. AppButton Variants</AppText>
        <AppCard variant="outlined" padding="md">
          <View style={S.gap}><AppButton label="Primary Button" variant="primary" onPress={() => { }} /></View>
          <View style={S.gap}><AppButton label="Secondary Button" variant="secondary" onPress={() => { }} /></View>
          <View style={S.gap}><AppButton label="Outline Button" variant="outline" onPress={() => { }} /></View>
          <View style={S.gap}><AppButton label="Ghost Button" variant="ghost" onPress={() => { }} /></View>
          <View style={S.gap}><AppButton label="Danger Button" variant="danger" onPress={() => { }} /></View>
          <View style={S.gap}><AppButton label="Gold Button" variant="gold" onPress={() => { }} /></View>
          <AppDivider label="Sizes" marginVertical={8} />
          <View style={S.gap}><AppButton label="Small Button" size="sm" onPress={() => { }} /></View>
          <View style={S.gap}><AppButton label="Medium Button" size="md" onPress={() => { }} /></View>
          <View style={S.gap}><AppButton label="Large Button" size="lg" onPress={() => { }} /></View>
          <AppDivider label="States" marginVertical={8} />
          <View style={S.gap}><AppButton label="Loading..." loading onPress={() => { }} /></View>
          <View style={S.gap}><AppButton label="Disabled" disabled onPress={() => { }} /></View>
          <AppDivider label="With Icons" marginVertical={8} />
          <View style={S.gap}><AppButton label="Buy Gold" leftIcon="add-circle-outline" onPress={() => { }} /></View>
          <View style={S.gap}><AppButton label="Continue" rightIcon="arrow-forward" onPress={() => { }} /></View>
        </AppCard>

        {/* ══ AppInput ═══════════════════════════════════════════ */}
        <AppText variant="h5" style={S.section}>3. AppInput Variants</AppText>
        <AppCard variant="outlined" padding="md">
          <AppInput
            label="Full Name"
            placeholder="Enter your name"
            leftIcon="person-outline"
            value={inputVal}
            onChangeText={setInputVal}
            required
          />
          <View style={S.spacer} />
          <AppInput
            label="Password"
            placeholder="Enter password"
            leftIcon="lock-closed-outline"
            isPassword
            value={passVal}
            onChangeText={setPassVal}
          />
          <View style={S.spacer} />
          <AppInput
            label="Search"
            placeholder="Search gold plans..."
            leftIcon="search-outline"
            rightIcon="options-outline"
            value={searchVal}
            onChangeText={setSearchVal}
            hint="Try 'SIP' or 'Buy'"
          />
          <View style={S.spacer} />
          <AppInput
            label="Mobile Number"
            placeholder="Enter mobile"
            leftIcon="call-outline"
            error="Invalid mobile number"
            value=""
            onChangeText={() => { }}
          />
        </AppCard>

        {/* ══ AppCard ════════════════════════════════════════════ */}
        <AppText variant="h5" style={S.section}>4. AppCard Variants</AppText>
        <AppCard variant="default" padding="md" style={S.gap}>
          <AppText variant="bodyMedium">Default Card</AppText>
          <AppText variant="caption">With shadow and white background</AppText>
        </AppCard>
        <AppCard variant="outlined" padding="md" style={S.gap}>
          <AppText variant="bodyMedium">Outlined Card</AppText>
          <AppText variant="caption">With border, no shadow</AppText>
        </AppCard>
        <AppCard variant="gold" padding="md" style={S.gap}>
          <AppText variant="bodyMedium">Gold Card ✦</AppText>
          <AppText variant="caption">Light gold background</AppText>
        </AppCard>
        <AppCard variant="flat" padding="md" style={S.gap}>
          <AppText variant="bodyMedium">Flat Card</AppText>
          <AppText variant="caption">Gray50 background, no shadow</AppText>
        </AppCard>
        <AppCard variant="default" padding="md" accentBar style={S.gap}
          onPress={() => showAlert({ type: 'info', title: 'Card Pressed!', message: 'Pressable card with accent bar.', dismissible: false, buttons: [{ label: 'OK', style: 'primary' }] })}>
          <AppText variant="bodyMedium">Pressable + Accent Bar</AppText>
          <AppText variant="caption">Tap me!</AppText>
        </AppCard>

        {/* ══ AppBadge ═══════════════════════════════════════════ */}
        <AppText variant="h5" style={S.section}>5. AppBadge Variants</AppText>
        <AppCard variant="outlined" padding="md">
          <View style={S.row}>
            <AppBadge label="Primary" variant="primary" />
            <AppBadge label="Gold" variant="gold" />
            <AppBadge label="Success" variant="success" />
            <AppBadge label="Error" variant="error" />
            <AppBadge label="Warning" variant="warning" />
            <AppBadge label="Info" variant="info" />
            <AppBadge label="Neutral" variant="neutral" />
          </View>
          <AppDivider label="Sizes" marginVertical={10} />
          <View style={S.row}>
            <AppBadge label="Small" size="sm" variant="primary" />
            <AppBadge label="Medium" size="md" variant="primary" />
            <AppBadge label={99} variant="error" />
            <AppBadge label={120} variant="error" />
          </View>
          <AppDivider label="Dot mode" marginVertical={10} />
          <View style={S.row}>
            <AppBadge label="" dot variant="primary" />
            <AppBadge label="" dot variant="success" />
            <AppBadge label="" dot variant="error" />
            <AppBadge label="" dot variant="gold" />
          </View>
        </AppCard>

        {/* ══ AppChip ════════════════════════════════════════════ */}
        <AppText variant="h5" style={S.section}>6. AppChip Variants</AppText>
        <AppCard variant="outlined" padding="md">
          <AppText variant="caption" style={{ marginBottom: 8 }}>Selectable chips:</AppText>
          <View style={S.row}>
            {chips.map(chip => (
              <AppChip
                key={chip}
                label={chip}
                selected={selectedChips.includes(chip)}
                onPress={() => setSelectedChips(prev =>
                  prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]
                )}
              />
            ))}
          </View>
          <AppDivider label="Variants" marginVertical={10} />
          <View style={S.row}>
            <AppChip label="Default" variant="default" selected />
            <AppChip label="Gold" variant="gold" selected />
            <AppChip label="Outlined" variant="outlined" selected />
            <AppChip label="Disabled" disabled />
          </View>
          <AppDivider label="With icons & remove" marginVertical={10} />
          <View style={S.row}>
            <AppChip label="Buy" leftIcon="add-circle-outline" selected />
            <AppChip label="Filter" leftIcon="filter-outline" />
            <AppChip label="Remove me" onRemove={() => { }} selected />
          </View>
        </AppCard>

        {/* ══ AppAvatar ══════════════════════════════════════════ */}
        <AppText variant="h5" style={S.section}>7. AppAvatar Variants</AppText>
        <AppCard variant="outlined" padding="md">
          <AppText variant="caption" style={{ marginBottom: 10 }}>Sizes:</AppText>
          <View style={S.row}>
            <AppAvatar name="Dhanapal" size="xs" />
            <AppAvatar name="Raj Kumar" size="sm" />
            <AppAvatar name="Priya S" size="md" />
            <AppAvatar name="Arun M" size="lg" />
            <AppAvatar name="Kavya R" size="xl" />
          </View>
          <AppDivider label="With online dot" marginVertical={10} />
          <View style={S.row}>
            <AppAvatar name="Dhanapal" size="md" showOnline />
            <AppAvatar name="Raj" size="lg" showOnline />
          </View>
          <AppDivider label="With edit button" marginVertical={10} />
          <View style={S.row}>
            <AppAvatar name="Dhanapal" size="xl" showEdit onEditPress={() =>
              showAlert({ type: 'info', title: 'Edit Photo', message: 'Camera or gallery?', dismissible: false, buttons: [{ label: 'Cancel', style: 'ghost' }, { label: 'Choose', style: 'primary' }] })
            } />
          </View>
          <AppDivider label="Rounded variant" marginVertical={10} />
          <View style={S.row}>
            <AppAvatar name="DG" size="md" variant="rounded" />
            <AppAvatar name="Gold" size="lg" variant="rounded" />
          </View>
        </AppCard>

        {/* ══ AppDivider ═════════════════════════════════════════ */}
        <AppText variant="h5" style={S.section}>8. AppDivider Variants</AppText>
        <AppCard variant="outlined" padding="md">
          <AppText variant="caption">Plain divider:</AppText>
          <AppDivider />
          <AppText variant="caption">With label:</AppText>
          <AppDivider label="OR" />
          <AppText variant="caption">Custom color & thickness:</AppText>
          <AppDivider color={COLORS.primary} thickness={2} />
          <AppText variant="caption">Gold divider:</AppText>
          <AppDivider color={COLORS.secondary} thickness={1.5} />
          <View style={{ flexDirection: 'row', alignItems: 'center', height: 40, gap: 12, marginTop: 8 }}>
            <AppText variant="caption">Vertical:</AppText>
            <AppDivider orientation="vertical" />
            <AppText variant="caption">divider</AppText>
            <AppDivider orientation="vertical" color={COLORS.primary} thickness={2} />
            <AppText variant="caption">here</AppText>
          </View>
        </AppCard>

        {/* ══ AppIcon ════════════════════════════════════════════ */}
        <AppText variant="h5" style={S.section}>9. AppIcon Variants</AppText>
        <AppCard variant="outlined" padding="md">
          <AppText variant="caption" style={{ marginBottom: 10 }}>Variants:</AppText>
          <View style={S.row}>
            <AppIcon name="home" variant="default" />
            <AppIcon name="star" variant="primary" />
            <AppIcon name="diamond" variant="gold" />
            <AppIcon name="checkmark" variant="success" />
            <AppIcon name="close" variant="error" />
            <AppIcon name="person-outline" variant="ghost" />
          </View>
          <AppDivider label="Pressable icons" marginVertical={10} />
          <View style={S.row}>
            <AppIcon name="notifications-outline" variant="primary" onPress={() =>
              showAlert({ type: 'info', title: 'Notifications', message: 'You have 3 new alerts.', dismissible: false, buttons: [{ label: 'OK', style: 'primary' }] })
            } />
            <AppIcon name="share-outline" variant="gold" onPress={() =>
              showAlert({ type: 'gold', title: 'Share', message: 'Share your gold portfolio!', dismissible: false, buttons: [{ label: 'Cancel', style: 'ghost' }, { label: 'Share', style: 'primary' }] })
            } />
            <AppIcon name="trash-outline" variant="error" onPress={() =>
              showAlert({ type: 'confirm', title: 'Delete?', message: 'This action cannot be undone.', dismissible: false, buttons: [{ label: 'Cancel', style: 'secondary' }, { label: 'Delete', style: 'danger' }] })
            } />
          </View>
          <AppDivider label="Square (rounded=false)" marginVertical={10} />
          <View style={S.row}>
            <AppIcon name="wallet-outline" variant="primary" rounded={false} />
            <AppIcon name="bar-chart" variant="gold" rounded={false} />
            <AppIcon name="receipt-outline" variant="success" rounded={false} />
          </View>
        </AppCard>

        {/* ══ AppLoader ══════════════════════════════════════════ */}
        <AppText variant="h5" style={S.section}>10. AppLoader Variants</AppText>
        <AppCard variant="outlined" padding="md">
          <AppText variant="caption" style={{ marginBottom: 10 }}>Inline loaders:</AppText>
          <View style={S.row}>
            <AppLoader mode="inline" size="sm" />
            <AppLoader mode="inline" size="md" />
            <AppLoader mode="inline" size="lg" />
          </View>
          <AppDivider label="Overlay loader" marginVertical={10} />
          <AppButton
            label="Show Overlay Loader (3s)"
            variant="primary"
            leftIcon="reload-outline"
            onPress={() => {
              setLoaderVisible(true);
              setTimeout(() => setLoaderVisible(false), 3000);
            }}
          />
        </AppCard>

        {/* ══ AppModal ═══════════════════════════════════════════ */}
        <AppText variant="h5" style={S.section}>11. AppModal Variants</AppText>
        <AppCard variant="outlined" padding="md">
          <View style={S.gap}>
            <AppButton
              label="Center Modal"
              variant="primary"
              leftIcon="albums-outline"
              onPress={() => setCenterModal(true)}
            />
          </View>
          <AppButton
            label="Bottom Sheet Modal"
            variant="outline"
            leftIcon="chevron-up-outline"
            onPress={() => setBottomModal(true)}
          />
        </AppCard>

        {/* ══ CustomAlert ════════════════════════════════════════ */}
        <AppText variant="h5" style={S.section}>12. CustomAlert Types</AppText>
        <AppCard variant="outlined" padding="md">
          {[
            { label: '✅  Success', type: 'success' as AlertType, title: 'Payment Successful!', message: 'Your gold purchase of 2.5g is complete.', buttons: [{ label: 'View Receipt', style: 'secondary' as const }, { label: 'Done', style: 'primary' as const }] },
            { label: '❌  Error', type: 'error' as AlertType, title: 'Transaction Failed', message: 'Payment could not be processed. Please retry.', buttons: [{ label: 'Cancel', style: 'ghost' as const }, { label: 'Retry', style: 'danger' as const }] },
            { label: '⚠️  Warning', type: 'warning' as AlertType, title: 'KYC Pending', message: 'Complete KYC to unlock higher investment limits.', buttons: [{ label: 'Later', style: 'ghost' as const }, { label: 'Verify Now', style: 'primary' as const }] },
            { label: 'ℹ️  Info', type: 'info' as AlertType, title: 'Market Update', message: 'Gold rate: ₹6,325/gram (+1.2% today).', buttons: [{ label: 'OK', style: 'primary' as const }] },
            { label: '✦  Gold', type: 'gold' as AlertType, title: 'Premium Offer!', message: 'Buy 5g today and get 0.5g bonus. Limited time!', buttons: [{ label: 'Skip', style: 'secondary' as const }, { label: 'Claim Now', style: 'primary' as const }] },
            { label: '❓  Confirm', type: 'confirm' as AlertType, title: 'Confirm Sell', message: 'Sell 1g at ₹6,250? This cannot be undone.', buttons: [{ label: 'Cancel', style: 'secondary' as const }, { label: 'Yes, Sell', style: 'danger' as const }] },
            { label: '⏳  Loading', type: 'info' as AlertType, title: 'Processing Payment', loading: true, autoDismiss: 3000 },
          ].map((demo, i) => (
            <View key={i} style={S.gap}>
              <AppButton
                label={demo.label}
                variant={i === 0 ? 'primary' : i === 1 ? 'danger' : i === 5 ? 'danger' : i === 3 ? 'secondary' : i === 4 ? 'gold' : 'outline'}
                onPress={() => showAlert({ ...demo, dismissible: false })}
              />
            </View>
          ))}
        </AppCard>

      </ScrollView>

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <Sidebar visible={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ── Overlay Loader ──────────────────────────────────── */}
      <AppLoader visible={loaderVisible} mode="overlay" message="Loading gold data…" />

      {/* ── Center Modal ────────────────────────────────────── */}
      <AppModal
        visible={centerModal}
        onClose={() => setCenterModal(false)}
        title="Gold Investment"
        subtitle="Choose your plan"
        position="center"
      >
        <AppText variant="body" style={{ marginBottom: 12 }}>
          Start your gold SIP from as low as ₹100/month.
        </AppText>
        <View style={{ gap: 8 }}>
          <AppButton label="Start SIP" variant="primary" onPress={() => setCenterModal(false)} />
          <AppButton label="Buy Now" variant="gold" onPress={() => setCenterModal(false)} />
          <AppButton label="Learn More" variant="ghost" onPress={() => setCenterModal(false)} />
        </View>
      </AppModal>

      {/* ── Bottom Sheet Modal ──────────────────────────────── */}
      <AppModal
        visible={bottomModal}
        onClose={() => setBottomModal(false)}
        title="Quick Actions"
        subtitle="What would you like to do?"
        position="bottom"
      >
        <View style={{ gap: 10, marginTop: 8 }}>
          {[
            { label: 'Buy Gold', icon: 'add-circle-outline', variant: 'primary' as const },
            { label: 'Sell Gold', icon: 'trending-up-outline', variant: 'outline' as const },
            { label: 'View Portfolio', icon: 'bar-chart-outline', variant: 'secondary' as const },
            { label: 'Cancel', icon: 'close-outline', variant: 'ghost' as const },
          ].map((item, i) => (
            <AppButton key={i} label={item.label} variant={item.variant} leftIcon={item.icon} onPress={() => setBottomModal(false)} />
          ))}
        </View>
      </AppModal>

      {/* ── CustomAlert ─────────────────────────────────────── */}
      <CustomAlert {...alert} onDismiss={hideAlert} />

    </View>
  );
}
