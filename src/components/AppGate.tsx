import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Linking, Platform,
  TouchableOpacity, Animated, Easing, Dimensions, StatusBar,
} from 'react-native';
import { API_BASE_URL } from '@env';
import Constants from 'expo-constants';
import { useTheme } from '../providers/ThemeProvider';
import CustomAlert from './ui/CustomAlert';

const { width } = Dimensions.get('window');

interface AppConfig {
  PLAYSTORE_VERSION: string;
  STORE_URL: string;
  APPSTORE_VERSION: string;
  APPSTORE_URL: string;
  IS_MAINTENANCE: boolean;
  MAINTENANCE_MSG: string;
}

type Status = 'loading' | 'ok' | 'maintenance' | 'update';

function platformVersion(cfg: AppConfig): string {
  return Platform.OS === 'ios' ? cfg.APPSTORE_VERSION : cfg.PLAYSTORE_VERSION;
}

function isOutdated(current: string, required: string): boolean {
  const c = current.split('.').map(Number);
  const r = required.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if ((c[i] ?? 0) < (r[i] ?? 0)) return true;
    if ((c[i] ?? 0) > (r[i] ?? 0)) return false;
  }
  return false;
}

function splitMessage(msg: string): { english: string; tamil: string } {
  const tamilStart = msg.search(/[\u0B80-\u0BFF]/);
  if (tamilStart === -1) return { english: msg.trim(), tamil: '' };
  return {
    english: msg.slice(0, tamilStart).replace(/[.\s]+$/, '').trim(),
    tamil: msg.slice(tamilStart).trim(),
  };
}

/* ── Spinning gear ── */
function GearIcon() {
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 4000, easing: Easing.linear, useNativeDriver: true })
    ).start();
  }, []);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return <Animated.Text style={{ fontSize: 32, transform: [{ rotate }] }}>⚙️</Animated.Text>;
}

/* ── Pulsing ring ── */
function PulseRing({ color }: { color: string }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale,   { toValue: 1.4, duration: 1100, useNativeDriver: true }),
          Animated.timing(scale,   { toValue: 1,   duration: 1100, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0,   duration: 1100, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.5, duration: 1100, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={{
      position: 'absolute', width: 88, height: 88, borderRadius: 44,
      borderWidth: 2, borderColor: color,
      transform: [{ scale }], opacity,
    }} />
  );
}

/* ── Shared entrance animation ── */
function useEntrance() {
  const fade  = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(36)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade,  { toValue: 1, duration: 650, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 650, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);
  return { fade, slide };
}

