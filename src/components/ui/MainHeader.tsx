// src/components/ui/MainHeader.tsx

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';
import { useAppSelector } from '../../store/hooks';
import LOGO from '../../assets/company/logo.png';

type Props = {
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
};

export default function MainHeader({ onMenuPress, onNotificationPress }: Props) {
  const { COLORS, FONTS, SIZES, moderateScale, verticalScale } = useTheme();
  const user = useAppSelector((s) => s.auth.user);
  const firstName = user?.username ?? 'User';

  const slideY = useRef(new Animated.Value(-40)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideY, { toValue: 0, useNativeDriver: true, damping: 18, stiffness: 150 }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <LinearGradient
        colors={COLORS.gradient.orangePrimary as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView edges={['top']}>
          <View pointerEvents="none" style={[styles.circle1, { backgroundColor: COLORS.whiteOpacity10 }]} />
          <View pointerEvents="none" style={[styles.circle2, { backgroundColor: COLORS.goldOpacity20 }]} />

          <Animated.View
            style={[
              styles.container,
              {
                paddingHorizontal: SIZES.padding.container,
                paddingVertical: SIZES.padding.md,
                minHeight: verticalScale(70),
                transform: [{ translateY: slideY }],
                opacity: fadeAnim,
              },
            ]}
          >
            {/* LEFT: menu + logo + brand */}
            <View style={styles.leftContainer}>
              <AnimatedIconButton onPress={onMenuPress} bg={COLORS.whiteOpacity20} size={moderateScale(42)}>
                <Ionicons name="menu-outline" size={moderateScale(22)} color={COLORS.white} />
              </AnimatedIconButton>

              <View style={styles.brandContainer}>
                <View style={styles.logoWrapper}>
                  <Image source={LOGO} resizeMode="cover" style={styles.logo} />
                </View>
                <View>
                  <Text style={{ fontFamily: FONTS.family.trajanBold, fontSize: SIZES.font.xl, color: COLORS.white, lineHeight: moderateScale(24) }}>
                    Dhanapal
                  </Text>
                  <Text style={{ fontFamily: FONTS.family.trajanBold, fontSize: SIZES.font.xs, color: COLORS.primaryPale, textTransform: 'uppercase', letterSpacing: 1.5 ,}}>
                    DigiGold
                  </Text>
                </View>
              </View>
            </View>

            {/* RIGHT: notification */}
            <AnimatedIconButton onPress={onNotificationPress} bg={COLORS.whiteOpacity20} size={moderateScale(42)}>
              <Ionicons name="notifications-outline" size={moderateScale(22)} color={COLORS.white} />
            </AnimatedIconButton>
          </Animated.View>

          {/* GREETING STRIP */}
          {/* <View style={[styles.greetingStrip, { backgroundColor: COLORS.blackOpacity20, paddingHorizontal: SIZES.padding.container }]}>
            <Text style={{ fontFamily: FONTS.family.regular, fontSize: SIZES.font.xs, color: COLORS.whiteOpacity80 }}>
              👋 Welcome back,{' '}
              <Text style={{ fontFamily: FONTS.family.trajanBold, color: COLORS.white }}>{firstName}</Text>
            </Text>
          </View> */}
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

function AnimatedIconButton({ children, onPress, bg, size }: {
  children: React.ReactNode;
  onPress?: () => void;
  bg: string;
  size: number;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={() => Animated.spring(scale, { toValue: 0.88, useNativeDriver: true, speed: 40 }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }).start()}
    >
      <Animated.View style={[styles.iconBtn, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg, transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  leftContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  brandContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoWrapper: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 50, height: 50, borderRadius: 25 },
  iconBtn: { alignItems: 'center', justifyContent: 'center' },
  greetingStrip: { paddingVertical: 6 },
  circle1: { position: 'absolute', width: 140, height: 140, borderRadius: 100, top: -50, right: -30 },
  circle2: { position: 'absolute', width: 80, height: 80, borderRadius: 40, top: 20, right: 80 },
});
