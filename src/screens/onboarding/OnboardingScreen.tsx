import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  StatusBar,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../theme/theme';
import { useOnboardingBanners } from '../../api/hooks/Onboard/useOnboardingBanners';
import { Banner } from '../../types/onboarding';

const ONBOARDING_KEY = '@onboarding_complete';
const { width, height } = Dimensions.get('window');

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { banners, loading, getImageUrl } = useOnboardingBanners();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < banners.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    const last = banners.length - 1;
    flatListRef.current?.scrollToIndex({ index: last });
    setCurrentIndex(last);
  };

  const handleGetStarted = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    navigation.replace('Register');
  };

  const isLast = currentIndex === banners.length - 1;

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Full screen slides */}
      <FlatList
        ref={flatListRef}
        data={banners}
        keyExtractor={(item: Banner) => String(item.BannerId)}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }: { item: Banner }) => (
          <Image
            source={{ uri: getImageUrl(item.image_path) }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      />

      {/* Skip button — top right */}
      {!isLast && (
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip} activeOpacity={0.8}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Bottom controls */}
      <View style={styles.bottom}>
        {/* Dots */}
        <View style={styles.dotsRow}>
          {banners.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentIndex && styles.dotActive,
                i < currentIndex && styles.dotDone,
              ]}
            />
          ))}
        </View>

        {/* Button */}
        {!isLast ? (
          <TouchableOpacity style={styles.btnNext} onPress={handleNext} activeOpacity={0.85}>
            <Text style={styles.btnText}>Next  →</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={styles.btnGetStarted} onPress={handleGetStarted} activeOpacity={0.85}>
              <Text style={styles.btnText}>✦  Get Started</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.replace('Login')} activeOpacity={0.7}>
              <Text style={styles.signInText}>
                Already a member?{'  '}
                <Text style={styles.signInLink}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  image: {
    width,
    height,
  },
  skipBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 40,
    right: SIZES.padding.xl,
    backgroundColor: COLORS.blackOpacity40,
    borderRadius: SIZES.radius.full,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  skipText: {
    fontFamily: FONTS.family.medium,
    fontSize: SIZES.font.sm,
    color: COLORS.white,
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SIZES.padding.xl,
    paddingBottom: Platform.OS === 'ios' ? 44 : 28,
    paddingTop: SIZES.lg,
    backgroundColor: COLORS.blackOpacity40,
    gap: SIZES.md,
    alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.whiteOpacity30,
  },
  dotActive: {
    width: 22,
    backgroundColor: COLORS.white,
    borderRadius: 4,
  },
  dotDone: {
    backgroundColor: COLORS.whiteOpacity70,
  },
  btnNext: {
    width: '100%',
    height: SIZES.button.height.lg,
    borderRadius: SIZES.radius.lg,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.orange,
  },
  btnGetStarted: {
    width: '100%',
    height: SIZES.button.height.lg,
    borderRadius: SIZES.radius.lg,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.gold,
  },
  btnText: {
    fontFamily: FONTS.family.semiBold,
    fontSize: SIZES.font.lg,
    color: COLORS.white,
    letterSpacing: 0.4,
  },
  signInText: {
    fontFamily: FONTS.family.regular,
    fontSize: SIZES.font.xs,
    color: COLORS.whiteOpacity70,
  },
  signInLink: {
    fontFamily: FONTS.family.semiBold,
    color: COLORS.white,
  },
});

export default OnboardingScreen;