/* ── Maintenance Screen ── */
function MaintenanceScreen({ config, onRetry }: { config: AppConfig; onRetry: () => void }) {
  const { COLORS } = useTheme();
  const { fade, slide } = useEntrance();
  const { english, tamil } = splitMessage(config.MAINTENANCE_MSG);

  return (
    <View style={[s.screen, { backgroundColor: COLORS.surfacePage }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brand} />
      <View style={[s.topBar, { backgroundColor: COLORS.brand }]} />

      <Animated.View style={[
        s.card,
        { backgroundColor: COLORS.surface, borderColor: COLORS.borderBrand, shadowColor: COLORS.brand },
        { opacity: fade, transform: [{ translateY: slide }] },
      ]}>
        <View style={s.iconWrap}>
          <PulseRing color={COLORS.brand} />
          <View style={[s.iconCircle, { backgroundColor: COLORS.brandTint, borderColor: COLORS.brand }]}>
            <GearIcon />
          </View>
        </View>

        <View style={[s.badge, { backgroundColor: COLORS.brandSubtle, borderColor: COLORS.brandMuted }]}>
          <Text style={[s.badgeText, { color: COLORS.brand }]}>MAINTENANCE MODE</Text>
        </View>

        <Text style={[s.title, { color: COLORS.contentPrimary }]}>We'll Be Right Back</Text>

        <View style={s.dividerRow}>
          <View style={[s.dividerLine, { backgroundColor: COLORS.border }]} />
          <Text style={[s.dividerDot, { color: COLORS.accentDeep }]}>◆</Text>
          <View style={[s.dividerLine, { backgroundColor: COLORS.border }]} />
        </View>

        <View style={[s.msgBlock, { backgroundColor: COLORS.surfaceMuted, borderLeftColor: COLORS.brand }]}>
          <View style={[s.langTag, { backgroundColor: COLORS.brand }]}>
            <Text style={s.langTagText}>EN</Text>
          </View>
          <Text style={[s.msgText, { color: COLORS.contentSecondary }]}>{english}</Text>
        </View>

        {tamil ? (
          <View style={[s.msgBlock, { backgroundColor: COLORS.accentTint, borderLeftColor: COLORS.accentDeep }]}>
            <View style={[s.langTag, { backgroundColor: COLORS.accentDeep }]}>
              <Text style={s.langTagText}>தமிழ்</Text>
            </View>
            <Text style={[s.msgTamil, { color: COLORS.contentPrimary }]}>{tamil}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[s.btn, { backgroundColor: COLORS.brand, shadowColor: COLORS.brand }]}
          onPress={onRetry}
          activeOpacity={0.8}
        >
          <Text style={[s.btnText, { color: COLORS.contentOnBrand }]}>↻  Retry</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={[s.bottomBar, { backgroundColor: COLORS.accentDeep }]} />
    </View>
  );
}

/* ── AppGate ── */
export default function AppGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>('ok');
  const [config, setConfig] = useState<AppConfig | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${API_BASE_URL}/app-config/all`, { cache: 'no-store' });
        const data: AppConfig[] = await res.json();
        const cfg  = data[0];
        if (!cfg) return;
        setConfig(cfg);
        if (cfg.IS_MAINTENANCE) { setStatus('maintenance'); return; }
        const current = Constants.expoConfig?.version ?? '0.0.0';
        if (isOutdated(current, platformVersion(cfg))) setStatus('update');
      } catch { /* fail open */ }
    })();
  }, []);
  if (status === 'maintenance' && config) return (
    <MaintenanceScreen
      config={config}
      onRetry={async () => {
        setStatus('ok');
        try {
          const res  = await fetch(`${API_BASE_URL}/app-config/all`, { cache: 'no-store' });
          const data: AppConfig[] = await res.json();
          const cfg  = data[0];
          if (!cfg || !cfg.IS_MAINTENANCE) setStatus('ok');
          else setStatus('maintenance');
        } catch { setStatus('ok'); }
      }}
    />
  );

  const url = Platform.OS === 'ios' ? config?.APPSTORE_URL : config?.STORE_URL;

  return (
    <View style={{ flex: 1 }}>
      {children}
      <CustomAlert
        visible={status === 'update'}
        type="gold"
        title={`New Version ${config ? platformVersion(config) : ''} Available`}
        message={
          `A new version is available. Update the app for the latest features and improvements.\n\nபுதிய பதிப்பு கிடைக்கிறது. சிறந்த அனுபவத்திற்கு செயலியை புதுப்பிக்கவும்.`
        }
        dismissible={false}
        buttons={[
          {
            label: 'Update Now',
            style: 'primary',
            onPress: () => { url && Linking.openURL(url); },
          },
        ]}
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen:     { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topBar:     { position: 'absolute', top: 0, left: 0, right: 0, height: 4 },
  bottomBar:  { position: 'absolute', bottom: 0, left: 0, right: 0, height: 4 },

  card: {
    width: width - 40, borderRadius: 20, borderWidth: 1,
    padding: 24, alignItems: 'center',
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 8,
  },

  iconWrap:   { width: 88, height: 88, justifyContent: 'center', alignItems: 'center', marginBottom: 18 },
  iconCircle: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },

  badge:      { borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 12 },
  badgeText:  { fontSize: 10, fontWeight: '700', letterSpacing: 2 },

  title:      { fontSize: 21, fontWeight: '800', textAlign: 'center', marginBottom: 14 },

  dividerRow: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 16 },
  dividerLine:{ flex: 1, height: 1 },
  dividerDot: { fontSize: 10, marginHorizontal: 8 },

  msgBlock:   { width: '100%', borderRadius: 12, borderLeftWidth: 3, padding: 14, marginBottom: 10 },
  langTag:    { alignSelf: 'flex-start', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, marginBottom: 8 },
  langTagText:{ color: '#fff', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  msgText:    { fontSize: 13, lineHeight: 21 },
  msgTamil:   { fontSize: 14, lineHeight: 24 },

  btn:        { marginTop: 6, width: '100%', paddingVertical: 15, borderRadius: 12, alignItems: 'center', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  btnText:    { fontWeight: '800', fontSize: 15, letterSpacing: 0.5 },
});
